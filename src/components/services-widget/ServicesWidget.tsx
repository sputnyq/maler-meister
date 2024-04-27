import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import { Box, Button } from '@mui/material';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../../store';
import { PriceSummary } from '../PriceSummary';
import { ServicesSelection } from './ServicesSelection';
import { ServicesWidgetRow } from './ServicesWidgetRow';

import { arrayMoveImmutable } from 'array-move';

interface Props {
  offerServices?: OfferService[];
  update: (os: OfferService[]) => void;
}

export default function ServicesWidget({ offerServices = [], update }: Readonly<Props>) {
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

  const onDeleteAll = () => {
    if (confirm('Alle Leistungen löschen?')) update([{} as OfferService]);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Price Summary */}
        <Box sx={{ position: 'sticky', top: '48px', zIndex: 100, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <PriceSummary offerServices={offerServices} />
        </Box>

        {/* Services   */}
        {offerServices.map((offerService, index) => (
          <ServicesWidgetRow
            key={index}
            offerService={offerService}
            disableDown={index === offerServices.length - 1}
            disableUp={index === 0}
            onDelete={onDelete(index)}
            moveEntry={moveEntry(index)}
            update={updateOnIndex(index)}
          />
        ))}

        {/* Buttons */}

        <Box display={'flex'} justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="error" endIcon={<DeleteOutlineOutlinedIcon />} onClick={onDeleteAll}>
            Löschen
          </Button>

          <Button
            variant="outlined"
            onClick={() => setOpen(true)}
            disableElevation
            endIcon={<ChecklistRtlOutlinedIcon />}
          >
            Auswählen
          </Button>

          <Button variant="outlined" endIcon={<PlaylistAddOutlinedIcon />} onClick={onAdd}>
            Zeile
          </Button>
        </Box>
      </Box>

      <ServicesSelection onCheck={onCheck} open={open} onClose={() => setOpen(false)} offerServices={offerServices} />
    </>
  );
}
