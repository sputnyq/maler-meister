import { Box, Tab, Tabs } from '@mui/material';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TabPanel } from '../../components/TabPanel';
import ServicesWidget from '../../components/services-widget/ServicesWidget';
import { useCurrentOffer } from '../../hooks/useCurrentOffer';
import { useLoadOffer } from '../../hooks/useLoadOffer';
import { AppDispatch } from '../../store';
import { setOfferProp } from '../../store/offerReducer';
import OfferCustomer from './OfferCustomer';
import { OfferAccounting } from './offer-accounting';

export default function OfferEdit() {
  useLoadOffer();

  const [value, setValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const currentOffer = useCurrentOffer();

  const updateOfferServices = useCallback(
    (offerServices: OfferService[]) => {
      dispatch(setOfferProp({ path: ['offerServices'], value: offerServices }));
    },
    [dispatch],
  );

  if (!currentOffer) {
    return null;
  }

  const offerServices = currentOffer?.offerServices;

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
        <Tab label="Buchhaltung" />
      </Tabs>
      <Box mt={1}>
        <TabPanel index={0} value={value}>
          <OfferCustomer key={currentOffer.id} />
        </TabPanel>
        <TabPanel index={1} value={value}>
          <ServicesWidget
            key={currentOffer.id}
            offerServices={offerServices !== null ? offerServices : undefined}
            update={updateOfferServices}
          />
        </TabPanel>
        <TabPanel index={2} value={value}>
          <OfferAccounting key={currentOffer.id} />
        </TabPanel>
      </Box>
    </>
  );
}
