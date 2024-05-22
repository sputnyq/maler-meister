import {
  Card,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import React from 'react';

import { ColFlexBox } from '../../../../../components/ColFlexBox';
import { useCurrentOffer } from '../../../../../hooks/useCurrentOffer';
import { calculatePriceSummary, euroValue } from '../../../../../utilities';

interface Props {
  services: OfferService[];
  setServices: (os: OfferService[]) => void;
}

export function AbschlagStep({ services, setServices }: Readonly<Props>) {
  const offer = useCurrentOffer();

  if (!offer) return null;

  const isSelected = (os: OfferService) => {
    return services.some((s) => s.name === os.name && s.description === os.description && s.netto === os.netto);
  };

  const handleToggle = (os: OfferService) => () => {
    const next = services.filter((s) => s.id !== os.id);
    if (isSelected(os)) {
      setServices(next);
    } else {
      setServices([...next, os]);
    }
  };

  const { netto } = calculatePriceSummary(services);

  return (
    <ColFlexBox>
      <Typography variant="h6">Wähle die Abschläge aus welche für die Rechnung verwendet werden sollen</Typography>
      <List dense>
        {(offer.offerServices || []).map((os, index) => {
          const labelId = `checkbox-list-label-${index}`;
          return (
            <ListItem>
              <ListItemButton role={undefined} onClick={handleToggle(os)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isSelected(os)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={os.name}
                  secondary={
                    <>
                      <Typography variant="caption">{os.description}</Typography>
                      <Typography variant="body1" textAlign={'end'} color={'InfoText'}>
                        {euroValue(os.netto)}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" textAlign={'center'}>
            Summe (Netto): {euroValue(netto)}
          </Typography>
        </CardContent>
      </Card>
    </ColFlexBox>
  );
}
