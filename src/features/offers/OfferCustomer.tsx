import { Box, Grid } from '@mui/material';

import AppGrid from '../../components/AppGrid';
import OfferField, { OfferFieldProps } from '../../components/aa-shared/OfferField';
import { Wrapper } from '../../components/aa-shared/Wrapper';
import { useCurrentOffer } from '../../hooks/useCurrentOffer';
import ConstructionView from '../time-capture/ConstructionView';

export default function OfferCustomer() {
  const offer = useCurrentOffer();

  return (
    <Box mt={1} display="flex" flexDirection="column" gap={2}>
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
          <Field path="email" type="email" label="E-Mail" />
          <Field path="phone" type="tel" label="Telefon" />
        </AppGrid>
      </Wrapper>
      <Wrapper title="Baustelle">
        <AppGrid>
          <Field path="constructionId" type="number" label="Baustelle ID" />
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
