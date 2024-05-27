import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Grid, IconButton, Link } from '@mui/material';

import { useMemo } from 'react';

import AppGrid from '../../components/AppGrid';
import { ColFlexBox } from '../../components/ColFlexBox';
import { Wrapper } from '../../components/Wrapper';
import { InvoiceTypeArray } from '../../constants';
import { useCurrentInvoice } from '../../hooks/useCurrentInvoice';
import ConstructionButton from '../constructions/ConstructionButton';
import ConstructionView from '../time-capture/ConstructionView';
import InvoiceField, { InvoiceFieldProps } from './InvoiceField';

export function InvoiceCustomer() {
  const invoice = useCurrentInvoice();

  const emailHref = useMemo(() => {
    const body = [
      'Sehr geehrte Damen und Herren,',
      'im Anhang befindet sich unsere Leistungsbeschreibung.',
    ].join('%0D');

    const href = `mailto:${invoice?.email}?subject=Leistungsbeschreibung&body=${body}`;

    return href;
  }, [invoice?.email]);

  const waHref = useMemo(() => {
    return `https://wa.me/${invoice?.phone}`;
  }, [invoice?.phone]);

  return (
    <ColFlexBox>
      <Wrapper title="Allgemeine Informationen">
        <AppGrid>
          <Field
            path="invoiceType"
            label="Rechnungstyp"
            select
            selectOptions={InvoiceTypeArray}
          ></Field>
          <Field path="isPaid" as="checkbox" label="Rechnung bezahlt?"></Field>
        </AppGrid>
      </Wrapper>
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
          <Field
            path="constructionId"
            type="number"
            label="Baustellen-ID"
            InputProps={{
              endAdornment: (
                <ConstructionButton color="primary" constructionId={invoice?.constructionId} />
              ),
            }}
          />
        </AppGrid>
        <ConstructionView constructionId={invoice?.constructionId} />
      </Wrapper>

      <Wrapper title="Text">
        <AppGrid>
          <Grid item xs={12}>
            <InvoiceField path="text" multiline />
          </Grid>
        </AppGrid>
      </Wrapper>
    </ColFlexBox>
  );
}

function Field(props: Readonly<InvoiceFieldProps>) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <InvoiceField {...props} />
    </Grid>
  );
}
