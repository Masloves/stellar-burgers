import { userOrdersSlice } from './slice';
import { fetchUserOrders } from './actions';
import { mockOrders } from '../../../mocks';

describe('Редьюсер заказов пользователя', () => {
  const initialState = userOrdersSlice.getInitialState();


  describe('Асинхронный экшен fetchUserOrders', () => {
    test('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = userOrdersSlice.reducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);
    });

    test('должен устанавливать orders и isLoading в false при fulfilled', () => {
      const pendingAction = { type: fetchUserOrders.pending.type };
      let state = userOrdersSlice.reducer(initialState, pendingAction);
      
      const fulfilledAction = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      state = userOrdersSlice.reducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать error и isLoading в false при rejected', () => {
      const pendingAction = { type: fetchUserOrders.pending.type };
      let state = userOrdersSlice.reducer(initialState, pendingAction);
      
      const errorMessage = 'Ошибка загрузки заказов пользователя';
      const rejectedAction = {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      state = userOrdersSlice.reducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orders).toEqual([]);
    });
  });
});