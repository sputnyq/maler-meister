import { Box, Card, CardContent, MenuItem } from '@mui/material';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import { AppTextField } from '../../components/AppTextField';
import { AppState } from '../../store';

export default function Upload() {
  const constructions = useSelector<AppState, Construction[]>((s) => s.construction.activeConstructions || []);

  const [constructionId, setConstructionId] = useState('');

  return (
    <Box display="flex" justifyContent="center">
      <Card elevation={0}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3} minWidth="300px">
            <AppTextField
              select
              label="Baustelle"
              value={constructionId}
              onChange={(ev) => {
                setConstructionId(ev.target.value);
              }}
            >
              {constructions.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {`${id} - ${name}`}
                </MenuItem>
              ))}
            </AppTextField>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
