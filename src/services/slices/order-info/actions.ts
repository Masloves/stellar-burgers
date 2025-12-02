import { getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrderByNumber = createAsyncThunk(
  'orderByNumber/fetchOrderByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    // API возвращает массив... поэтому вернем первый заказ из массива..
    return response.orders[0];
  }
);
