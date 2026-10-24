import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check initial user authentication session
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    // If logged in, fetch live cart and wishlist state
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
