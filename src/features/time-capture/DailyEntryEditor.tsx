import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MasksIcon from '@mui/icons-material/MasksOutlined';
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import AppGrid from '../../components/AppGrid';
import { AppTextField } from '../../components/aa-shared/AppTextField';
import { AddButtonWidget } from '../../components/widgets/AddButtonWidget';
import { AppState } from '../../store';

import { cloneDeep } from 'lodash';

interface Props {
  dailyEntry: DailyEntry;
  workEntries: WorkEntry[];
  setDailyEntry(dailyEntries: DailyEntry): void;
  setWorkEntries(workEntries: WorkEntry[]): void;
}

export default function DailyEntryEditor({ dailyEntry, workEntries, setWorkEntries, setDailyEntry }: Props) {
  const onPropChange = (prop: keyof DailyEntry) => {
    return function (value: any) {
      const next = { ...dailyEntry, [prop]: value };
      setDailyEntry(next);
    };
  };

  return (
    <Box p={2} display="flex" flexDirection={'column'} gap={2}>
      <AppGrid>
        <GridItem>
          <AppTextField
            label="Datum"
            type={'date'}
            value={dailyEntry.date}
            onChange={(ev) => {
              onPropChange('date')(ev.target.value);
            }}
          />
        </GridItem>
        <GridItem>
          <Box width={'100%'} display="flex" justifyContent={'center'}>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={dailyEntry.type}
              onChange={(_, value) => {
                value && onPropChange('type')(value);
              }}
            >
              <ToggleButton size="small" value="Arbeit">
                Arbeit
              </ToggleButton>
              <ToggleButton size="small" value="Urlaub">
                Urlaub
              </ToggleButton>
              <ToggleButton size="small" value="Krank">
                Krank
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </GridItem>
      </AppGrid>

      <Box width={'100%'}>
        {dailyEntry.type === 'Arbeit' ? (
          <WorkEntriesEditor workEntries={workEntries} setWorkEntries={setWorkEntries} />
        ) : (
          <Box mt={5} display="flex" alignItems="center" flexDirection="column" gap={2}>
            {dailyEntry.type === 'Urlaub' ? (
              <>
                <BeachAccessIcon sx={{ fontSize: 80 }} color="disabled" />
                <Typography variant="subtitle2">Genieße die Zeit!</Typography>
              </>
            ) : (
              <>
                <MasksIcon sx={{ fontSize: 80 }} color="disabled" />
                <Typography align="center" variant="subtitle2">
                  Gute Besserung!
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function GridItem(props: React.PropsWithChildren) {
  return (
    <Grid item xs={12} sm={4}>
      {props.children}
    </Grid>
  );
}

interface WorkEntryEditorProps {
  workEntries: WorkEntry[];
  setWorkEntries(workEntries: WorkEntry[]): void;
}

function WorkEntriesEditor({ setWorkEntries, workEntries }: WorkEntryEditorProps) {
  const handleAdd = useCallback(() => {
    setWorkEntries([...workEntries, { hours: '8' } as WorkEntry]);
  }, [workEntries, setWorkEntries]);

  const updateWorkEntryByIndex = (index: number) => {
    return function (workEntry: WorkEntry) {
      const next = cloneDeep(workEntries);
      next.splice(index, 1, workEntry);

      setWorkEntries(next);
    };
  };

  const deleteByIndex = (index: number) => {
    return function () {
      const next = cloneDeep(workEntries);
      next.splice(index, 1);

      setWorkEntries(next);
    };
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        {workEntries.map((workEntry, index) => (
          <WorkEntryLine
            key={index}
            workEntry={workEntry}
            deleteEntry={deleteByIndex(index)}
            update={updateWorkEntryByIndex(index)}
          />
        ))}
        <Box>
          <AddButtonWidget onAdd={handleAdd} />
        </Box>
      </Box>
    </>
  );
}

interface WorkEntryTile {
  workEntry: WorkEntry;
  update(workEntry: WorkEntry): void;
  deleteEntry(): void;
}

function WorkEntryLine({ workEntry, update, deleteEntry }: WorkEntryTile) {
  const appJobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);
  const constructions = useSelector<AppState, Construction[]>((s) => s.construction.activeConstructions || []);

  return (
    <Box>
      <Card variant="outlined" sx={{ background: '#fafafa' }}>
        <CardContent>
          <AppGrid>
            <Grid item xs={10}>
              <AppGrid>
                <GridItem>
                  <AppTextField
                    select
                    label="Baustelle"
                    value={workEntry.constructionId}
                    onChange={(ev) => {
                      update({
                        ...workEntry,
                        //@ts-ignore
                        constructionId: ev.target.value,
                      });
                    }}
                  >
                    {constructions.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {`${id} - ${name}`}
                      </MenuItem>
                    ))}
                  </AppTextField>
                </GridItem>
                <GridItem>
                  <AppTextField
                    onChange={(ev) => {
                      update({ ...workEntry, job: ev.target.value });
                    }}
                    value={workEntry.job}
                    select
                    label="Tätigkeit"
                  >
                    {appJobs.map((job) => {
                      return (
                        <MenuItem key={job.id} value={job.name}>
                          {job.name}
                        </MenuItem>
                      );
                    })}
                  </AppTextField>
                </GridItem>
                <GridItem>
                  <AppTextField
                    value={workEntry.hours}
                    label="Stunden"
                    type="number"
                    onChange={(ev) => {
                      update({
                        ...workEntry,
                        hours: ev.target.value,
                      });
                    }}
                  />
                </GridItem>
              </AppGrid>
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={deleteEntry} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </AppGrid>
        </CardContent>
      </Card>
    </Box>
  );
}
