import { Card, CardContent, CardHeader, Grid } from '@mui/material';

interface WrapperProps {
  title: string;
}

export function Wrapper({ children, title }: React.PropsWithChildren<WrapperProps>) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );
}
