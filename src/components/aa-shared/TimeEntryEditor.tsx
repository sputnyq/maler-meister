import {
  Card,
  CardContent,
  Grid,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { cloneDeep } from "lodash";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { AddButton } from "../AddButton";
import AppGrid from "./AppGrid";
import { AppTextField } from "./AppTextField";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MasksIcon from "@mui/icons-material/Masks";

interface Props {
  dailyEntry: DailyEntry;
  setDailyEntry(de: DailyEntry): void;
}

function GridItem(props: React.PropsWithChildren) {
  return (
    <Grid item xs={12} sm={3}>
      {props.children}
    </Grid>
  );
}

export default function TimeEntryEditor({ dailyEntry, setDailyEntry }: Props) {
  const onPropChange = (prop: keyof DailyEntry) => {
    return function (value: any) {
      const next = { ...dailyEntry, [prop]: value };
      setDailyEntry(next);
    };
  };

  return (
    <Box p={2}>
      <AppGrid>
        <GridItem>
          <AppTextField
            label="Datum"
            type={"date"}
            value={dailyEntry.date}
            onChange={(ev) => {
              onPropChange("date")(ev.target.value);
            }}
          />
        </GridItem>
        <GridItem>
          <Box width={"100%"} display="flex" justifyContent={"center"}>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={dailyEntry.type}
              onChange={(_, value) => {
                value && onPropChange("type")(value);
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

      <Box width={"100%"} marginY={1}>
        {dailyEntry.type === "Arbeit" ? (
          <WorkEntriesEditor
            workEntries={dailyEntry.workEntries || []}
            onChange={onPropChange("workEntries")}
          />
        ) : (
          <Box
            mt={5}
            display="flex"
            alignItems="center"
            flexDirection="column"
            gap={2}
          >
            {dailyEntry.type === "Urlaub" ? (
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

interface WEProps {
  workEntries: WorkEntry[];
  onChange(we: WorkEntry[]): void;
}

function WorkEntriesEditor({ onChange, workEntries }: WEProps) {
  const handleAdd = useCallback(() => {
    onChange([...workEntries, { hours: "8" } as WorkEntry]);
  }, [workEntries, onChange]);

  const updateWorkEntryByIndex = (index: number) => {
    return function (workEntry: WorkEntry) {
      const next = cloneDeep(workEntries);
      next.splice(index, 1, workEntry);

      onChange(next);
    };
  };

  return (
    <>
      {workEntries.map((workEntry, index) => (
        <WorkEntryLine
          key={index}
          workEntry={workEntry}
          update={updateWorkEntryByIndex(index)}
        />
      ))}
      <Box marginY={1}>
        <AddButton onAdd={handleAdd} />
      </Box>
    </>
  );
}

interface WEEntryLineProps {
  workEntry: WorkEntry;
  update(workEntry: WorkEntry): void;
}
function WorkEntryLine({ workEntry, update }: WEEntryLineProps) {
  const appJobs = useSelector<AppState, AppJob[]>((s) => s.jobs.jobs || []);
  const constructions = useSelector<AppState, Construction[]>(
    (s) => s.construction.activeConstructions || []
  );

  const onBlur = () => {
    update(workEntry);
  };

  return (
    <Box mt={2}>
      <Card variant="outlined" sx={{ background: "#fafafa" }}>
        <CardContent>
          <AppGrid>
            <GridItem>
              <AppTextField
                select
                onBlur={onBlur}
                label="Baustelle"
                value={workEntry.constructionName}
                onChange={(ev) => {
                  update({
                    ...workEntry,
                    constructionName: ev.target.value,
                  });
                }}
              >
                {constructions.map((c) => (
                  <MenuItem key={c.id} value={c.name}>
                    {c.name}
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
        </CardContent>
      </Card>
    </Box>
  );
}
