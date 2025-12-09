import { orderSlice } from './slice';
import { createOrder } from './actions';
import { mockOrder } from '../../../mocks';

describe('Редьюсер заказа', () => {
  const initialState = orderSlice.getInitialState();

  describe('Асинхронный экшен createOrder', () => {
    test('должен устанавливать isLoading в true при pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderSlice.reducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderData).toBeNull();
    });

    test('должен устанавливать orderData и isLoading в false при fulfilled', () => {
      const pendingAction = { type: createOrder.pending.type };
      let state = orderSlice.reducer(initialState, pendingAction);
      
      const fulfilledAction = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      state = orderSlice.reducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать error и isLoading в false при rejected', () => {
      const pendingAction = { type: createOrder.pending.type };
      let state = orderSlice.reducer(initialState, pendingAction);
      
      const errorMessage = 'Failed to create order';
      const rejectedAction = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      state = orderSlice.reducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orderData).toBeNull();
    });
  });

  describe('Синхронный экшен clearOrder', () => {
    test('должен очищать orderData и error', () => {
      const stateWithOrder = {
        orderData: mockOrder,
        isLoading: false,
        error: 'Some error'
      };
      
      const action = orderSlice.actions.clearOrder();
      const state = orderSlice.reducer(stateWithOrder, action);
      
      expect(state.orderData).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    test('не должен изменять isLoading при очистке', () => {
      const stateWithLoading = {
        orderData: mockOrder,
        isLoading: true,
        error: null
      };
      
      const action = orderSlice.actions.clearOrder();
      const state = orderSlice.reducer(stateWithLoading, action);
      
      expect(state.orderData).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(true); // isLoading не меняется
    });
  });
});