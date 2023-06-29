import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import OffersGrid from "../components/OffersGrid";
import AddFab from "../components/shared/AddFab";

export default function Offers() {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h6">
        <FormattedMessage id="offer.offer"></FormattedMessage>
      </Typography>
      <OffersGrid />
      <AddFab onClick={() => navigate("edit/-1")} />
    </Box>
  );
}
