import { feedSlice } from './slice';
import { fetchFeeds } from './actions';
import { mockFeedsData } from '../../../mocks';

describe('Редьюсер ленты заказов', () => {
  const initialState = feedSlice.getInitialState();

  describe('Асинхронный экшен fetchFeeds', () => {
    test('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedSlice.reducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });

    test('должен устанавливать orders, total, totalToday и isLoading в false при fulfilled', () => {
      const pendingAction = { type: fetchFeeds.pending.type };
      let state = feedSlice.reducer(initialState, pendingAction);
      
      const fulfilledAction = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      };
      state = feedSlice.reducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockFeedsData.orders);
      expect(state.total).toBe(mockFeedsData.total);
      expect(state.totalToday).toBe(mockFeedsData.totalToday);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать error и isLoading в false при rejected', () => {
      const pendingAction = { type: fetchFeeds.pending.type };
      let state = feedSlice.reducer(initialState, pendingAction);
      
      const errorMessage = 'Failed to fetch feeds';
      const rejectedAction = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      state = feedSlice.reducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });
});