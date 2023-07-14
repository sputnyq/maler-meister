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

import React, { useEffect, useState } from 'react';

import AddFab from '../../components/aa-shared/AddFab';
import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

import { addYears, endOfYear, startOfYear } from 'date-fns';

export default function MyVacations() {
  const [yearSwitchValue, setYearSwitchValue] = useState<'last' | 'current' | 'next'>('current');
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<DailyEntry[]>([]);

  useEffect(() => {
    let dateObj = undefined;

    const now = new Date();

    switch (yearSwitchValue) {
      case 'current':
        dateObj = {
          $gte: startOfYear(now),
          $lt: now,
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
  }, [yearSwitchValue, user]);

  return (
    <>
      <AddFab onClick={() => setOpen(true)} />
      <Card>
        <CardHeader title="Mein Urlaub" />
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
                  Laufendes Jahr
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
                          {new Intl.DateTimeFormat('de-DE', {
                            month: 'long',
                            weekday: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          }).format(new Date(de.date))}
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
