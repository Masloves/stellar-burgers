import { FC } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/user/slice';
import {
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotal
} from '../../services/slices/constructor/slice';
import { createOrder } from '../../services/slices/order/actions';
import {
  clearOrder,
  selectOrderData,
  selectOrderLoading
} from '../../services/slices/order/slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const totalPrice = useSelector(selectConstructorTotal);
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderData);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
