import { Card, CardContent, CardHeader, CardProps } from '@mui/material';

import { PropsWithChildren, ReactNode } from 'react';

import { ColFlexBox } from './ColFlexBox';

interface WrapperProps {
  title: ReactNode;
  cardProps?: CardProps;
}

export function Wrapper({ children, title, cardProps = {} }: PropsWithChildren<WrapperProps>) {
  return (
    <Card elevation={0} {...cardProps}>
      <CardHeader title={title} />
      <CardContent>
        <ColFlexBox>{children}</ColFlexBox>
      </CardContent>
    </Card>
  );
}
