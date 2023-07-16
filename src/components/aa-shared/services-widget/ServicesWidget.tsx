import { Box } from '@mui/material';

import { AddButtonWidget } from '../../widgets/AddButtonWidget';
import { PriceSummary } from '../PriceSummary';
import { ServicesWidgetRow } from './ServicesWidgetRow';

import { arrayMoveImmutable } from 'array-move';

interface Props {
  title: string;
  offerServices?: BgbOfferService[];
  update: (os: BgbOfferService[]) => void;
}

export default function ServicesWidget({ offerServices = [], update }: Props) {
  const onAdd = () => {
    update([...offerServices, { taxRate: 19 } as BgbOfferService]);
  };

  const updateOnIndex = (index: number) => {
    return function (offerService: BgbOfferService) {
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

  return (
    <Box mt={1} display="flex" flexDirection={'column'} gap={2}>
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

      <Box display="flex" justifyContent="flex-end">
        <AddButtonWidget onAdd={onAdd} />
      </Box>

      <PriceSummary offerServices={offerServices} />
    </Box>
  );
}
