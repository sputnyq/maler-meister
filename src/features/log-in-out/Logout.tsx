import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { logout } from "../../store/loginReducer";
import { useNavigate } from "react-router-dom";
import { destroyLoginData } from "./Login";
import { removeToken } from "../../fetch/fetch-client";

export default function Logout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onClick = () => {
    dispatch(logout());
    destroyLoginData();
    removeToken();
    navigate("/login");
  };

  return (
    <Tooltip title="Abmelden">
      <IconButton onClick={onClick}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}
