import { cloneDeep } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { appRequest } from "../../fetch/fetch-client";
import { useLoadActiveConstructions } from "../../hooks/useLoadActiveConstructions";
import { useLoadJobs } from "../../hooks/useLoadJobs";
import { AppState } from "../../store";
import { getCurrentDBDate } from "../../utils";
import AddFab from "../../components/aa-shared/AddFab";
import { AppFullScreenDialog } from "../../components/aa-shared/AppFullScreenDialog";
import TimeEntryEditor from "../../components/aa-shared/TimeEntryEditor";

export default function TimeCaptureFlow() {
  useLoadActiveConstructions();
  useLoadJobs();

  const username = useSelector<AppState, string>(
    (s) => s.login.user?.username || ""
  );

  const [open, setOpen] = useState(false);

  const [dailyEntry, setDailyEntry] = useState<DailyEntry>({
    date: getCurrentDBDate(),
    type: "Arbeit",
  } as DailyEntry);

  const handleSave = () => {
    const toPersist = cloneDeep(dailyEntry);

    const sum =
      dailyEntry.type === "Arbeit"
        ? dailyEntry.workEntries?.reduce((acc, next) => {
            return acc + Number(next.hours);
          }, 0)
        : 8;
    toPersist.sum = sum;
    toPersist.username = username;
    appRequest("post")("daily-entries", { data: toPersist })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        alert("Zeiten konnten nicht gespeichert werden");
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    <>
      <AppFullScreenDialog
        title="Zeit eintragen"
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleSave}
      >
        <TimeEntryEditor
          dailyEntry={dailyEntry}
          setDailyEntry={(de) => {
            setDailyEntry(de);
          }}
        />
      </AppFullScreenDialog>
      <AddFab onClick={() => setOpen(true)} />
    </>
  );
}
