import { Card, CardContent, Grid, MenuItem, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

import React from 'react';
import { useSelector } from 'react-redux';

import AppGrid from '../../components/AppGrid';
import { AppTextField } from '../../components/AppTextField';
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
              <ToggleButton size="small" value="Krank">
                Krank
              </ToggleButton>
              <ToggleButton size="small" value="Schule">
                Schule
              </ToggleButton>
              <ToggleButton size="small" value="Feiertag">
                Feiertag
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </GridItem>
      </AppGrid>

      <Box width={'100%'}>
        {dailyEntry.type === 'Arbeit' ? (
          <WorkEntriesEditor workEntries={workEntries} setWorkEntries={setWorkEntries} />
        ) : (
          <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
            <Typography variant="h3">8</Typography>
            <Typography>Stunden werden eingetragen</Typography>
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
        <WorkEntryLine
          workEntry={workEntry}
          deleteEntry={deleteByIndex(index)}
          update={updateWorkEntryByIndex(index)}
        />
      </Box>
    </>
  );
}

interface WorkEntryTile {
  workEntry: WorkEntry;
  update(workEntry: WorkEntry): void;
  deleteEntry(): void;
}

function WorkEntryLine({ workEntry, update }: WorkEntryTile) {
  const appJobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);
  const constructions = useSelector<AppState, Construction[]>((s) => s.construction.activeConstructions || []);

  const getJobName = (jobId: number) => {
    return appJobs.find((j) => j.id === jobId)?.name;
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ background: '#fafafa' }}>
        <CardContent>
          {/* <AppGrid>
            <Grid item xs={10}> */}
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
                  const jobId = Number(ev.target.value);
                  console.log(jobId);

                  update({
                    ...workEntry,
                    jobId,
                    //@ts-ignore
                    job: getJobName(jobId),
                  });
                }}
                value={workEntry.jobId}
                select
                type="number"
                label="Tätigkeit"
              >
                {appJobs.map((job) => {
                  return (
                    <MenuItem key={job.id} value={job.id}>
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
          {/* </Grid> */}
          {/* <Grid item xs={2}>
              <IconButton onClick={deleteEntry} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid> */}
          {/* </AppGrid> */}
        </CardContent>
      </Card>
    </Box>
  );
}
