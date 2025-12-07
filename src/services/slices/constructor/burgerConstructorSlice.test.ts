import { burgerConstructorSlice } from './slice';
import { mockBun, mockMainIngredient, mockSauceIngredient } from '../../../mocks';

describe('Редьюсер конструктора бургера', () => {
  // Используем initialState из самого слайса
  const initialState = burgerConstructorSlice.getInitialState();

  describe('Обработка экшена добавления ингредиента', () => {
    test('должен добавлять булку на место bun', () => {
      const action = burgerConstructorSlice.actions.addIngredient(mockBun);
      const state = burgerConstructorSlice.reducer(initialState, action);
      
      expect(state.bun).toEqual({
        ...mockBun,
        id: expect.any(String) // nanoid добавляет уникальный id
      });
      expect(state.ingredients).toHaveLength(0);
    });

    test('должен добавлять начинку в массив ingredients', () => {
      const action = burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      const state = burgerConstructorSlice.reducer(initialState, action);
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockMainIngredient,
        id: expect.any(String)
      });
    });

    test('должен заменять существующую булку при добавлении новой булки', () => {
      // Добавляем первую булку
      const firstAction = burgerConstructorSlice.actions.addIngredient(mockBun);
      let state = burgerConstructorSlice.reducer(initialState, firstAction);
      
      // Добавляем вторую булку (другая)
      const secondBun = {
        ...mockBun,
        _id: 'different-bun-id',
        name: 'Другая булка'
      };
      const secondAction = burgerConstructorSlice.actions.addIngredient(secondBun);
      state = burgerConstructorSlice.reducer(state, secondAction);
      
      expect(state.bun).toEqual({
        ...secondBun,
        id: expect.any(String)
      });
      expect(state.bun?._id).toBe('different-bun-id');
      expect(state.ingredients).toHaveLength(0);
    });

    test('должен добавлять несколько начинок последовательно', () => {
      let state = initialState;
      
      // Добавляем первую начинку
      const action1 = burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      state = burgerConstructorSlice.reducer(state, action1);
      
      // Добавляем вторую начинку
      const action2 = burgerConstructorSlice.actions.addIngredient(mockSauceIngredient);
      state = burgerConstructorSlice.reducer(state, action2);
      
      // Добавляем третью начинку
      const thirdIngredient = {
        ...mockMainIngredient,
        _id: 'third-ingredient',
        name: 'Третья начинка'
      };
      const action3 = burgerConstructorSlice.actions.addIngredient(thirdIngredient);
      state = burgerConstructorSlice.reducer(state, action3);
      
      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe(mockMainIngredient._id);
      expect(state.ingredients[1]._id).toBe(mockSauceIngredient._id);
      expect(state.ingredients[2]._id).toBe('third-ingredient');
    });
  });

  describe('Обработка экшена удаления ингредиента', () => {
    test('должен удалять ингредиент по id из середины массива', () => {
      // Создаем состояние с тремя ингредиентами
      let state = initialState;
      
      const ingredients = [
        { ...mockMainIngredient, _id: 'first', name: 'Первый' },
        { ...mockMainIngredient, _id: 'second', name: 'Второй' },
        { ...mockMainIngredient, _id: 'third', name: 'Третий' }
      ];
      
      ingredients.forEach(ingredient => {
        const action = burgerConstructorSlice.actions.addIngredient(ingredient);
        state = burgerConstructorSlice.reducer(state, action);
      });
      
      // Сохраняем id второго ингредиента для удаления
      const ingredientIdToRemove = state.ingredients[1].id;
      
      // Удаляем второй ингредиент
      const removeAction = burgerConstructorSlice.actions.removeIngredient(ingredientIdToRemove);
      const newState = burgerConstructorSlice.reducer(state, removeAction);
      
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0]._id).toBe('first');
      expect(newState.ingredients[1]._id).toBe('third');
    });

    test('должен удалять первый ингредиент в массиве', () => {
      let state = initialState;
      
      const addAction1 = burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      state = burgerConstructorSlice.reducer(state, addAction1);
      
      const addAction2 = burgerConstructorSlice.actions.addIngredient(mockSauceIngredient);
      state = burgerConstructorSlice.reducer(state, addAction2);
      
      // Удаляем первый ингредиент
      const firstIngredientId = state.ingredients[0].id;
      const removeAction = burgerConstructorSlice.actions.removeIngredient(firstIngredientId);
      const newState = burgerConstructorSlice.reducer(state, removeAction);
      
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe(mockSauceIngredient._id);
    });

    test('должен удалять последний ингредиент в массиве', () => {
      let state = initialState;
      
      const addAction1 = burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      state = burgerConstructorSlice.reducer(state, addAction1);
      
      const addAction2 = burgerConstructorSlice.actions.addIngredient(mockSauceIngredient);
      state = burgerConstructorSlice.reducer(state, addAction2);
      
      // Удаляем последний ингредиент
      const lastIngredientId = state.ingredients[1].id;
      const removeAction = burgerConstructorSlice.actions.removeIngredient(lastIngredientId);
      const newState = burgerConstructorSlice.reducer(state, removeAction);
      
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe(mockMainIngredient._id);
    });

    test('не должен изменять state при удалении несуществующего id', () => {
      // Создаем состояние с одним ингредиентом
      const addAction = burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      const state = burgerConstructorSlice.reducer(initialState, addAction);
      
      // Пытаемся удалить несуществующий id
      const removeAction = burgerConstructorSlice.actions.removeIngredient('non-existent-id');
      const newState = burgerConstructorSlice.reducer(state, removeAction);
      
      // Состояние должно остаться неизменным (та же ссылка)
      expect(newState).toEqual(state);
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe(mockMainIngredient._id);
    });
  });

  describe('Обработка экшена изменения порядка ингредиентов в начинке', () => {
    test('должен перемещать ингредиент с первой позиции на последнюю', () => {
      // Создаем состояние с тремя ингредиентами
      let state = initialState;
      
      const ingredients = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый' },
        { ...mockMainIngredient, _id: 'B', name: 'Второй' },
        { ...mockMainIngredient, _id: 'C', name: 'Третий' }
      ];
      
      ingredients.forEach(ingredient => {
        const action = burgerConstructorSlice.actions.addIngredient(ingredient);
        state = burgerConstructorSlice.reducer(state, action);
      });
      
      // Проверяем начальный порядок: A, B, C
      expect(state.ingredients.map(i => i._id)).toEqual(['A', 'B', 'C']);
      
      // Перемещаем первый элемент (A) на последнюю позицию (индекс 2)
      const moveAction = burgerConstructorSlice.actions.moveIngredient({
        fromIndex: 0,
        toIndex: 2
      });
      
      const newState = burgerConstructorSlice.reducer(state, moveAction);
      
      // Проверяем новый порядок: B, C, A
      expect(newState.ingredients.map(i => i._id)).toEqual(['B', 'C', 'A']);
    });

    test('должен перемещать ингредиент с последней позиции на первую', () => {
      let state = initialState;
      
      const ingredients = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый' },
        { ...mockMainIngredient, _id: 'B', name: 'Второй' },
        { ...mockMainIngredient, _id: 'C', name: 'Третий' }
      ];
      
      ingredients.forEach(ingredient => {
        const action = burgerConstructorSlice.actions.addIngredient(ingredient);
        state = burgerConstructorSlice.reducer(state, action);
      });
      
      // Перемещаем последний элемент (C) на первую позицию
      const moveAction = burgerConstructorSlice.actions.moveIngredient({
        fromIndex: 2,
        toIndex: 0
      });
      
      const newState = burgerConstructorSlice.reducer(state, moveAction);
      
      // Проверяем новый порядок: C, A, B
      expect(newState.ingredients.map(i => i._id)).toEqual(['C', 'A', 'B']);
    });

    test('должен перемещать ингредиент в середине массива', () => {
      let state = initialState;
      
      const ingredients = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый' },
        { ...mockMainIngredient, _id: 'B', name: 'Второй' },
        { ...mockMainIngredient, _id: 'C', name: 'Третий' },
        { ...mockMainIngredient, _id: 'D', name: 'Четвертый' }
      ];
      
      ingredients.forEach(ingredient => {
        const action = burgerConstructorSlice.actions.addIngredient(ingredient);
        state = burgerConstructorSlice.reducer(state, action);
      });
      
      // Перемещаем второй элемент (B) на позицию перед последним (индекс 2)
      const moveAction = burgerConstructorSlice.actions.moveIngredient({
        fromIndex: 1,
        toIndex: 2
      });
      
      const newState = burgerConstructorSlice.reducer(state, moveAction);
      
      // Проверяем новый порядок: A, C, B, D
      expect(newState.ingredients.map(i => i._id)).toEqual(['A', 'C', 'B', 'D']);
    });

    test('должен корректно обрабатывать перемещение на ту же позицию', () => {
      let state = initialState;
      
      const ingredients = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый' },
        { ...mockMainIngredient, _id: 'B', name: 'Второй' }
      ];
      
      ingredients.forEach(ingredient => {
        const action = burgerConstructorSlice.actions.addIngredient(ingredient);
        state = burgerConstructorSlice.reducer(state, action);
      });
      
      // Пытаемся переместить элемент на его же позицию
      const moveAction = burgerConstructorSlice.actions.moveIngredient({
        fromIndex: 0,
        toIndex: 0
      });
      
      const newState = burgerConstructorSlice.reducer(state, moveAction);
      
      // Порядок должен остаться прежним: A, B
      expect(newState.ingredients.map(i => i._id)).toEqual(['A', 'B']);
    });
  });
});