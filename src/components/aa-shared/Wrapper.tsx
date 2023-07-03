import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

interface WrapperProps {
  title: string;
}

export function Wrapper({
  children,
  title,
}: React.PropsWithChildren<WrapperProps>) {
  return (
    <Card>
      <CardHeader title={<Typography variant="h6">{title}</Typography>} />
      <CardContent>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );
}
