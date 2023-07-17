import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from '../../store';

interface Props {
  title: string;
  to: string;
  requiredRoles: UserRole[];
  color: string;
}
export default function Tile({ title, to, requiredRoles, children, color }: React.PropsWithChildren<Props>) {
  const currentRole = useSelector<AppState, UserRole | undefined>((s) => s.login.user?.userRole);

  const hasRight = currentRole && requiredRoles.includes(currentRole);

  if (!hasRight) {
    return null;
  }

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Card elevation={0} sx={{ padding: 0, maxWidth: '120px', margin: 'auto', background: color }}>
        <Link style={{ textDecoration: 'none', color: 'inherit' }} to={to}>
          <CardHeader
            title={
              <Typography color={'white'} component={'div'} whiteSpace="nowrap" align="center" variant="subtitle1">
                {title}
              </Typography>
            }
          />
          <CardContent sx={{ padding: 0 }}>
            <Box display={'flex'} flexDirection="column" alignItems={'center'} justifyContent="center">
              {children}
            </Box>
          </CardContent>
        </Link>
      </Card>
    </Grid>
  );
}
