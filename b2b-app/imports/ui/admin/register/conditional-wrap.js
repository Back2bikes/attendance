import React from 'react'
import PropTypes from 'prop-types'

/**
 * This component wraps children depending on the 'condition' prop.
 *
 * Example:
 *    <ConditionalWrap
 *      condition={isMobile}
 *      wrapTrue={(children) => <div>{children}</div>}
 *      wrapFalse={(children) => <Paper>{children}</Paper>}>
 *      <h1> Header things </h1>
 *      <p> Content things </p>
 *    </ConditionalWrap>
 *
 * Here we don't want the extra margin/padding that Paper adds in mobile screen widths so it will
 * render children in a plain 'div'. Else, wrap the content in Paper.
 */
const ConditionalWrap = ({ condition, wrapTrue, wrapFalse, children }) => {
  // these checks just make it easier to consume the component. Eg. you can supply just wrapTrue
  // prop and not have to supply wrapFalse because it will just render children as is.
  if (condition && typeof wrapTrue === 'function') {
    return wrapTrue(children)
  } else if (!condition && typeof wrapFalse === 'function') {
    return wrapFalse(children)
  }
  return <>{children}</>
}

ConditionalWrap.propTypes = {
  condition: PropTypes.bool.isRequired,
  wrapTrue: PropTypes.func,
  wrapFalse: PropTypes.func,
  children: PropTypes.node.isRequired,
}

ConditionalWrap.defaultProps = {
  condition: false,
}

export default ConditionalWrap
