import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Tooltip } from '@mui/material';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { removeToken } from '../../fetch/fetch-client';
import { AppDispatch } from '../../store';
import { logout } from '../../store/loginReducer';
import { destroyLoginData } from './Login';

export default function Logout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onClick = () => {
    dispatch(logout());
    destroyLoginData();
    removeToken();
    navigate('/login');
  };

  return (
    <Tooltip title="Abmelden">
      <IconButton onClick={onClick}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}
