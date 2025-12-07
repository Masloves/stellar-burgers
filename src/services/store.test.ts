import { combineSlices } from '@reduxjs/toolkit';
import { burgerConstructorSlice } from './slices/constructor/slice';
import { ingredientsSlice } from './slices/ingredients/slice';
import { userSlice } from './slices/user/slice';
import { orderSlice } from './slices/order/slice';
import { userOrdersSlice } from './slices/profile-orders/slice';
import { orderByNumberSlice } from './slices/order-info/slice';
import { feedSlice } from './slices/feed/slice';

describe('Инициализация rootReducer', () => {
  test('должен правильно инициализировать все слайсы', () => {
    const rootReducer = combineSlices(
      userSlice,
      burgerConstructorSlice,
      ingredientsSlice,
      orderSlice,
      userOrdersSlice,
      orderByNumberSlice,
      feedSlice
    );

    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      user: userSlice.getInitialState(),
      burgerConstructor: burgerConstructorSlice.getInitialState(),
      ingredients: ingredientsSlice.getInitialState(),
      order: orderSlice.getInitialState(),
      userOrders: userOrdersSlice.getInitialState(),
      orderByNumber: orderByNumberSlice.getInitialState(),
      feed: feedSlice.getInitialState()
    });
  });
});