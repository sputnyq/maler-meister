import { Card, CardContent, CardHeader } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppDataGrid } from '../../components/aa-shared/app-data-grid/AppDataGrid';
import { useLoadActiveConstructions } from '../../hooks/useLoadActiveConstructions';
import { AppDispatch, AppState } from '../../store';
import { updateConstruction } from '../../store/constructionReducer';
import CreateConstruction from './CreateConstruction';

export default function Constructions() {
  useLoadActiveConstructions();

  const dispatch = useDispatch<AppDispatch>();

  const activeConstructions = useSelector<AppState, Construction[]>((s) => s.construction.activeConstructions || []);

  console.log(activeConstructions);
  return (
    <>
      <Card>
        <CardHeader title="Aktive Baustellen" />
        <CardContent>
          <AppDataGrid
            key={activeConstructions.length}
            onUpdate={(next) => {
              dispatch(updateConstruction(next));
            }}
            disablePagination
            data={activeConstructions}
            columns={[
              {
                field: 'id',
                headerName: 'ID',
                renderCell({ id }) {
                  return <Link to={`${id}`}>{id}</Link>;
                },
              },
              {
                flex: 1,
                field: 'name',
                headerName: 'Name',
                editable: true,
              },
              {
                field: 'active',
                type: 'boolean',
              },
            ]}
          />
        </CardContent>
      </Card>
      <CreateConstruction />
    </>
  );
}
