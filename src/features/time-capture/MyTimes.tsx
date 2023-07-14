import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import MasksIcon from '@mui/icons-material/MasksOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { RequestDailyViewButton } from '../../components/RequestDailyViewButton';
import { DEFAULT_HOURS } from '../../constants';
import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getJobColor } from '../../utilities';
import { DailyEntryViewDialog } from './DailyEntryViewDialog';

import { addMonths, startOfMonth } from 'date-fns';

interface Props {
  update: number;
  requestUpdate(): void;
}

export function MyTimes({ update, requestUpdate }: Props) {
  const user = useCurrentUser();
  const [monthValue, setMonthValue] = useState<'current' | 'last'>('current');
  const [data, setData] = useState<DailyEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dailyEntryId = useRef('');

  useEffect(() => {
    let dateObj = undefined;

    const now = new Date();

    switch (monthValue) {
      case 'current':
        dateObj = {
          $gte: startOfMonth(now),
        };
        break;
      case 'last':
        dateObj = {
          $gte: startOfMonth(addMonths(now, -1)),
          $lt: startOfMonth(now),
        };
        break;
    }

    const queryObj = {
      filters: {
        username: {
          $eq: user?.username,
        },
        date: dateObj,
      },
      sort: { '0': 'date:desc' },
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
  }, [user, monthValue, update]);

  const allHours = useMemo(() => data.reduce((acc, cur) => acc + cur.sum, 0), [data]);

  const handleDialogRequest = (id: any) => {
    dailyEntryId.current = id;
    setDialogOpen(true);
  };

  const handleCloseRequest = () => {
    requestUpdate();
    setDialogOpen(false);
  };

  return (
    <>
      <Box display={'flex'} flexDirection="column" gap={2}>
        <Box maxWidth={400}>
          <ToggleButtonGroup
            color="primary"
            fullWidth
            exclusive
            value={monthValue}
            onChange={(_, value) => {
              value && setMonthValue(value);
            }}
          >
            <ToggleButton size="small" value="current">
              Laufender Monat
            </ToggleButton>
            <ToggleButton size="small" value="last">
              Letzter Monat
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box display={'flex'} justifyContent="space-between">
          <Typography color={'GrayText'} variant="h6">
            Gesamt:
          </Typography>
          <Typography color={'GrayText'} variant="h6">{`${allHours} Stunden`}</Typography>
        </Box>
        <UserTimesGrid handleDialogRequest={handleDialogRequest} dailyEntries={data} />
      </Box>

      <DailyEntryViewDialog
        closeDialog={handleCloseRequest}
        dailyEntryId={dailyEntryId.current}
        dialogOpen={dialogOpen}
      />
    </>
  );
}

interface UserTimesGridProps {
  dailyEntries: DailyEntry[];
  handleDialogRequest(id: string | number | undefined): void;
}
function UserTimesGrid({ dailyEntries, handleDialogRequest }: UserTimesGridProps) {
  const getIcon = (de: DailyEntry) => {
    const color = getJobColor(de.type);
    switch (de.type) {
      case 'Krank':
        return <MasksIcon color={color} />;
      case 'Schule':
        return <SchoolOutlinedIcon color={color} />;
      case 'Urlaub':
        return <BeachAccessIcon color={color} />;
      default:
        return <FormatPaintOutlinedIcon color={color} />;
    }
  };

  const showDivider = (idx: number) => {
    if (idx === dailyEntries.length - 1) {
      return false;
    }
    if (dailyEntries[idx].date === dailyEntries[idx + 1].date) {
      return false;
    }
    return true;
  };

  const renderHours = (value: string | number) => {
    const diff = Number(value) - DEFAULT_HOURS;
    if (diff < 0) {
      return <Chip size="small" label={value} color={'warning'} />;
    } else if (diff > 0) {
      return <Chip size="small" label={value} color={'primary'} />;
    } else {
      return <Chip size="small" label={value} color={'success'} />;
    }
  };
  return (
    <List>
      {dailyEntries.map((de, idx) => {
        return (
          <React.Fragment key={de.id}>
            <ListItem secondaryAction={renderHours(de.sum)} dense>
              <Tooltip title={de.type}>
                <ListItemIcon>{getIcon(de)}</ListItemIcon>
              </Tooltip>
              <ListItemText>
                <RequestDailyViewButton value={de.date} onClick={() => handleDialogRequest(de.id)} />
              </ListItemText>
            </ListItem>
            {showDivider(idx) ? <Divider /> : null}
          </React.Fragment>
        );
      })}
    </List>
  );
}
