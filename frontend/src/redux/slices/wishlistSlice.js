import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/wishlist');
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/wishlist/${productId}`);
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      });
  },
});

export default wishlistSlice.reducer;
