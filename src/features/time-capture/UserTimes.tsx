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

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { RequestDailyViewButton } from '../../components/RequestDailyViewButton';
import { DEFAULT_HOURS } from '../../constants';
import { appRequest } from '../../fetch/fetch-client';
import { AppState } from '../../store';
import { buildQuery, genericConverter, getColor, getMonthStart } from '../../utilities';
import { DailyEntryViewDialog } from './DailyEntryViewDialog';

interface Props {
  update: number;
  requestUpdate(): void;
}

export function UserTimes({ update, requestUpdate }: Props) {
  const username = useSelector<AppState, string | undefined>((s) => s.login.user?.username);

  const [monthValue, setMonthValue] = useState<'current' | 'last'>('current');
  const [data, setData] = useState<DailyEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dailyEntryId = useRef('');

  useEffect(() => {
    const buildSearchQuery = () =>
      buildQuery({
        filters: {
          username: {
            $eq: username,
          },
          date: {
            $gte: monthValue === 'current' ? getMonthStart() : getMonthStart(-1),
            $lt: monthValue === 'current' ? undefined : getMonthStart(),
          },
        },
        sort: { '0': 'date:desc' },
      });

    appRequest('get')(`daily-entries?${buildSearchQuery()}`)
      .then((res) => {
        const data = res.data.map((e: any) => genericConverter<DailyEntry[]>(e));
        setData(data);
      })
      .catch((e) => {
        console.log(e);
        alert('Fehler beim Laden');
      });
  }, [username, monthValue, update]);

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
    const color = getColor(de.type);
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
          <>
            <ListItem secondaryAction={<Typography>{renderHours(de.sum)}</Typography>} dense>
              <Tooltip title={de.type}>
                <ListItemIcon>{getIcon(de)}</ListItemIcon>
              </Tooltip>
              <ListItemText>
                <RequestDailyViewButton value={de.date} onClick={() => handleDialogRequest(de.id)} />
              </ListItemText>
            </ListItem>
            {showDivider(idx) ? <Divider /> : null}
          </>
        );
      })}
    </List>
  );
}
