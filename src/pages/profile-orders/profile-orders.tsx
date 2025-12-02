import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/profile-orders/actions';
import {
  selectUserOrders,
  selectUserOrdersLoading
} from '../../services/slices/profile-orders/slice';
import { Preloader } from '../../components/ui';
import { selectIngredientsLoading } from '../../services/slices/ingredients/slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const userOrdersLoading = useSelector(selectUserOrdersLoading);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  if (ingredientsLoading || userOrdersLoading || !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
