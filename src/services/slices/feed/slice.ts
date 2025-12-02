import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { fetchFeeds } from './actions';

type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
  selectedOrder: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  selectedOrder: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeedError: (state) => {
      state.error = null;
    },
    setSelectedOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.selectedOrder = action.payload;
    },
    updateFeeds: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      });
  },
  selectors: {
    selectFeeds: (state) => ({
      orders: state.orders,
      total: state.total,
      totalToday: state.totalToday
    }),
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedLoading: (state) => state.isLoading,
    selectFeedError: (state) => state.error,
    selectSelectedOrder: (state) => state.selectedOrder,
    selectOrderByNumber: (state, number: number) =>
      state.orders.find((order) => order.number === number)
  }
});

export const { clearFeedError, setSelectedOrder, updateFeeds } =
  feedSlice.actions;
export const {
  selectFeeds,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError,
  selectSelectedOrder,
  selectOrderByNumber
} = feedSlice.selectors;

export default feedSlice.reducer;
