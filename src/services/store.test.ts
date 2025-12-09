import { combineSlices } from '@reduxjs/toolkit';
import { burgerConstructorSlice } from './slices/constructor/slice';
import { ingredientsSlice } from './slices/ingredients/slice';
import { userSlice } from './slices/user/slice';
import { orderSlice } from './slices/order/slice';
import { userOrdersSlice } from './slices/profile-orders/slice';
import { orderByNumberSlice } from './slices/order-info/slice';
import { feedSlice } from './slices/feed/slice';
import { 
  mockUser, 
  mockBun, 
  mockMainIngredient, 
  mockOrder, 
  mockUserOrders,
  mockFeedOrder1 
} from './../mocks';

describe('Инициализация rootReducer', () => {

  const rootReducer = combineSlices(
    userSlice,
    burgerConstructorSlice,
    ingredientsSlice,
    orderSlice,
    userOrdersSlice,
    orderByNumberSlice,
    feedSlice
  );

  const EXPECTED_INITIAL_STATE = {
    user: userSlice.getInitialState(),
    burgerConstructor: burgerConstructorSlice.getInitialState(),
    ingredients: ingredientsSlice.getInitialState(),
    order: orderSlice.getInitialState(),
    userOrders: userOrdersSlice.getInitialState(),
    orderByNumber: orderByNumberSlice.getInitialState(),
    feed: feedSlice.getInitialState()
  };

  const TEST_STATE_WITH_DATA = {
    user: {
      user: mockUser,
      isAuthChecked: true,
      isLoading: false,
      error: null,
      isPasswordForgot: false,
      isPasswordReset: false
    },
    burgerConstructor: {
      bun: mockBun,
      ingredients: [
        { ...mockMainIngredient, id: 'constructor-ingredient-id-1' }
      ]
    },
    ingredients: {
      ingredients: [mockBun, mockMainIngredient],
      isLoading: false,
      error: null
    },
    order: {
      orderData: mockOrder,
      isLoading: false,
      error: null
    },
    userOrders: {
      orders: mockUserOrders,
      isLoading: false,
      error: null
    },
    orderByNumber: {
      order: mockOrder,
      isLoading: false,
      error: null
    },
    feed: {
      orders: [mockFeedOrder1],
      total: 100,
      totalToday: 10,
      isLoading: false,
      error: null,
      selectedOrder: null
    }
  };

  describe('Инициализация', () => {
    test('должен возвращать корректное начальное состояние при вызове с undefined состоянием и неизвестным экшеном ({ type: \'UNKNOWN_ACTION\' })', () => {
      // Вызываем rootReducer с undefined состоянием и неизвестным экшеном
      const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
      
      // Проверяем, что возвращается корректное начальное состояние хранилища
      expect(initialState).toEqual(EXPECTED_INITIAL_STATE);
    });

    test('должен возвращать тот же объект состояния при неизвестном экшене для существующего состояния', () => {
      // Применяем неизвестный экшен
      const newState = rootReducer(TEST_STATE_WITH_DATA, { type: 'UNKNOWN_ACTION' });
      
      // Должен вернуть тот же объект
      expect(newState).toBe(TEST_STATE_WITH_DATA);
      
      // Содержимое тоже должно остаться неизменным
      expect(newState).toEqual(TEST_STATE_WITH_DATA);
    });
  });


  test('должен правильно инициализироваться при вызове с @@INIT', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    expect(initialState).toEqual(EXPECTED_INITIAL_STATE);
  });
});
