import { Card, CardContent, CardHeader } from '@mui/material';

import { ColFlexBox } from './ColFlexBox';

interface WrapperProps {
  title: string;
}

export function Wrapper({ children, title }: React.PropsWithChildren<WrapperProps>) {
  return (
    <Card elevation={0}>
      <CardHeader title={title} />
      <CardContent>
        <ColFlexBox>{children}</ColFlexBox>
      </CardContent>
    </Card>
  );
}
