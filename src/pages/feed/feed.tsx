import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredientsLoading } from '../../services/slices/ingredients/slice';
import { fetchFeeds } from '../../services/slices/feed/actions';
import {
  selectFeedLoading,
  selectFeedOrders
} from '../../services/slices/feed/slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const feedLoading = useSelector(selectFeedLoading);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (ingredientsLoading || feedLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
