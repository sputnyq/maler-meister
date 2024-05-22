import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Button } from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';

import { useState } from 'react';

import { ColFlexBox } from '../../../../components/ColFlexBox';
import { AbschlagStep } from './aa-dialog-steps/AbschlagStep';
import { CreateInvoiceStep } from './aa-dialog-steps/CreateInvoiceStep';
import { EmptyStep } from './aa-dialog-steps/EmptyStep';
import { InvoiceTypeSelection } from './aa-dialog-steps/InvoiceTypeSelection';
import { SchlussRechnungStep } from './aa-dialog-steps/SchlussRechnungStep';
import { VorauszahlungPercent } from './aa-dialog-steps/VorauszahlungPercent';

export function AADialog() {
  const MAX_STEPS = 3;
  const [activeStep, setActiveStep] = useState(0);

  const [invoiceType, setInvoiceType] = useState<InvoiceType>('VORAUSZAHLUNG');
  const [vorauszahlungPercent, setVorauszahlungPercent] = useState<number>(50);
  const [services, setServices] = useState<OfferService[]>([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <ColFlexBox>
      {activeStep === 0 && <InvoiceTypeSelection invoiceType={invoiceType} onInvoiceTypeChanged={setInvoiceType} />}
      {activeStep === 1 && invoiceType === 'VORAUSZAHLUNG' && (
        <VorauszahlungPercent value={vorauszahlungPercent} setValue={setVorauszahlungPercent} />
      )}
      {activeStep === 1 && invoiceType === 'RECHNUNG' && <EmptyStep />}
      {activeStep === 1 && invoiceType === 'SCHLUSSRECHNUNG' && <SchlussRechnungStep />}
      {activeStep === 1 && invoiceType === 'ABSCHLAGSRECHNUNG' && (
        <AbschlagStep services={services} setServices={setServices} />
      )}

      {activeStep === MAX_STEPS - 1 && <CreateInvoiceStep invoiceType={invoiceType} />}

      <MobileStepper
        variant="dots"
        steps={MAX_STEPS}
        position="static"
        activeStep={activeStep}
        sx={{ flexGrow: 1, background: 'transparent' }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === MAX_STEPS - 1}>
            Weiter
            {<KeyboardArrowRightOutlinedIcon />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {<KeyboardArrowLeftOutlinedIcon />}
            Zurück
          </Button>
        }
      />
    </ColFlexBox>
  );
}
