import { userSlice } from './slice';
import { login, setIsAuthChecked } from './actions';
import { mockUser } from '../../../mocks';

describe('Редьюсер пользователя', () => {
  const initialState = userSlice.getInitialState();

  describe('Асинхронный экшен login', () => {
    test('должен устанавливать isLoading в true при pending', () => {
      const action = { type: login.pending.type };
      const state = userSlice.reducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать user и isLoading в false при fulfilled', () => {
      const pendingAction = { type: login.pending.type };
      let state = userSlice.reducer(initialState, pendingAction);
      
      const fulfilledAction = {
        type: login.fulfilled.type,
        payload: mockUser
      };
      state = userSlice.reducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать error и isLoading в false при rejected', () => {
      const pendingAction = { type: login.pending.type };
      let state = userSlice.reducer(initialState, pendingAction);
      
      const errorMessage = 'Login failed';
      const rejectedAction = {
        type: login.rejected.type,
        error: { message: errorMessage }
      };
      state = userSlice.reducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  describe('Синхронный экшен setIsAuthChecked', () => {
    test('должен устанавливать флаг проверки авторизации в true', () => {
      const action = setIsAuthChecked(true);
      const state = userSlice.reducer(initialState, action);
      
      expect(state.isAuthChecked).toBe(true);
    });

    test('должен устанавливать флаг проверки авторизации в false', () => {
      const stateWithAuthChecked = {
        ...initialState,
        isAuthChecked: true
      };
      
      const action = setIsAuthChecked(false);
      const state = userSlice.reducer(stateWithAuthChecked, action);
      
      expect(state.isAuthChecked).toBe(false);
    });

    test('не должен изменять другие поля состояния', () => {
      const testState = {
        ...initialState,
        user: mockUser,
        isLoading: false,
        error: null
      };
      
      const action = setIsAuthChecked(true);
      const state = userSlice.reducer(testState, action);
      
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});