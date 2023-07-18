import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { RequestDailyViewButton } from '../../components/RequestDailyViewButton';
import AddFab from '../../components/aa-shared/AddFab';
import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { DailyEntryViewDialog } from '../time-capture/DailyEntryViewDialog';
import RequestVacationsDialog from './RequestVacationsDialog';

import { addYears, endOfYear, startOfYear } from 'date-fns';

export default function MyVacations() {
  const user = useCurrentUser();

  const [yearSwitchValue, setYearSwitchValue] = useState<'last' | 'current' | 'next'>('current');
  const [update, setUpdate] = useState(0);
  const [requestDialog, setRequestDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [data, setData] = useState<DailyEntry[]>([]);

  const dailyEntryId = useRef('');

  useEffect(() => {
    let dateObj = undefined;

    const now = new Date();

    switch (yearSwitchValue) {
      case 'current':
        dateObj = {
          $gte: startOfYear(now),
          $lte: now,
        };
        break;

      case 'last':
        dateObj = {
          $gte: startOfYear(addYears(now, -1)),
          $lt: endOfYear(addYears(now, -1)),
        };
        break;
      case 'next':
        dateObj = {
          $gt: now,
        };
    }
    const queryObj = {
      filters: {
        username: user?.username,
        type: 'Urlaub',
        date: dateObj,
      },
      sort: { '0': 'date:desc' },
    };

    loadDailyEntries(queryObj).then((res) => {
      if (res) {
        setData(res.dailyEntries);
      }
    });
  }, [yearSwitchValue, user, update]);

  const handleDialogRequest = (id: any) => {
    dailyEntryId.current = id;
    setViewDialog(true);
  };

  const handleCloseRequest = useCallback(() => {
    setUpdate((u) => u + 1);
    setViewDialog(false);
    setRequestDialog(false);
  }, []);

  return (
    <>
      <DailyEntryViewDialog
        dailyEntryId={dailyEntryId.current}
        dialogOpen={viewDialog}
        closeDialog={handleCloseRequest}
      />

      <RequestVacationsDialog open={requestDialog} onClose={handleCloseRequest} />

      <AddFab onClick={() => setRequestDialog(true)} />

      <Card>
        <CardContent>
          <Box display={'flex'} flexDirection="column" gap={2}>
            <Box maxWidth={400}>
              <ToggleButtonGroup
                color="primary"
                fullWidth
                exclusive
                value={yearSwitchValue}
                onChange={(_, value) => {
                  value && setYearSwitchValue(value);
                }}
              >
                <ToggleButton size="small" value="last">
                  Letztes Jahr
                </ToggleButton>
                <ToggleButton size="small" value="current">
                  Dieses Jahr
                </ToggleButton>
                <ToggleButton size="small" value="next">
                  Geplant
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box display={'flex'} justifyContent="space-between">
              <Typography color={'GrayText'} variant="h6">
                Gesamt:
              </Typography>
              <Typography color={'GrayText'} variant="h6">{`${data.length} Tag(e)`}</Typography>
            </Box>

            <Box>
              <List>
                {data.map((de) => {
                  return (
                    <React.Fragment key={de.id}>
                      <ListItem>
                        <ListItemIcon>
                          <BeachAccessIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText>
                          <RequestDailyViewButton value={de.date} onClick={() => handleDialogRequest(de.id)} />
                        </ListItemText>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
