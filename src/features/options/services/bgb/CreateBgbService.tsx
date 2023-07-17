import { Card, CardContent, Grid } from '@mui/material';

import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDialog } from '../../../../components/AppDialog';
import AppGrid from '../../../../components/AppGrid';
import AddFab from '../../../../components/aa-shared/AddFab';
import { AppTextField } from '../../../../components/aa-shared/AppTextField';
import TaxSelector from '../../../../components/aa-shared/TaxSelector';
import { AppDispatch } from '../../../../store';
import { createUpdateBgbService } from '../../../../store/servicesReducer';
import { JobGroupSelect } from './JobGroupSelect';

export function CreateBgbService() {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<BgbService>({ taxRate: 19 } as BgbService);

  const dispatch = useDispatch<AppDispatch>();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const onPropChange = (prop: keyof BgbService) => {
    return function (ev: React.ChangeEvent<HTMLInputElement>) {
      setService((s) => ({ ...s, [prop]: ev.target.value }));
    };
  };

  const onConfirm = async () => {
    await dispatch(createUpdateBgbService(service));
    handleClose();
  };

  return (
    <>
      <AddFab onClick={handleOpen} />
      <AppDialog open={open} onClose={handleClose} onConfirm={onConfirm} title="BGB-Leistung erstellen">
        <Card elevation={0}>
          <CardContent>
            <AppGrid>
              <Grid item xs={12}>
                <JobGroupSelect onChange={onPropChange('jobId')} value={service.jobId} />
              </Grid>
              <Grid item xs={12}>
                <AppTextField onChange={onPropChange('name')} label="Name" value={service.name} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <AppTextField onChange={onPropChange('unit')} label="Einheit" value={service.unit} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <AppTextField
                  onChange={onPropChange('unitPrice')}
                  label="Einzelpreis"
                  value={service.unitPrice}
                ></AppTextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TaxSelector onChange={onPropChange('taxRate')} value={service.taxRate} />
              </Grid>
            </AppGrid>
          </CardContent>
        </Card>
      </AppDialog>
    </>
  );
}
