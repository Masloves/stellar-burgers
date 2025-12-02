import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/slices/user/actions';
import {
  clearError,
  selectUser,
  selectUserError
} from '../../services/slices/user/slice';
import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register({ email, password, name: userName }));
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }

    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
