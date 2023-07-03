import { MenuItem, TextFieldProps } from "@mui/material";
import { AppTextField } from "./AppTextField";

export default function TaxSelector(props: TextFieldProps) {
  return (
    <AppTextField label="MwSt" select {...props}>
      {[19, 0].map((option) => (
        <MenuItem key={option} value={option}>
          {`${option} %`}
        </MenuItem>
      ))}
    </AppTextField>
  );
}
