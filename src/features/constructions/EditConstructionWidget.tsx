import { Box, Card, CardContent, CardHeader, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';

import { useCallback } from 'react';

import { AppTextField } from '../../components/aa-shared/AppTextField';
import { DateRangeWidget } from '../../components/widgets/DateRangeWidget';

interface Props {
  construction: Construction;
  setConstruction(c: Construction): void;
}

export default function EditConstructionWidget({ setConstruction, construction }: Props) {
  const setProp = useCallback(
    (prop: keyof Construction, value: any) => {
      setConstruction({ ...construction, [prop]: value } as Construction);
    },
    [setConstruction, construction],
  );

  return (
    <Card elevation={0}>
      <CardHeader title={`Baustelle: ${construction.id || ' Neu'}`} />

      <CardContent>
        <Box display={'flex'} flexDirection="column" gap={2} maxWidth={'400px'}>
          <AppTextField label="NAme" value={construction.name} onChange={(ev) => setProp('name', ev.target.value)} />

          <AppTextField
            label="Arbeiter"
            type="number"
            value={construction.allocatedPersons}
            onChange={(ev) => setProp('allocatedPersons', ev.target.value)}
          />

          <DateRangeWidget
            definedRanges={[]}
            setDateRange={(dr) => {
              setConstruction({ ...construction, start: dr.startDate, end: dr.endDate } as Construction);
            }}
            dateRange={{ startDate: new Date(construction.start), endDate: new Date(construction.end) }}
          />

          <FormGroup>
            <FormControlLabel
              control={<Switch onChange={(ev) => setProp('active', ev.target.checked)} checked={construction.active} />}
              label="Aktiv"
            />
          </FormGroup>
          <Typography variant="subtitle2">
            Aktive Baustellen sind für die Arbeiter sichtbar. Die Arbeitstunden können auf aktive Baustellen gebucht
            werden.
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch onChange={(ev) => setProp('confirmed', ev.target.checked)} checked={construction.confirmed} />
              }
              label="Bestätigt"
            />
          </FormGroup>
        </Box>
      </CardContent>
    </Card>
  );
}
