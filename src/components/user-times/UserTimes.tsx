import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { appRequest } from "../../fetch/fetch-client";
import { AppState } from "../../store";

export default function UserTimes() {
  const username = useSelector<AppState, string | undefined>(
    (s) => s.login.user?.username
  );

  useEffect(() => {
    appRequest("get")(`daily-entries?filters[username][$eq]=${username}`).then(
      (res) => {
        console.log(res);
      }
    );
  }, [username]);

  return <div>UserTimes</div>;
}
