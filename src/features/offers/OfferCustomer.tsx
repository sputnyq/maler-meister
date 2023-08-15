import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Grid, IconButton, Link } from '@mui/material';

import { useMemo } from 'react';

import AppGrid from '../../components/AppGrid';
import { Wrapper } from '../../components/Wrapper';
import { useCurrentOffer } from '../../hooks/useCurrentOffer';
import ConstructionView from '../time-capture/ConstructionView';
import OfferField, { OfferFieldProps } from './OfferField';

export default function OfferCustomer() {
  const offer = useCurrentOffer();

  const emailHref = useMemo(() => {
    const body = ['Sehr geehrte Damen und Herren,', 'im Anhang befindet sich unsere Leistungsbeschreibung.'].join(
      '%0D',
    );

    const href = `mailto:${offer?.email}?subject=Leistungsbeschreibung&body=${body}`;

    return href;
  }, [offer?.email]);

  const waHref = useMemo(() => {
    return `https://wa.me/${offer?.phone}`;
  }, [offer?.phone]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Wrapper title="Kunde">
        <AppGrid>
          <Field path="company" label="Firmenname" />
        </AppGrid>
        <AppGrid>
          <Field path="salutation" label="Anrede" select selectOptions={['Herr', 'Frau', ' ']} />
          <Field path="firstName" label="Vorname" />
          <Field path="lastName" label="Nachname" />
        </AppGrid>
      </Wrapper>

      <Wrapper title="Adresse">
        <AppGrid>
          <Field path="street" label="Straße" />
          <Field path="number" label="Hausnummer" />
        </AppGrid>
        <AppGrid>
          <Field path="zip" type="number" label="PLZ" />
          <Field path="city" label="Ort" />
        </AppGrid>
      </Wrapper>

      <Wrapper title="Kontakt">
        <AppGrid>
          <Field
            path="email"
            type="email"
            label="E-Mail"
            InputProps={{
              endAdornment: (
                <Link href={emailHref}>
                  <IconButton color="primary">
                    <EmailOutlinedIcon />
                  </IconButton>
                </Link>
              ),
            }}
          />
          <Field
            path="phone"
            type="tel"
            label="Telefon"
            placeholder="49176"
            InputProps={{
              startAdornment: '+',
              endAdornment: (
                <Link href={waHref} target="_blank">
                  <IconButton color="primary">
                    <WhatsAppIcon />
                  </IconButton>
                </Link>
              ),
            }}
          />
        </AppGrid>
      </Wrapper>
      <Wrapper title="Baustelle">
        <AppGrid>
          <Field path="constructionId" type="number" label="Baustellen-ID" />
        </AppGrid>
        <ConstructionView constructionId={offer?.constructionId} />
      </Wrapper>
    </Box>
  );
}

function Field(props: OfferFieldProps) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <OfferField {...props} />
    </Grid>
  );
}
