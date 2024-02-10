import { Card, CardProps } from '@mui/material';

import React from 'react';

export function AppCard(props: React.PropsWithChildren<CardProps>) {
  return <Card elevation={0} {...props} />;
}
