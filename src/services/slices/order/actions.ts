import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);
