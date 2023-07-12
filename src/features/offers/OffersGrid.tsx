import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { useMemo } from 'react';

export default function OffersGrid() {
  const columns = useMemo(() => {
    return [{ field: 'id', headerName: 'Angebot NR' }] as GridColDef[];
  }, []);

  return <DataGrid columns={columns} rows={[{ id: '1' }]}></DataGrid>;
}
