import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Button } from '@mui/material';
import MobileStepper from '@mui/material/MobileStepper';

import { useState } from 'react';

import { ColFlexBox } from '../../../../components/ColFlexBox';
import { InvoiceTypeSelection } from './aa-dialog-steps/InvoiceTypeSelection';
import { VorauszahlungPercent } from './aa-dialog-steps/VorauszahlungPercent';

export function AADialog() {
  const [activeStep, setActiveStep] = useState(0);

  const [invoiceType, setInvoiceType] = useState<InvoiceType>('VORAUSZAHLUNG');
  const [vorauszahlungPercent, setVorauszahlungPercent] = useState<number>(50);

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

      <MobileStepper
        variant="dots"
        steps={2}
        position="static"
        activeStep={activeStep}
        sx={{ flexGrow: 1, background: 'transparent' }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
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
