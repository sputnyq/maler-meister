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
    return services.indexOf(os) > -1;
  };

  const handleToggle = (os: OfferService) => () => {
    const next = [...services];
    if (isSelected(os)) {
      next.splice(next.indexOf(os), 1);
      setServices(next);
    } else {
      setServices([...next, os]);
    }
  };

  const { netto } = calculatePriceSummary(services);

  return (
    <ColFlexBox>
      <Typography variant="h6">
        Wähle die Abschläge aus welche für die Rechnung verwendet werden sollen
      </Typography>
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
