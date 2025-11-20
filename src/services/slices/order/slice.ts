import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { createOrder } from './actions';

type TOrderState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.orderData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  },
  selectors: {
    selectOrderData: (state) => state.orderData,
    selectOrderLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error
  }
});

export const { clearOrder } = orderSlice.actions;
export const { selectOrderData, selectOrderLoading, selectOrderError } =
  orderSlice.selectors;
export default orderSlice.reducer;
