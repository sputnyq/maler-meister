import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Autocomplete, Box, Card, CardContent, Grid, IconButton } from '@mui/material';

import { useSelector } from 'react-redux';

import { AppState } from '../../../store';
import { DeleteIconButton } from '../../DeleteIconButton';
import { AppTextField } from '../AppTextField';
import TaxSelector from '../TaxSelector';

import { cloneDeep } from 'lodash';

interface Props {
  offerService: BgbOfferService;
  update: (next: BgbOfferService) => void;
  disableUp: boolean;
  disableDown: boolean;
  onDelete: () => void;
  moveEntry: (offset: number) => void;
}

export function ServicesWidgetRow({ offerService, disableDown, disableUp, update, moveEntry, onDelete }: Props) {
  const bgbServices = useSelector<AppState, BgbService[]>((s) => s.services.bgbServices || []);

  const findService = (label: string) => {
    return bgbServices.find(({ name }) => name === label);
  };

  const onChange = (prop: keyof BgbOfferService, value: any) => {
    const next = cloneDeep(offerService);
    //@ts-ignore
    next[prop] = value;
    if (next.quantity && next.unitPrice) {
      next.netto = Number(next.quantity * next.unitPrice);
    }
    if (next.taxRate) {
      next.taxValue = (Number(next.netto || 0) / 100) * next.taxRate;
      next.brutto = Number(next.netto || 0) + Number(next.taxValue || 0);
    }

    update(next);
  };

  const handleChange = (prop: keyof BgbOfferService) => {
    return function (ev: React.ChangeEvent) {
      //@ts-ignore
      onChange(prop, ev.target.value);
    };
  };

  const onServiceSelect = (service: BgbService) => {
    update({
      ...offerService,
      name: service.name,
      taxRate: service.taxRate,
      unit: service.unit,
      unitPrice: service.unitPrice,
    });
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container columnSpacing={1} rowSpacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={bgbServices}
              getOptionLabel={(opt) => {
                if (typeof opt === 'string') {
                  return opt;
                }
                return opt.name;
              }}
              value={offerService.name || ''}
              inputValue={offerService.name || ''}
              onInputChange={(ev, newValue) => {
                const service = findService(newValue);
                if (service) {
                  onServiceSelect(service);
                } else {
                  onChange('name', newValue);
                }
              }}
              renderInput={(params) => (
                <AppTextField
                  {...params}
                  size="small"
                  inputProps={{
                    'data-hj-allow': '',
                    ...params?.inputProps,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={4} sm={3} lg={1}>
            <AppTextField
              label="Menge"
              type="number"
              value={offerService.quantity}
              onChange={handleChange('quantity')}
            />
          </Grid>
          <Grid item xs={4} sm={3} lg={1}>
            <AppTextField
              label="EPR"
              type="number"
              value={offerService.unitPrice}
              onChange={handleChange('unitPrice')}
              InputProps={{ endAdornment: '€' }}
            />
          </Grid>
          <Grid item xs={4} sm={3} lg={1}>
            <AppTextField
              label="Netto"
              type="number"
              value={offerService.netto}
              onChange={handleChange('netto')}
              InputProps={{ endAdornment: '€' }}
            />
          </Grid>
          <Grid item xs={6} sm={3} lg={1}>
            <TaxSelector value={offerService.taxRate} onChange={handleChange('taxRate')} />
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Box>
              <IconButton onClick={() => moveEntry(1)} disabled={disableDown}>
                <KeyboardArrowDownIcon />
              </IconButton>

              <IconButton onClick={() => moveEntry(-1)} disabled={disableUp}>
                <KeyboardArrowUpIcon />
              </IconButton>

              <DeleteIconButton onClick={onDelete} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
