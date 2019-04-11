import * as React from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-s-alert'
import { cloneDeep } from 'lodash'

const CartContext = React.createContext()

const initialState = {
  price: 0,
  totalqty: 0,
  products: [],
  prodqty: {}
}

const recalc = state => {
  state.price = state.products.reduce((acc, product) => acc + product.qty * product.price, 0)
  state.totalqty = state.products.reduce((acc, product) => acc + product.qty, 0)
  state.prodqty = {}
  state.products.forEach(prod => {
    state.prodqty[prod._id] = prod.qty
  })
  // This looks like a good moment to save the cart to the db
  if (cartUpdater) {
    cartUpdater(state)
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return cloneDeep(initialState)
    case 'reset-add':
      const newState = cloneDeep(initialState)
      action.payload.qty = 1
      newState.products.push(action.payload)

      recalc(newState)
      Alert.info(`Added ${action.payload.name} to cart`)
      return { ...newState }
    case 'add':
      if (
        !state.products.find((prod, ix) => {
          if (prod._id === action.payload._id) {
            state.products[ix].qty += 1
            return prod
          }
        })
      ) {
        action.payload.qty = 1
        state.products.push(action.payload)
      }

      recalc(state)
      Alert.info(`Added ${action.payload.name} to cart`)
      return { ...state }
    case 'remove':
      const i = state.products.findIndex((prod, ix) => {
        if (prod._id === action.payload) {
          return prod
        }
      })
      if (i >= 0) {
        Alert.info(`Removed ${state.products[i].name} from cart`)
        state.products.splice(i, 1)
        recalc(state)
      }
      return { ...state }
    default:
      return { ...state }
  }
}

function CartContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, props.cart || initialState)
  const value = { state, dispatch }
  cartUpdater = props.cartUpdate

  return <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
}

CartContextProvider.propTypes = {
  cartUpdate: PropTypes.func.isRequired,
  cart: PropTypes.object
}

const CartContextConsumer = CartContext.Consumer

export { CartContext, CartContextProvider, CartContextConsumer }