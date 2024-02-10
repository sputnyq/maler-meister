import { CardContent, CardHeader } from '@mui/material';

import { AppCard } from './AppCard';
import { ColFlexBox } from './ColFlexBox';

interface WrapperProps {
  title: string;
}

export function Wrapper({ children, title }: React.PropsWithChildren<WrapperProps>) {
  return (
    <AppCard>
      <CardHeader title={title} />
      <CardContent>
        <ColFlexBox>{children}</ColFlexBox>
      </CardContent>
    </AppCard>
  );
}
