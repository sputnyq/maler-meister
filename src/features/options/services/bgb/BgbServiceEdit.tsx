import { Box, Card, CircularProgress, Grid, useTheme } from '@mui/material';

import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import AppGrid from '../../../../components/AppGrid';
import { AppTextField } from '../../../../components/AppTextField';
import { DeleteIconButton } from '../../../../components/DeleteIconButton';
import TaxSelector from '../../../../components/TaxSelector';
import { AppDispatch } from '../../../../store';
import { createUpdateBgbService, deleteBgbService } from '../../../../store/servicesReducer';

interface Props {
  service: BgbService;
}

export function BgbServiceEdit(props: Props) {
  const [service, setService] = useState<BgbService>(props.service);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const dispatch = useDispatch<AppDispatch>();

  const onPropChange = (prop: keyof BgbService) => {
    return function (ev: React.ChangeEvent<HTMLInputElement>) {
      setService((s) => ({ ...s, [prop]: ev.target.value }));
    };
  };

  const onBlur = async () => {
    setLoading(true);
    await dispatch(createUpdateBgbService(service));
    setLoading(false);
  };

  const handleDelete = useCallback(() => {
    if (confirm('Leistung wirklich löschen?')) {
      dispatch(deleteBgbService(service.id));
    }
  }, [service.id, dispatch]);

  return (
    <Card sx={{ p: 1, background: theme.palette.background.default }} elevation={0}>
      <AppGrid>
        <Grid item xs={12}>
          <AppTextField onBlur={onBlur} onChange={onPropChange('name')} label="Name" value={service.name} />
        </Grid>
        <Grid item xs={12}>
          <AppTextField
            label="Beschreibung"
            multiline
            minRows={1}
            maxRows={4}
            onBlur={onBlur}
            onChange={onPropChange('description')}
            value={service.description}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <AppTextField onBlur={onBlur} onChange={onPropChange('unit')} label="Einheit" value={service.unit} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <AppTextField
            onBlur={onBlur}
            onChange={onPropChange('unitPrice')}
            label="Einzelpreis"
            value={service.unitPrice}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TaxSelector onBlur={onBlur} onChange={onPropChange('taxRate')} value={service.taxRate} />
        </Grid>

        <Grid item xs={6} sm={3}>
          <Box display="flex" justifyContent="space-between" maxHeight={'40px'}>
            <Box>
              <DeleteIconButton onClick={handleDelete} />
            </Box>
            <Box>{loading && <CircularProgress sx={{ height: 30, width: 30 }} variant="indeterminate" />}</Box>
          </Box>
        </Grid>
      </AppGrid>
    </Card>
  );
}
