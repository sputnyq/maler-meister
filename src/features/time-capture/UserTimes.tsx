import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { appRequest } from "../../fetch/fetch-client";
import { AppState } from "../../store";

import * as qs from "qs";
import { getCurrentDBDate } from "../../utils";

export default function UserTimes() {
  const [monthValue, setMonthValue] = useState<"current" | "last">("current");
  const username = useSelector<AppState, string | undefined>(
    (s) => s.login.user?.username
  );

  useEffect(() => {
    const query = qs.stringify({
      filters: {
        username: {
          $eq: username,
        },
        date: {
          $gte: getCurrentDBDate(),
        },
      },
    });
    appRequest("get")(`daily-entries?${query}`).then((res) => {
      console.log(res);
    });
  }, [username]);

  return (
    <Box>
      <ToggleButtonGroup
        fullWidth
        exclusive
        value={monthValue}
        onChange={(_, value) => {
          value && setMonthValue(value);
        }}
      >
        <ToggleButton size="small" value="last">
          Letzter Monat
        </ToggleButton>
        <ToggleButton size="small" value="current">
          Laufender Monat
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
