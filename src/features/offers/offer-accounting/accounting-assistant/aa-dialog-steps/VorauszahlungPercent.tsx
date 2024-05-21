import { Grid, Slider, Typography } from '@mui/material';

import AppGrid from '../../../../../components/AppGrid';
import { ColFlexBox } from '../../../../../components/ColFlexBox';

interface Props {
  value: number;
  setValue(value: number): void;
}

export function VorauszahlungPercent({ value, setValue }: Readonly<Props>) {
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
    return `${value}°C`;
  }

  return (
    <ColFlexBox>
      <Typography id="input-slider" gutterBottom>
        Wieviel Prozent des Angebots geht in die Vorauszahlung?
      </Typography>
      <AppGrid>
        <Grid item xs>
          <Slider
            step={10}
            min={0}
            max={100}
            getAriaValueText={valuetext}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Grid>
      </AppGrid>
    </ColFlexBox>
  );
}
