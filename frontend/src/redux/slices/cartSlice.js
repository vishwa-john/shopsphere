import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, qty = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.post('/cart', { productId, qty });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, qty }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { qty });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const res = await api.delete('/cart');
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    const handleCartUpdate = (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalItems = action.payload.totalItems || 0;
      }
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, handleCartUpdate)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, handleCartUpdate)
      .addCase(updateCartItem.fulfilled, handleCartUpdate)
      .addCase(removeCartItem.fulfilled, handleCartUpdate)
      .addCase(clearCart.fulfilled, handleCartUpdate);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
