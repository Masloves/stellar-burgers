import { TOrder, TOrdersData } from '@utils-types';

export const mockFeedOrder1: TOrder = {
  _id: 'order-1',
  ingredients: ['ingredient-1', 'ingredient-2'],
  status: 'done',
  name: 'Space бургер',
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-01T12:00:00.000Z',
  number: 12345
};

export const mockFeedOrder2: TOrder = {
  _id: 'order-2',
  ingredients: ['ingredient-3', 'ingredient-4'],
  status: 'pending',
  name: 'Galaxy бургер',
  createdAt: '2024-01-02T12:00:00.000Z',
  updatedAt: '2024-01-02T12:00:00.000Z',
  number: 12346
};

export const mockFeedOrder3: TOrder = {
  _id: 'order-3',
  ingredients: ['ingredient-5', 'ingredient-6'],
  status: 'done',
  name: 'Cosmos бургер',
  createdAt: '2024-01-03T12:00:00.000Z',
  updatedAt: '2024-01-03T12:00:00.000Z',
  number: 12347
};

export const mockFeedsData: TOrdersData = {
  orders: [mockFeedOrder1, mockFeedOrder2, mockFeedOrder3],
  total: 100,
  totalToday: 10
};

export const mockSelectedOrder: TOrder = mockFeedOrder1;