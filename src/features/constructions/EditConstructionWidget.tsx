import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material';

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppGrid from '../../components/AppGrid';
import { AppGridField } from '../../components/AppGridField';
import { AppTextField } from '../../components/aa-shared/AppTextField';
import { DateRangeWidget } from '../../components/widgets/DateRangeWidget';
import { appRequest } from '../../fetch/fetch-client';

interface Props {
  construction: Construction;
  hideDelete?: true;
  onSave?: () => void;
}

export default function EditConstructionWidget({ onSave, construction: init, hideDelete }: Props) {
  const [construction, setConstruction] = useState<Construction>(init);

  const navigate = useNavigate();

  const handleDeleteRequest = useCallback(() => {
    if (confirm('Baustelle wirklich löschen?\nNur nicht bestätigte Baustellen sollen gelöscht werden.')) {
      appRequest('delete')(`constructions/${construction.id}`)
        .then(() => {
          navigate(-1);
        })
        .catch((e) => {
          console.log(e);
          alert('Beim Löschen ist ein Fehler aufgetreten');
        });
    }
  }, [construction.id, navigate]);

  const setProp = useCallback((prop: keyof Construction, value: any) => {
    setConstruction((cstr) => ({ ...cstr, [prop]: value } as Construction));
  }, []);

  const handleSaveRequest = () => {
    appRequest(construction.id ? 'put' : 'post')(`constructions/${construction.id || ''}`, { data: construction })
      .then(() => {
        onSave?.();
      })
      .catch((e) => {
        console.log(e);
        alert('Fehler beim speichern!');
      });
  };

  if (!construction) {
    return null;
  }

  return (
    <Card elevation={0}>
      <CardHeader title={`Baustelle: ${construction.id || ' -1'}`} />

      <CardContent>
        <Box display={'flex'} flexDirection="column" gap={4}>
          <AppGrid>
            <AppGridField>
              <AppTextField value={construction.name} onChange={(ev) => setProp('name', ev.target.value)} />
            </AppGridField>

            <AppGridField>
              <AppTextField
                label="Arbeiter"
                type="number"
                value={construction.allocatedPersons}
                onChange={(ev) => setProp('allocatedPersons', ev.target.value)}
              />
            </AppGridField>

            <AppGridField>
              <DateRangeWidget
                definedRanges={[]}
                setDateRange={(dr) => {
                  setConstruction((c) => ({ ...c, start: dr.startDate, end: dr.endDate } as Construction));
                }}
                dateRange={{ startDate: new Date(construction.start), endDate: new Date(construction.end) }}
              />
            </AppGridField>
          </AppGrid>

          <AppGrid>
            <AppGridField>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch onChange={(ev) => setProp('active', ev.target.checked)} checked={construction.active} />
                  }
                  label="Aktiv"
                />
              </FormGroup>
            </AppGridField>

            <AppGridField>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={(ev) => setProp('confirmed', ev.target.checked)}
                      checked={construction.confirmed}
                    />
                  }
                  label="Bestätigt"
                />
              </FormGroup>
            </AppGridField>
          </AppGrid>
        </Box>

        <CardActions>
          <Box mt={6} width={'100%'} display="flex" justifyContent="space-between">
            <Button variant="contained" disableElevation onClick={handleSaveRequest}>
              Speichern
            </Button>
            {hideDelete ? null : (
              <Button color="error" onClick={handleDeleteRequest}>
                Löschen
              </Button>
            )}
          </Box>
        </CardActions>
      </CardContent>
    </Card>
  );
}
