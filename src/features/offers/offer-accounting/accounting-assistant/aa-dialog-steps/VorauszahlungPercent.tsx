import { Box, Slider, Typography } from '@mui/material';

import { ColFlexBox } from '../../../../../components/ColFlexBox';
import { useCurrentOffer } from '../../../../../hooks/useCurrentOffer';
import { calculatePriceSummary, euroValue } from '../../../../../utilities';

interface Props {
  value: number;
  setValue(value: number): void;
}

export function VorauszahlungPercent({ value, setValue }: Readonly<Props>) {
  const offer = useCurrentOffer();
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const marks = [
    {
      value: 0,
      label: '0 %',
    },
    {
      value: 50,
      label: '50 %',
    },
    {
      value: 100,
      label: '100 %',
    },
  ];

  function valuetext(value: number) {
    return `${value} %`;
  }
  if (!offer) {
    return null;
  }

  const vorauszahlungValue = () => {
    const { netto } = calculatePriceSummary(offer.offerServices);
    return euroValue(netto * (value / 100));
  };

  return (
    <ColFlexBox>
      <Typography id="input-slider" gutterBottom>
        Wieviel Prozent des Angebots geht in die Vorauszahlung?
      </Typography>
      <Box paddingInline={1}>
        <Slider
          step={5}
          min={0}
          max={100}
          getAriaValueText={valuetext}
          value={typeof value === 'number' ? value : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          marks={marks}
        />
      </Box>
      <Typography variant="h4" textAlign={'end'}>
        Vorauszahlung (Netto): {vorauszahlungValue()}
      </Typography>
    </ColFlexBox>
  );
}
