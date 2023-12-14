import { Grid, GridProps } from '@mui/material';

export default function AppGrid(props: Readonly<GridProps>) {
  return <Grid container spacing={2} alignItems="flex-start" {...props}></Grid>;
}
