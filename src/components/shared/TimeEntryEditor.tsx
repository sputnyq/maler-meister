import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { AppTextField } from "./AppTextField";

interface Props {
  onSave(entry: DailyEntry): void;
}

export default function TimeEntryEditor(props: Props) {
  return (
    <Box p={2}>
      <Grid container>
        <Grid item xs={12}>
          <AppTextField
            type={"date"}
            onChange={(ev) => {
              console.log(ev.target.value);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
