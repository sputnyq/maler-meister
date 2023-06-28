import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  to: string;
  role: number;
  currentRole: number;
}
export default function Tile({
  title,
  to,
  children,
  role,
  currentRole,
}: React.PropsWithChildren<Props>) {
  if (currentRole < role) {
    return null;
  }
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Card elevation={3} sx={{ paddingY: 3 }}>
        <Link style={{ textDecoration: "none", color: "inherit" }} to={to}>
          <Box
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
            justifyContent="center"
          >
            {children}
            <Typography mt={1} variant="h6">
              {title}
            </Typography>
          </Box>
        </Link>
      </Card>
    </Grid>
  );
}
