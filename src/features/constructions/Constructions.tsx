import { Card, CardContent, CardHeader } from '@mui/material';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import AppTypo from '../../components/aa-shared/AppTypo';
import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { useLoadActiveConstructions } from '../../hooks/useLoadActiveConstructions';
import { AppState } from '../../store';
import CreateConstruction from './CreateConstruction';

export default function Constructions() {
  useLoadActiveConstructions();

  const activeConstructions = useSelector<AppState, Construction[]>((s) => s.construction.activeConstructions || []);

  return (
    <>
      <Card>
        <CardHeader title="Aktive Baustellen" />
        <CardContent>
          <AppDataGrid
            onUpdate={(next) => {
              console.log(next); //TODO:
            }}
            disablePagination
            data={activeConstructions}
            columns={[
              {
                field: 'id',
                headerName: 'ID',
                renderCell({ id }) {
                  return <Link to={`edit/${id}`}>{id}</Link>;
                },
              },
              {
                flex: 1,
                field: 'name',
                headerName: 'Name',
              },
            ]}
          />
        </CardContent>
      </Card>
      <CreateConstruction />
    </>
  );
}
