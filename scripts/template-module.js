const cc = require('change-case')
const { titleCase } = require('title-case')
const fs = require('fs')
var mkpath = require('mkpath')
const { fixSQLTypes } = require('./parse-module')
const debug = require('debug')('module:templating')

// This feels clumsy, something changed in the change-case module, but the doco doesn't explain how to bring in additional modules
cc.kebabCase = (str) => cc.headerCase(str).toLowerCase()
cc.titleCase = titleCase
let idField = '_id'
let methodsFile = 'methods'

const files = [
  //{ file: 'card', dest: '/imports/ui/admin/my-collection' },
  { file: 'list', dest: '/imports/ui/admin/my-collection' },
  { file: 'lister', dest: '/imports/ui/admin/my-collection' },
  { file: 'index', dest: '/imports/ui/admin/my-collection' },
  { file: 'edit', dest: '/imports/ui/admin/my-collection' },
  // { file: 'edit-schema', dest: '/imports/ui/admin/my-collection', replace: false },
  { file: 'editor', dest: '/imports/ui/admin/my-collection' },
  { file: 'add', dest: '/imports/ui/admin/my-collection' },
  { file: 'adder', dest: '/imports/ui/admin/my-collection' },
  { file: 'config', dest: '/imports/ui/admin/my-collection', replace: false },
  { file: 'view', dest: '/imports/ui/admin/my-collection' },
  { file: 'viewer', dest: '/imports/ui/admin/my-collection' },
  { file: 'publications', dest: '/imports/api/my-collection/server' },
  { file: 'methods', dest: '/imports/api/my-collection' },
  { file: 'methods.sql', dest: '/imports/api/my-collection', db: 'mysql' },
  { file: 'schema', dest: '/imports/api/my-collection' },
  { file: 'schema.sql', dest: '/imports/api/my-collection', db: 'mysql' },
  { file: 'schema.test', dest: '/imports/api/my-collection', db: 'mongo' },
  {
    file: 'factory',
    dest: '/imports/test',
    name: 'factory.my-collection.js',
    db: 'mongo',
  },
  {
    file: 'fixtures',
    dest: '/packages/fixtures',
    name: 'my-collection.json',
    db: 'mongo',
  },
]

const coldefs2String = (coldefs) => {
  const fixers = 'String Date Number Array Boolean Object OptionalRegExId OptionalBlackbox Blackbox RegExId createdAt updatedAt SimpleSchema.Integer OptionalInteger OptionalString'.split(
    /\s+/
  )
  let coldefsJSON = JSON.stringify(coldefs, null, 2)
  fixers.forEach((thing) => {
    const re = new RegExp(`["']${thing}["']`, 'g')
    coldefsJSON = coldefsJSON.replace(re, thing)
  })

  return coldefsJSON.replace(/^\{/, '').replace(/\}$/, '')
}

const fields2Grid = (fields) => {
  const colTemplate =
    "{ field: 'fieldName', title: 'fieldTitle', editor: true , formatter: null}"
  return fields
    .filter((f) => !f.match(/id$/i)) // Don't display id fields in the UI
    .filter((f) => !f.match(/\.\$$/i)) // Don't display array fields in the UI
    .map((f) => {
      let col = colTemplate.replace(/fieldName/g, f)
      col = col.replace(/fieldTitle/g, cc.camelCase(f))
      if (f.match(/ated[_]*At$/i) || f.match(/Date$/i))
        col = col.replace(
          /formatter: null/g,
          "formatter: 'datetime', formatterParams: dateFormat"
        )
      return col
    })
    .join(',\n  ')
}

const buildPubs = (fields) => {
  // Find foreign keys, anything ending in "Id"
  const cnames = fields
    .filter((f) => /Id$/.test(f))
    .map((f) => cc.pascalCase(`${f.replace(/Id$/, '')}s`))
  const pubs = cnames.map((c) => `${c}.find({})`).join(',\n')
  const colls = cnames.map((c) => `${cc.camelCase(c)}: ${c}.find({}).fetch()`).join(',\n')
  let pubImports = cnames
    .map((c) => `import ${c} from '/imports/api/${cc.kebabCase(c)}/schema'`)
    .join('\n')
  const collImports = cnames
    .map((c) => `import ${c} from '/imports/api/${cc.kebabCase(c)}/schema'`)
    .join('\n')
  // Find codeset references, anything ending in "Code"
  const csTables = fields
    .filter((f) => /Code$/.test(f))
    .map((f) => cc.pascalCase(`${f.replace(/Code$/, '')}`))
  if (csTables.length) {
    pubImports =
      pubImports + `\nimport { ${csTables.join()} } from '/imports/api/codesets/schema'`
  }
  return { pubs, pubImports, colls, collImports }
}

