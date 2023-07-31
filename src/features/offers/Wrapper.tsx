import { Box, Card, CardContent, CardHeader } from '@mui/material';

interface WrapperProps {
  title: string;
}

export function Wrapper({ children, title }: React.PropsWithChildren<WrapperProps>) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
