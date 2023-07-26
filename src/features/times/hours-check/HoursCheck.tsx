import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlined from '@mui/icons-material/KeyboardArrowRightOutlined';
import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from '@mui/material';

import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useIsSmall } from '../../../hooks/useIsSmall';
import { AppState } from '../../../store';
import { HoursCheckRow } from './HoursCheckRow';

import { addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

export function HoursCheck() {
  const small = useIsSmall();

  const [value, setValue] = useState('0');
  const allUsers = useSelector<AppState, User[]>((s) => s.users.all);

  const interval = useMemo(() => {
    const now = new Date();
    if (small) {
      return {
        start: startOfWeek(addWeeks(now, Number(value)), { weekStartsOn: 1 }),
        end: endOfWeek(addWeeks(now, Number(value)), { weekStartsOn: 1 }),
      };
    } else {
      return {
        start: startOfMonth(addMonths(now, Number(value))),
        end: endOfMonth(addMonths(now, Number(value))),
      };
    }
  }, [small, value]);

  const workers = allUsers.filter((user) => user.userRole === 'worker');

  const allDays = eachDayOfInterval({ end: interval.end, start: interval.start });

  return (
    <Box display={'flex'} flexDirection="column" gap={2}>
      <Card>
        <CardContent>
          <Box maxWidth={400} margin="auto">
            <ToggleButtonGroup
              color="primary"
              fullWidth
              exclusive
              value={value}
              onChange={(_, value) => {
                value && setValue(value);
              }}
            >
              <ToggleButton size="small" value={'-1'} disabled={value === '-1'}>
                <KeyboardArrowLeftOutlinedIcon />
              </ToggleButton>

              <ToggleButton size="small" value={'0'} disabled={value === '0'}>
                <KeyboardArrowRightOutlined />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: 'sticky', left: '0' }} />
              {allDays.map((day, index) => (
                <TableCell align="center" key={index}>
                  {new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(day)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {workers.map((user) => (
              <HoursCheckRow key={user.username} user={user} start={interval.start} end={interval.end} />
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  );
}

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
  '& td, & th': {
    padding: '5px',
  },
  '& th': {
    background: theme.palette.primary.light,
    color: 'white',
    fontWeight: 'bold',
  },
}));