const makeCombinations = (collectionName, coldefs, fields, defObject, fixtures) => {
  const flist = Object.keys(fields)
  const { pubs, pubImports, colls, collImports } = buildPubs(flist)
  const defaultObject = defObject || {
    name: 'Untitled',
    description: 'Description',
    code: 'XXX',
  }
  const defObjValues = JSON.stringify(defaultObject, null, 2).replace(
    /["'](Random\.\w+\(\))['"]/g,
    '$1'
  )
  const replacers = {
    defaultObjectValues: `const defaultObject = ${defObjValues}`,
    defObject: `${defObjValues}`,
    myCollection: cc.camelCase(collectionName),
    MyCollection: cc.pascalCase(collectionName),
    my_collection: cc.snakeCase(collectionName),
    mycollection: collectionName.toLowerCase(),
    singularCollection: collectionName.toLowerCase().replace(/s$/, ''),
    'my-collection': cc.kebabCase(collectionName),
    ['My Collection']: cc.titleCase(collectionName),
    TEMPLATED_COLUMNS: coldefs2String(coldefs),
    EDITABLE_COLUMNS: coldefs2String(coldefs),
    TEMPLATED_SQL_COLUMNS: JSON.stringify(fixSQLTypes(coldefs), null, 2).replace(
      /"(DataTypes.\w+)"/g,
      '$1'
    ),
    TEMPLATED_FIELD_LIST: JSON.stringify(flist, null, 0),
    TEMPLATED_COLUMN_GRID: fields2Grid(flist),
    ID_FIELD: idField,
    METHODS_FILE: methodsFile,
    RelatedPublications: pubs,
    MyPubImports: pubImports,
    RelatedCollections: colls,
    myCollImports: collImports,
    Fixtures: fixtures ? JSON.stringify(fixtures, null, 2) : '',
  }
  return Object.keys(replacers).map((key) => {
    if (!replacers[key] && key === 'RelatedCollections') {
      return {
        re: new RegExp(key + ',', 'g'),
        replacer: replacers[key],
      }
    } else {
      return { re: new RegExp(key, 'g'), replacer: replacers[key] }
    }
  })
}
const templating = (data, folder, db) => {
  try {
    console.log(`Templating into ${folder}`, data, folder, db)
    // const cols = data.fields.reduce((acc, f) => {
    //   acc[f] = /Id$/.test(f)
    //     ? { type: 'OptionalRegExId', optional: true }
    //     : { type: 'String', optional: true }
    //   return acc
    // }, {})
    idField = db === 'mongo' ? '_id' : 'id'
    methodsFile = db === 'mongo' ? 'methods' : 'methods.sql'
    const cols = data.fields
    const { defaultObject, fixtures } = data
    const combos = makeCombinations(
      data.collection,
      cols,
      data.fields,
      defaultObject,
      fixtures
    )
    const dir = folder.match(/^\//) ? folder : `./${folder}`
    files.forEach((file) => {
      const destDir = combos.reduce((acc, r) => {
        return acc.replace(r.re, r.replacer)
      }, `${dir}${file.dest}`)
      mkpath.sync(destDir)
      const destFile = combos.reduce((acc, r) => {
        return acc.replace(r.re, r.replacer)
      }, `${dir}${file.dest}/${file.name ? file.name : file.file + '.js'}`)
      const already = fs.existsSync(destFile)
      // Can we replace the file?
      if (!already || (already && file.replace !== false)) {
        const contents = fs.readFileSync(`./scripts/module.templates/${file.file}.js`, {
          encoding: 'utf-8',
        })

        // const dest = (file.name) ?`${destDir}/${file.name}` :`${destDir}/${file.file}.js`
        const buf = combos.reduce((acc, r) => {
          return acc.replace(r.re, r.replacer)
        }, contents)
        if (buf.length > 5 && (!file.db || file.db === db)) {
          debug(`Saving to ${destFile}`)
          fs.writeFileSync(destFile, buf)
        }
      }
    })
  } catch (e) {
    console.error(`Error: ${e.message}`)
  }
}

exports = exports || {}
exports.templating = templating
