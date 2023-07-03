import { Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { AppDataGrid } from "../components/app-data-grid/AppDataGrid";
import CreateConstruction from "../components/CreateConstruction";
import { useLoadActiveConstructions } from "../hooks/useLoadActiveConstructions";
import { AppState } from "../store";

export default function Constructions() {
  useLoadActiveConstructions();

  const activeConstructions = useSelector<AppState, Construction[]>(
    (s) => s.construction.activeConstructions
  );

  return (
    <>
      <Paper>
        <AppDataGrid
          disablePagination
          data={activeConstructions}
          columns={[
            {
              field: "name",
              headerName: "Name",
            },
            {
              field: "active",
              headerName: "Aktiv?",
              type: "boolean",
              editable: true,
            },
          ]}
        />
      </Paper>
      <CreateConstruction />
    </>
  );
}
