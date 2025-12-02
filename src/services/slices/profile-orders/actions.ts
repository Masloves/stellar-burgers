import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi } from '@api';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);
