import { Box, Tab, Tabs } from '@mui/material';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TabPanel } from '../../components/TabPanel';
import ServicesWidget from '../../components/services-widget/ServicesWidget';
import { useCurrentInvoice } from '../../hooks/useCurrentInvoice';
import { useLoadInvoice } from '../../hooks/useLoadInvoice';
import { AppDispatch } from '../../store';
import { setInvoiceProp } from '../../store/invoiceReducer';
import { InvoiceCustomer } from './InvoiceCustomer';

export default function OfferEdit() {
  useLoadInvoice();

  const [value, setValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const currentInvoice = useCurrentInvoice();

  const updateInvoiceServices = useCallback(
    (offerServices: OfferService[]) => {
      dispatch(setInvoiceProp({ path: ['offerServices'], value: offerServices }));
    },
    [dispatch],
  );

  if (!currentInvoice) {
    return null;
  }

  const services = currentInvoice?.offerServices;

  return (
    <>
      <Tabs
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <Tab label="Kunde" />
        <Tab label="Leistungen" />
      </Tabs>
      <Box mt={1}>
        <TabPanel index={0} value={value}>
          <InvoiceCustomer key={currentInvoice.id} />
        </TabPanel>
        <TabPanel index={1} value={value}>
          <ServicesWidget
            key={currentInvoice.id}
            offerServices={services ?? undefined}
            update={updateInvoiceServices}
          />
        </TabPanel>
      </Box>
    </>
  );
}
