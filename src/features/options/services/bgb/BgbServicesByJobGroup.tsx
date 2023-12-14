import { Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import { ColFlexBox } from '../../../../components/ColFlexBox';
import { AppState } from '../../../../store';
import { BgbServiceEdit } from './BgbServiceEdit';

interface Props {
  jobId: number;
}

export function BgbServicesByJobGroup({ jobId }: Props) {
  const allServices = useSelector<AppState, BgbService[]>((s) => s.services.bgbServices || []);

  const currentServices = allServices.filter((s) => s.jobId === jobId);
  if (currentServices.length < 1) {
    return <Typography variant="subtitle2">Keine Leistungen in dieser Tätigkeitsgruppe.</Typography>;
  }
  return (
    <ColFlexBox>
      {currentServices.map((service) => (
        <BgbServiceEdit service={service} key={service.id} />
      ))}
    </ColFlexBox>
  );
}
