import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import OfferActions from "./OfferActions";

export default function TopBar() {
  const location = useLocation();
  const isRootLocation = location.pathname === "/";

  const actions = useMemo(() => {
    if (location.pathname.startsWith("/offers/edit")) {
      return <OfferActions />;
    }
    if (isRootLocation) {
      return "Maler Meister App";
    }
    return null;
  }, [location, isRootLocation]);

  const homeButton = useMemo(() => {
    if (isRootLocation) {
      return null;
    }
    return (
      <Link to="/">
        <IconButton>
          <HomeIcon />
        </IconButton>
      </Link>
    );
  }, [isRootLocation]);
  return (
    <Box flexGrow={1}>
      <AppBar position="fixed" elevation={0} variant="outlined" color="inherit">
        <Toolbar>
          {homeButton}
          <Box flex={1} display="flex" justifyContent={"flex-end"}>
            {actions}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
