import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { getLoginData } from '../features/log-in-out/Login';
import { setFetchClientToken } from '../fetch/fetch-client';
import { AppDispatch } from '../store';
import { login } from '../store/loginReducer';

export function useCheckLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const checkLogin = useCallback(
    (shouldNavigate: boolean) => {
      const loginData = getLoginData();
      if (loginData !== null) {
        setFetchClientToken(loginData.jwt);
        dispatch(login({ ...loginData.user }));
        if (shouldNavigate) {
          navigate('/');
        }
      }
    },
    [dispatch, navigate],
  );

  return checkLogin;
}
