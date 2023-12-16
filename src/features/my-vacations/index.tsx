import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
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

import AddFab from '../../components/AddFab';
import { ColFlexBox } from '../../components/ColFlexBox';
import { RequestDailyViewButton } from '../../components/RequestDailyViewButton';
import { loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { StrapiQueryObject } from '../../utilities';
import { DailyEntryViewDialog } from '../time-capture/DailyEntryViewDialog';
import RequestVacationsDialog from './RequestVacationsDialog';

import { addYears, endOfYear, startOfYear } from 'date-fns';

export default function MyVacations() {
  const user = useCurrentUser();

  const [yearSwitchValue, setYearSwitchValue] = useState<'last' | 'current'>('current');
  const [update, setUpdate] = useState(0);
  const [requestDialog, setRequestDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [data, setData] = useState<DailyEntry[]>([]);
  const [plannedData, setPlannedData] = useState<DailyEntry[]>([]);

  const dailyEntryId = useRef('');

  useEffect(() => {
    const buildQueryObject = (dateObj: any) => {
      return {
        filters: {
          tenant: user?.tenant,
          username: user?.username,
          type: 'Urlaub',
          date: dateObj,
        },
        sort: { '0': 'date:desc' },
      } as StrapiQueryObject;
    };

    let dateObj = undefined;
    let nextDateObj = undefined;

    const now = new Date();

    if (yearSwitchValue === 'last') {
      dateObj = {
        $gte: startOfYear(addYears(now, -1)),
        $lte: endOfYear(addYears(now, -1)),
      };
      setPlannedData([]);
    } else {
      dateObj = {
        $gte: startOfYear(now),
        $lte: now,
      };
      nextDateObj = {
        $gt: now,
        $lte: endOfYear(now),
      };
    }

    if (nextDateObj) {
      loadDailyEntries(buildQueryObject(nextDateObj)).then((res) => {
        if (res) {
          setPlannedData(res.dailyEntries);
        }
      });
    }
    if (dateObj) {
      loadDailyEntries(buildQueryObject(dateObj)).then((res) => {
        if (res) {
          setData(res.dailyEntries);
        }
      });
    }
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

  const sum = data.length + plannedData.length;

  return (
    <>
      <DailyEntryViewDialog
        dailyEntryId={dailyEntryId.current}
        dialogOpen={viewDialog}
        closeDialog={handleCloseRequest}
      />

      <RequestVacationsDialog open={requestDialog} onClose={handleCloseRequest} />

      <AddFab onClick={() => setRequestDialog(true)} />

      <Card sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <CardContent>
          <ColFlexBox>
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
              </ToggleButtonGroup>
            </Box>
            <Typography variant="h5">Gesamt: {sum} Tage(e)</Typography>
          </ColFlexBox>
        </CardContent>
      </Card>
      {plannedData.length > 0 && (
        <DataRenderer data={plannedData} prefix="Geplant" handleDialogRequest={handleDialogRequest} />
      )}
      <DataRenderer data={data} prefix="Genommen" handleDialogRequest={handleDialogRequest} />
    </>
  );
}

interface Props {
  data: DailyEntry[];
  prefix: string;
  handleDialogRequest: (id: number | undefined) => void;
}

function DataRenderer({ data, prefix, handleDialogRequest }: Readonly<Props>) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{`${prefix}: ${data.length} Tag(e)`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
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
      </AccordionDetails>
    </Accordion>
  );
}
