import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  cartItems: [],
  itemsPrice: 0,
  totalPrice: 0,
};

// Load initial cart state from AsyncStorage
const loadInitialState = async () => {
  try {
    const cart = await AsyncStorage.getItem("cart");
    return cart ? JSON.parse(cart) : initialState;
  } catch (error) {
    console.error("Error loading cart from AsyncStorage: ", error);
    return initialState;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...newItem, quantity: 1 });
      }
      state.itemsPrice += newItem.price;
      state.totalPrice += newItem.price;
      AsyncStorage.setItem("cart", JSON.stringify(state)); // Update AsyncStorage
    },
    removeFromCart: (state, action) => {
      const itemIdToRemove = action.payload;
      const itemToRemove = state.cartItems.find(
        (item) => item._id === itemIdToRemove
      );
      if (itemToRemove) {
        state.itemsPrice -= itemToRemove.price * itemToRemove.quantity;
        state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== itemIdToRemove
        );
        AsyncStorage.setItem("cart", JSON.stringify(state)); // Update AsyncStorage
      }
    },
    increaseQuantity: (state, action) => {
      const { itemId } = action.payload;
      const itemToUpdate = state.cartItems.find((item) => item._id === itemId);
      if (itemToUpdate) {
        itemToUpdate.quantity += 1;
        state.itemsPrice += itemToUpdate.price;
        state.totalPrice += itemToUpdate.price;
        AsyncStorage.setItem("cart", JSON.stringify(state)); // Update AsyncStorage
      }
    },
    decreaseQuantity: (state, action) => {
      const { itemId } = action.payload;
      const itemToUpdate = state.cartItems.find((item) => item._id === itemId);
      if (itemToUpdate && itemToUpdate.quantity > 1) {
        itemToUpdate.quantity -= 1;
        state.itemsPrice -= itemToUpdate.price;
        state.totalPrice -= itemToUpdate.price;
        AsyncStorage.setItem("cart", JSON.stringify(state)); // Update AsyncStorage
      }
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.totalPrice = 0;
      AsyncStorage.removeItem("cart"); // Clear AsyncStorage
    },

    resetCart: () => initialState,
  },
});

// Export actions and reducer
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;

// Thunk action to load initial cart state from AsyncStorage
export const loadCartFromStorage = () => async (dispatch) => {
  const initialCart = await loadInitialState();
  dispatch(cartSlice.actions.resetCart());
  dispatch(cartSlice.actions.addToCart(initialCart.cartItems));
};
