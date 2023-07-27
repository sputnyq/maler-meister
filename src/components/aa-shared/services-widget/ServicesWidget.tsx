import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid } from '@mui/material';

import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useIsSmall } from '../../../hooks/useIsSmall';
import { AppState } from '../../../store';
import AppGrid from '../../AppGrid';
import { PriceSummary } from '../PriceSummary';
import { ServicesSelection } from './ServicesSelection';
import { ServicesWidgetRow } from './ServicesWidgetRow';

import { arrayMoveImmutable } from 'array-move';

interface Props {
  title: string;
  offerServices?: OfferService[];
  update: (os: OfferService[]) => void;
}

export default function ServicesWidget({ offerServices = [], update }: Props) {
  const allServices = useSelector<AppState, BgbService[]>((s) => s.services.bgbServices || []);
  const [open, setOpen] = useState(false);

  const updateOnIndex = (index: number) => {
    return function (offerService: OfferService) {
      const next = [...offerServices];
      next[index] = offerService;
      update(next);
    };
  };

  const moveEntry = (index: number) => {
    return function (offset: number) {
      const next = arrayMoveImmutable(offerServices, index, index + offset);
      update(next);
    };
  };

  const onDelete = (index: number) => {
    return function () {
      const next = offerServices.filter((_, idx) => {
        return idx !== index;
      });
      update(next);
    };
  };

  const onCheck = (id: number, check: boolean) => {
    if (check) {
      const newService = allServices.find((s) => s.id === id);
      if (newService) {
        update([...offerServices, newService as OfferService]);
      }
    } else {
      update(offerServices.filter((os) => os.id !== id));
    }
  };

  const onAdd = () => {
    update([...offerServices, { taxRate: 19 } as OfferService]);
  };

  const Summary = (
    <Card>
      <CardContent>
        <PriceSummary offerServices={offerServices} />
      </CardContent>
      <CardActions>
        <Button endIcon={<PlaylistAddOutlinedIcon />} onClick={onAdd}>
          neue Zeile
        </Button>

        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          disableElevation
          endIcon={<ChecklistRtlOutlinedIcon />}
        >
          Auswählen
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <>
      <Box mt={1}>
        <Box display="flex" flexDirection="column" gap={1}>
          {offerServices.map((offerService, index) => (
            <ServicesWidgetRow
              index={index}
              key={index}
              offerService={offerService}
              disableDown={index === offerServices.length - 1}
              disableUp={index === 0}
              onDelete={onDelete(index)}
              moveEntry={moveEntry(index)}
              update={updateOnIndex(index)}
            />
          ))}
          {Summary}
        </Box>
      </Box>

      <ServicesSelection onCheck={onCheck} open={open} onClose={() => setOpen(false)} offerServices={offerServices} />
    </>
  );
}
