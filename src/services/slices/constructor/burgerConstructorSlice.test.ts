import { burgerConstructorSlice } from './slice';
import { mockBun, mockMainIngredient, mockSauceIngredient } from '../../../mocks';
import type { TIngredient } from '@utils-types';

describe('Редьюсер конструктора бургера', () => {
  // Используем initialState из самого слайса
  const initialState = burgerConstructorSlice.getInitialState();

  describe('Обработка экшена добавления ингредиента', () => {
    test('должен добавлять булку на место bun', () => {
      const action = burgerConstructorSlice.actions.addIngredient(mockBun);
      const state = burgerConstructorSlice.reducer(initialState, action);
      
      expect(state.bun).toEqual({
        ...mockBun,
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/) // nanoid генерирует строку
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
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/)
      });
    });

    test('должен добавлять соус в массив ingredients', () => {
      const action = burgerConstructorSlice.actions.addIngredient(mockSauceIngredient);
      const state = burgerConstructorSlice.reducer(initialState, action);
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockSauceIngredient,
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/)
      });
    });

    test('должен заменять существующую булку при добавлении новой булки', () => {
      // Добавляем первую булку
      const firstAction = burgerConstructorSlice.actions.addIngredient(mockBun);
      let state = burgerConstructorSlice.reducer(initialState, firstAction);
      
      // Добавляем вторую булку (другая)
      const secondBun: TIngredient = {
        ...mockBun,
        _id: '643d69a5c3f7b9001cfa093e', // Другая булка
        name: 'Краторная булка N-200i'
      };
      const secondAction = burgerConstructorSlice.actions.addIngredient(secondBun);
      state = burgerConstructorSlice.reducer(state, secondAction);
      
      expect(state.bun).toEqual({
        ...secondBun,
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/)
      });
      expect(state.bun?._id).toBe('643d69a5c3f7b9001cfa093e');
      expect(state.bun?.name).toBe('Краторная булка N-200i');
      expect(state.ingredients).toHaveLength(0);
    });

    test('должен добавлять несколько начинок последовательно', () => {
      let state = initialState;
      
      // Добавляем первую начинку
      const action1 = burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      state = burgerConstructorSlice.reducer(state, action1);
      
      // Добавляем вторую начинку (соус)
      const action2 = burgerConstructorSlice.actions.addIngredient(mockSauceIngredient);
      state = burgerConstructorSlice.reducer(state, action2);
      
      // Добавляем третью начинку
      const thirdIngredient: TIngredient = {
        ...mockMainIngredient,
        _id: '643d69a5c3f7b9001cfa0941', // Другая основная начинка
        name: 'Биокотлета из марсианской Магнолии'
      };
      const action3 = burgerConstructorSlice.actions.addIngredient(thirdIngredient);
      state = burgerConstructorSlice.reducer(state, action3);
      
      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe('643d69a5c3f7b9001cfa0940'); // Говяжий метеорит
      expect(state.ingredients[0].type).toBe('main');
      expect(state.ingredients[1]._id).toBe('643d69a5c3f7b9001cfa0945'); // Соус
      expect(state.ingredients[1].type).toBe('sauce');
      expect(state.ingredients[2]._id).toBe('643d69a5c3f7b9001cfa0941'); // Биокотлета
      expect(state.ingredients[2].type).toBe('main');
    });
  });

  describe('Обработка экшена удаления ингредиента', () => {
    test('должен удалять ингредиент по id из середины массива', () => {
      // Создаем состояние с тремя ингредиентами
      let state = initialState;
      
      const ingredients: TIngredient[] = [
        { ...mockMainIngredient, _id: 'first', name: 'Первый ингредиент' },
        { ...mockMainIngredient, _id: 'second', name: 'Второй ингредиент' },
        { ...mockMainIngredient, _id: 'third', name: 'Третий ингредиент' }
      ];
      
      ingredients.forEach(ingredient => {
        const action = burgerConstructorSlice.actions.addIngredient(ingredient);
        state = burgerConstructorSlice.reducer(state, action);
      });
      
      // Сохраняем id и name второго ингредиента для удаления
      const ingredientIdToRemove = state.ingredients[1].id;
      const ingredientNameToRemove = state.ingredients[1].name;
      
      // Удаляем второй ингредиент
      const removeAction = burgerConstructorSlice.actions.removeIngredient(ingredientIdToRemove);
      const newState = burgerConstructorSlice.reducer(state, removeAction);
      
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0]._id).toBe('first');
      expect(newState.ingredients[0].name).toBe('Первый ингредиент');
      expect(newState.ingredients[1]._id).toBe('third');
      expect(newState.ingredients[1].name).toBe('Третий ингредиент');
      
      // Проверяем, что удаленный ингредиент больше не присутствует
      expect(newState.ingredients.some(ing => ing.name === ingredientNameToRemove)).toBe(false);
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
      expect(newState.ingredients[0]._id).toBe('643d69a5c3f7b9001cfa0945'); // Соус
      expect(newState.ingredients[0].name).toBe('Соус с шипами Антарианского плоскоходца');
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
      expect(newState.ingredients[0]._id).toBe('643d69a5c3f7b9001cfa0940'); // Говяжий метеорит
      expect(newState.ingredients[0].name).toBe('Говяжий метеорит (отбивная)');
    });

    test('не должен изменять state при удалении несуществующего id', () => {
      // Создаем состояние с одним ингредиентом
      const addAction = burgerConstructorSlice.actions.addIngredient(mockMainIngredient);
      const state = burgerConstructorSlice.reducer(initialState, addAction);
      
      const initialIngredientsLength = state.ingredients.length;
      const initialFirstIngredient = state.ingredients[0];
      
      // Пытаемся удалить несуществующий id
      const removeAction = burgerConstructorSlice.actions.removeIngredient('non-existent-id');
      const newState = burgerConstructorSlice.reducer(state, removeAction);
      
      // Состояние должно остаться неизменным
      expect(newState.ingredients).toHaveLength(initialIngredientsLength);
      expect(newState.ingredients[0]._id).toBe(initialFirstIngredient._id);
      expect(newState.ingredients[0].name).toBe(initialFirstIngredient.name);
      expect(newState.ingredients[0].id).toBe(initialFirstIngredient.id);
    });
  });

  describe('Обработка экшена изменения порядка ингредиентов в начинке', () => {
    test('должен перемещать ингредиент с первой позиции на последнюю', () => {
      // Создаем состояние с тремя ингредиентами
      let state = initialState;
      
      const ingredients: TIngredient[] = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый ингредиент' },
        { ...mockSauceIngredient, _id: 'B', name: 'Второй ингредиент' },
        { ...mockMainIngredient, _id: 'C', name: 'Третий ингредиент' }
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
      expect(newState.ingredients[0].name).toBe('Второй ингредиент');
      expect(newState.ingredients[1].name).toBe('Третий ингредиент');
      expect(newState.ingredients[2].name).toBe('Первый ингредиент');
    });

    test('должен перемещать ингредиент с последней позиции на первую', () => {
      let state = initialState;
      
      const ingredients: TIngredient[] = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый ингредиент' },
        { ...mockSauceIngredient, _id: 'B', name: 'Второй ингредиент' },
        { ...mockMainIngredient, _id: 'C', name: 'Третий ингредиент' }
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
      
      const ingredients: TIngredient[] = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый' },
        { ...mockSauceIngredient, _id: 'B', name: 'Второй' },
        { ...mockMainIngredient, _id: 'C', name: 'Третий' },
        { ...mockSauceIngredient, _id: 'D', name: 'Четвертый' }
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
      
      const ingredients: TIngredient[] = [
        { ...mockMainIngredient, _id: 'A', name: 'Первый ингредиент' },
        { ...mockSauceIngredient, _id: 'B', name: 'Второй ингредиент' }
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
      expect(newState.ingredients[0].name).toBe('Первый ингредиент');
      expect(newState.ingredients[1].name).toBe('Второй ингредиент');
    });
  });
});