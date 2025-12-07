import { orderByNumberSlice } from './slice';
import { fetchOrderByNumber } from './actions';
import { mockOrder } from '../../../mocks';

describe('Редьюсер заказа по номеру', () => {
  const initialState = orderByNumberSlice.getInitialState();

  describe('Асинхронный экшен fetchOrderByNumber', () => {
    test('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderByNumberSlice.reducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.order).toBeNull();
    });

    test('должен устанавливать order и isLoading в false при fulfilled', () => {
      const pendingAction = { type: fetchOrderByNumber.pending.type };
      let state = orderByNumberSlice.reducer(initialState, pendingAction);
      
      const fulfilledAction = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      state = orderByNumberSlice.reducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать error и isLoading в false при rejected', () => {
      const pendingAction = { type: fetchOrderByNumber.pending.type };
      let state = orderByNumberSlice.reducer(initialState, pendingAction);
      
      const errorMessage = 'Ошибка загрузки заказа';
      const rejectedAction = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      state = orderByNumberSlice.reducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.order).toBeNull();
    });
  });
});