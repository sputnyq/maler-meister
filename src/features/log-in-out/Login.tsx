import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Card, CardContent, CardHeader, IconButton } from '@mui/material';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppTextField } from '../../components/aa-shared/AppTextField';
import AppTypo from '../../components/aa-shared/AppTypo';
import { appRequest, setFetchClientToken } from '../../fetch/fetch-client';
import { useCheckLogin } from '../../hooks/useCheckLogin';

export default function Login() {
  const [identifier, setIdetifier] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const checkLogin = useCheckLogin();

  useEffect(() => {
    checkLogin(true);
  }, [checkLogin]);

  const loginUser = () => {
    if (identifier && password) {
      appRequest('post')('/auth/local', {
        identifier,
        password,
      })
        .then((res) => {
          const { jwt, user } = res as LoginResponse;
          setFetchClientToken(jwt);
          setLoginData({ jwt, user });
          navigate('/');
        })
        .catch((e) => {
          console.log(e);
          alert('Login nicht erfolgreich!');
        });
    }
  };

  return (
    <Box mt={10} display={'flex'} justifyContent="center">
      <Card>
        <CardHeader title={<AppTypo>Anmeldung</AppTypo>} />
        <CardContent>
          <form>
            <Box display="flex" flexDirection="column" gap={3} minWidth="300px">
              <AppTextField
                value={identifier}
                label="Nutzer"
                onChange={(ev) => {
                  setIdetifier(ev.target.value);
                }}
              />
              <AppTextField
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword((sp) => !sp);
                      }}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                onKeyDown={({ key }) => {
                  if (key === 'Enter') {
                    loginUser();
                  }
                }}
                type={showPassword ? 'text' : 'password'}
                label="Passwort"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
              />
              <Button onClick={loginUser} variant="contained">
                Login
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

const EXPIRES_IN = 'EXPIRES_IN';
const TOKEN = 'TOKEN';
const USER = 'USER';

export function setLoginData(param: { jwt: string; user: User }) {
  const { jwt, user } = param;
  localStorage.setItem(TOKEN, jwt);
  localStorage.setItem(USER, JSON.stringify(user));

  const expiresIn = Date.now() + Math.pow(10, 9); // ca 10 days

  localStorage.setItem(EXPIRES_IN, String(expiresIn));
}

export function getLoginData() {
  const now = Date.now();

  const expiresIn = localStorage.getItem(EXPIRES_IN);
  const userString = localStorage.getItem(USER);

  if (Number(expiresIn || 1) < now) {
    destroyLoginData();
    return null;
  }

  if (userString !== null) {
    return {
      user: JSON.parse(userString) as User,
      jwt: localStorage.getItem(TOKEN) as string,
    };
  }

  return null;
}

export function destroyLoginData() {
  localStorage.removeItem(EXPIRES_IN);
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER);
}
