import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Thunks for AsyncStorage
export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  }
);

export const saveFavorites = createAsyncThunk(
  "favorites/saveFavorites",
  async (favorites, { getState }) => {
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    return getState().favorites;
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      // Check if the product is not already in favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      // Remove the product with the matching ID
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      // Set the favorites from localStorage
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFavorites.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(saveFavorites.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;

export const selectFavoriteProduct = (state) => state.favorites;

export const persistFavorites = () => async (dispatch, getState) => {
  await dispatch(saveFavorites(getState().favorites));
};

export default favoriteSlice.reducer;
