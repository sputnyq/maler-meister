import { Box, Chip, TableCell, TableRow, Tooltip, styled } from '@mui/material';

import { useEffect, useState } from 'react';

import { loadDailyEntries } from '../../../fetch/api';
import { getJobColor } from '../../../utilities';

import { eachDayOfInterval, formatISO } from 'date-fns';

interface Props {
  user: User;
  start: Date;
  end: Date;
}

export function HoursCheckRow({ user, end, start }: Props) {
  const [data, setData] = useState<DailyEntry[]>([]);

  const allDays = eachDayOfInterval({ end, start });

  useEffect(() => {
    const queryObj = {
      filters: {
        username: user.username,
        date: {
          $gte: formatISO(start, { representation: 'date' }),
          $lte: formatISO(end, { representation: 'date' }),
        },
      },
    };

    loadDailyEntries(queryObj)
      .then((res) => {
        if (res) {
          setData(res.dailyEntries);
        }
      })
      .catch((e) => {
        console.log(e);
        alert('Fehler beim Laden');
      });
  }, [end, start, user]);

  const getValues = (date: Date) => {
    return data.filter((de) => de.date === formatISO(date, { representation: 'date' }));
  };

  const renderValues = (dailyEntries: DailyEntry[]) => {
    return dailyEntries.map((de) => {
      return (
        <Tooltip key={de.id} title={de.type}>
          <Box p={'1px'} sx={{ background: 'error' }}>
            <Chip size="small" color={getJobColor(de.type)} label={de.sum} />
          </Box>
        </Tooltip>
      );
    });
  };

  return (
    <StyledTableRow>
      <TableCell align="left" sx={{ position: 'sticky', left: '0', background: 'white' }}>
        {user.lastName}
      </TableCell>
      {allDays.map((date, index) => (
        <TableCell key={index} align="center">
          {renderValues(getValues(date))}
        </TableCell>
      ))}
    </StyledTableRow>
  );
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[50],
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
  // hide last border
  '& td:last-child': {
    borderRight: 0,
  },
}));
