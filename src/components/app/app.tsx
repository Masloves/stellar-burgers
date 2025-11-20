import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  ProtectedRoute,
  IngredientDetails,
  Modal,
  OrderInfo
} from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, AppDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { checkUserAuth } from '../../services/slices/user/actions';
import {
  selectIsAuthChecked,
  selectUserLoading
} from '../../services/slices/user/slice';
import { getIngredients } from '../../services/slices/ingredients/actions';
import { selectIngredientsLoading } from '../../services/slices/ingredients/slice';
import { selectOrderByNumber } from '../../services/slices/order-info/slice';

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const userLoading = useSelector(selectUserLoading);
  const ingredientsLoading = useSelector(selectIngredientsLoading);
  const orderData = useSelector(selectOrderByNumber);

  const handleModalClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getIngredients());
  }, []);

  if (!isAuthChecked || userLoading || ingredientsLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={styles.loading}>
          <Preloader />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/login' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/login' element={<Login />} />
        </Route>

        <Route path='/register' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/register' element={<Register />} />
        </Route>

        <Route path='/forgot-password' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>

        <Route path='/reset-password' element={<ProtectedRoute onlyUnauth />}>
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route path='/profile' element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

        <Route path='/profile/orders' element={<ProtectedRoute />}>
          <Route path='/profile/orders' element={<ProfileOrders />} />
        </Route>

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route path='/profile/orders/:number' element={<ProtectedRoute />}>
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={
                  orderData
                    ? '#' + orderData.number.toString().padStart(6, '0')
                    : 'Детали заказа'
                }
                onClose={handleModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route path='/profile/orders/:number' element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title={
                    orderData
                      ? '#' + orderData.number.toString().padStart(6, '0')
                      : 'Детали заказа'
                  }
                  onClose={handleModalClose}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
