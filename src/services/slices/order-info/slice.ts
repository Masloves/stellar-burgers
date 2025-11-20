import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { fetchOrderByNumber } from './actions';

type TOrderByNumberState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderByNumberState = {
  order: null,
  isLoading: false,
  error: null
};

export const orderByNumberSlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {
    clearOrderByNumber: (state) => {
      state.order = null;
      state.error = null;
    },
    setOrderByNumber: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.order = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  },
  selectors: {
    selectOrderByNumber: (state) => state.order,
    selectOrderByNumberLoading: (state) => state.isLoading,
    selectOrderByNumberError: (state) => state.error
  }
});

export const { clearOrderByNumber, setOrderByNumber } =
  orderByNumberSlice.actions;
export const {
  selectOrderByNumber,
  selectOrderByNumberLoading,
  selectOrderByNumberError
} = orderByNumberSlice.selectors;

export default orderByNumberSlice.reducer;
