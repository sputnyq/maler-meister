import { Box, Fab, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import OffersGrid from "../components/OffersGrid";

export default function Offers() {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6">
        <FormattedMessage id="offer.offer"></FormattedMessage>
      </Typography>
      <OffersGrid />
      <Box
        position={"absolute"}
        bottom={theme.spacing(3)}
        right={theme.spacing(3)}
      >
        <Link to="edit/-1">
          <Fab size="large" color="primary">
            <AddIcon />
          </Fab>
        </Link>
      </Box>
    </Box>
  );
}
