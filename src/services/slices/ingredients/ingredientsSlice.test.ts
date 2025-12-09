import { ingredientsSlice } from './slice';
import { getIngredients } from './actions';
import { mockBun, mockMainIngredient, mockSauceIngredient } from '../../../mocks';

describe('Редьюсер ингредиентов', () => {
  // Используем initialState из самого слайса
  const initialState = ingredientsSlice.getInitialState();

  const mockIngredients = [mockBun, mockMainIngredient, mockSauceIngredient];

  describe('Инициализация', () => {
    test('должен возвращать корректное начальное состояние', () => {
      const state = ingredientsSlice.reducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Обработка экшенов getIngredients', () => {
    test('должен устанавливать isLoading в true при начале загрузки (pending)', () => {
      const action = { type: getIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('должен устанавливать isLoading в false и записывать данные при успешной загрузке (fulfilled)', () => {
      const pendingAction = { type: getIngredients.pending.type };
      let state = ingredientsSlice.reducer(initialState, pendingAction);
      
      expect(state.isLoading).toBe(true);
      
      const fulfilledAction = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      state = ingredientsSlice.reducer(state, fulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('должен устанавливать isLoading в false и записывать ошибку при неудачной загрузке (rejected)', () => {
      const pendingAction = { type: getIngredients.pending.type };
      let state = ingredientsSlice.reducer(initialState, pendingAction);
      
      expect(state.isLoading).toBe(true);
      
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const rejectedAction = {
        type: getIngredients.rejected.type,
        error: { message: errorMessage }
      };
      state = ingredientsSlice.reducer(state, rejectedAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });

    test('должен перезаписывать старые ингредиенты при новой успешной загрузке', () => {
      // Сначала загружаем старые данные
      const firstFulfilledAction = {
        type: getIngredients.fulfilled.type,
        payload: [mockBun, mockMainIngredient]
      };
      let state = ingredientsSlice.reducer(initialState, firstFulfilledAction);
      
      expect(state.ingredients).toHaveLength(2);
      
      // Начинаем новую загрузку
      const pendingAction = { type: getIngredients.pending.type };
      state = ingredientsSlice.reducer(state, pendingAction);
      
      expect(state.isLoading).toBe(true);
      expect(state.ingredients).toHaveLength(2); // Старые данные пока остаются
      
      // Загружаем новые данные
      const secondFulfilledAction = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      state = ingredientsSlice.reducer(state, secondFulfilledAction);
      
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(3);
    });

    test('должен очищать ошибку при начале новой загрузки (pending)', () => {
      // Создаем состояние с ошибкой
      const errorState = {
        ...initialState,
        error: 'Previous error message',
        ingredients: []
      };
      
      const pendingAction = { type: getIngredients.pending.type };
      const state = ingredientsSlice.reducer(errorState, pendingAction);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull(); // Ошибка должна очиститься
      expect(state.ingredients).toEqual([]);
    });
  });

  describe('Редьюсер clearError', () => {
    test('должен очищать ошибку в состоянии', () => {
      const stateWithError = {
        ...initialState,
        isLoading: false,
        error: 'Some error message',
        ingredients: mockIngredients
      };
      
      const action = ingredientsSlice.actions.clearError();
      const state = ingredientsSlice.reducer(stateWithError, action);
      
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients); // Данные не должны измениться
      expect(state.isLoading).toBe(false);
    });

    test('должен корректно работать при отсутствии ошибки', () => {
      const stateWithoutError = {
        ...initialState,
        isLoading: false,
        error: null,
        ingredients: mockIngredients
      };
      
      const action = ingredientsSlice.actions.clearError();
      const state = ingredientsSlice.reducer(stateWithoutError, action);
      
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  describe('Селекторы', () => {
    const stateWithData = {
      ingredients: {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      }
    };

    const stateWithLoading = {
      ingredients: {
        ingredients: [],
        isLoading: true,
        error: null
      }
    };

    const stateWithError = {
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: 'Failed to load'
      }
    };

    test('selectIngredients должен возвращать массив ингредиентов', () => {
      const result = ingredientsSlice.selectors.selectIngredients(stateWithData);
      expect(result).toEqual(mockIngredients);
      expect(result).toHaveLength(3);
    });

    test('selectIngredientsLoading должен возвращать статус загрузки', () => {
      const result1 = ingredientsSlice.selectors.selectIngredientsLoading(stateWithData);
      expect(result1).toBe(false);
      
      const result2 = ingredientsSlice.selectors.selectIngredientsLoading(stateWithLoading);
      expect(result2).toBe(true);
    });

    test('selectIngredientsError должен возвращать ошибку', () => {
      const result1 = ingredientsSlice.selectors.selectIngredientsError(stateWithData);
      expect(result1).toBeNull();
      
      const result2 = ingredientsSlice.selectors.selectIngredientsError(stateWithError);
      expect(result2).toBe('Failed to load');
    });

    test('selectIngredientById должен возвращать ингредиент по id', () => {
      const bunId = mockBun._id;
      const result = ingredientsSlice.selectors.selectIngredientById(stateWithData, bunId);
      
      expect(result).toEqual(mockBun);
      expect(result?._id).toBe(bunId);
      expect(result?.name).toBe(mockBun.name);
    });

    test('selectIngredientById должен возвращать undefined для несуществующего id', () => {
      const result = ingredientsSlice.selectors.selectIngredientById(stateWithData, 'non-existent-id');
      expect(result).toBeUndefined();
    });

    test('selectIngredientById должен корректно работать с пустым массивом ингредиентов', () => {
      const emptyState = {
        ingredients: initialState
      };
      
      const result = ingredientsSlice.selectors.selectIngredientById(emptyState, mockBun._id);
      expect(result).toBeUndefined();
    });
  });
});