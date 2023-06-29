import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckLogin } from "../hooks/useCheckLogin";
import { getLoginData } from "../routes/Login";

export default function LoginProvider({ children }: React.PropsWithChildren) {
  //   const isLoggedIn = useSelector<AppState, boolean>((s) => s.login.isLoggedIn);

  const checkLogin = useCheckLogin();
  const navigate = useNavigate();
  const loginData = getLoginData();

  useEffect(() => {
    if (!loginData) {
      navigate("/login");
      return;
    }
    checkLogin(false);
  }, [checkLogin, navigate, loginData]);

  return <>{children}</>;
}
