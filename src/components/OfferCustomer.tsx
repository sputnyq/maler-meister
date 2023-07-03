import { Box, Grid } from "@mui/material";
import OfferField, { OfferFieldProps } from "./aa-shared/OfferField";
import { Wrapper } from "./aa-shared/Wrapper";

export default function OfferCustomer() {
  return (
    <Box mt={1} display="flex" flexDirection="column" gap={2}>
      <Wrapper title="Name">
        <Field
          path="salutation"
          label="Anrede"
          select
          selectOptions={["Herr", "Frau", " "]}
        />
        <Field path="firstName" label="Vorname" />
        <Field path="lastname" label="Nachname" />
        <Field path="company" label="Frmenname" />
      </Wrapper>

      <Wrapper title="Adresse">
        <Field path="street" label="Straße" />
        <Field path="number" label="Hausnummer" />
        <Field path="zip" type="number" label="PLZ" />
        <Field path="city" label="Ort" />
      </Wrapper>

      <Wrapper title="Kontakt">
        <Field path="email" type="email" label="E-Mail" />
        <Field path="tel" type="tel" label="Telefon" />
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
