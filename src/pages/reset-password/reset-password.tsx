import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { resetPassword } from '../../services/slices/user/actions';
import {
  clearError,
  selectIsPasswordForgot,
  selectIsPasswordReset,
  selectUserError
} from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const isPasswordForgot = useSelector(selectIsPasswordForgot);
  const isPasswordReset = useSelector(selectIsPasswordReset);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token }));
  };

  useEffect(() => {
    if (!isPasswordForgot) {
      navigate('/forgot-password', { replace: true });
    }
  }, [isPasswordForgot, navigate]);
  useEffect(() => {
    if (isPasswordReset) {
      navigate('/login', { replace: true });
    }

    return () => {
      dispatch(clearError());
    };
  }, [isPasswordReset, navigate, dispatch]);

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
