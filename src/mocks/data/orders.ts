import { TOrder } from '@utils-types';

export const mockOrder: TOrder = {
  _id: '6933e857a64177001b3224bd',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0940',
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0940'],
  status: 'done',
  name: 'Метеоритный флюоресцентный антарианский бургер',
  createdAt: '2025-12-06T08:24:55.612Z',
  updatedAt: '2025-12-06T08:24:55.817Z',
  number: 96383
};

export const mockOrders: TOrder[] = [
  mockOrder,
  {
    ...mockOrder,
    _id: 'order-2',
    ingredients: ['ingredient-3', 'ingredient-4'],
    status: 'pending',
    name: 'Galaxy бургер',
    createdAt: '2024-01-02T12:00:00.000Z',
    updatedAt: '2024-01-02T12:00:00.000Z',
    number: 12346
  }
];

export const mockUserOrder1: TOrder = {
  ...mockOrder,
  _id: 'user-order-1',
  number: 12345
};

export const mockUserOrder2: TOrder = {
  ...mockOrder,
  _id: 'user-order-2',
  number: 12346,
  status: 'done'
};

export const mockUserOrders: TOrder[] = [mockUserOrder1, mockUserOrder2];

export * from './feed';