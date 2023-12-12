import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppDialog } from '../../components/AppDialog';
import { ColFlexBox } from '../../components/ColFlexBox';
import DocumentActions from '../../components/DocumentActions';
import { invoiceById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentInvoice } from '../../hooks/useCurrentInvoice';
import { usePrintInvoice } from '../../hooks/usePrintInvoice';
import { AppDispatch, AppState } from '../../store';
import { createInvoice, updateInvoice } from '../../store/invoiceReducer';
import { genericConverter } from '../../utilities';

export function InvoiceActions() {
  const allPrintSettings = useSelector<AppState, PrintSettingsRoot[] | undefined>((s) => s.prinSettings.all);

  const [printSettingID, setPrintSettingID] = useState<string | undefined>(allPrintSettings?.[0]?.id.toString());
  const [prindDialogOpen, setPrindDialogOpen] = useState(false);

  const invoice = useCurrentInvoice();
  const navigate = useNavigate();

  const printInvoice = usePrintInvoice();

  const dispatch = useDispatch<AppDispatch>();

  const unsavedChanges = useSelector<AppState, boolean>((s) => s.invoice.unsavedChanges);

  const isDraft = useMemo(() => {
    return typeof invoice?.id === 'undefined';
  }, [invoice?.id]);
  const onDelete = useCallback(async () => {
    if (invoice) {
      await appRequest('delete')(invoiceById(invoice.id));
      navigate('invoices');
    }
  }, [navigate, invoice]);

  const onCopy = useCallback(async () => {
    const res = await appRequest('post')(invoiceById(''), { data: { ...invoice, id: undefined } });
    const next = genericConverter<AppOffer>(res.data);
    navigate(`invoices/${next.id}`);
  }, [invoice, navigate]);

  const onSave = useCallback(async () => {
    if (invoice?.id) {
      dispatch(updateInvoice());
    } else {
      await dispatch(
        createInvoice({
          cb: (id: string | number) => {
            navigate(`/invoices/${id}`);
          },
        }),
      );
    }
  }, [invoice, dispatch, navigate]);

  const closeDialog = () => setPrindDialogOpen(false);

  const handlePrintRequest = useCallback(() => {
    if (printSettingID) {
      printInvoice(Number(printSettingID));
      closeDialog();
    }
  }, [printInvoice, printSettingID]);

  const dialogChildren = useMemo(() => {
    const handlePSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrintSettingID((event.target as HTMLInputElement).value);
    };

    if (typeof allPrintSettings === 'undefined' || allPrintSettings.length < 1) {
      return (
        <>
          <Typography>PDF Erzeugung ist nicht möglich.</Typography>
          <Typography>
            {`Erstelle und bearbeite min 1 `}
            <Link to="/options/print-settings">PDF-Einstellung</Link>
          </Typography>
        </>
      );
    } else {
      return (
        <ColFlexBox>
          <FormControl>
            <FormLabel id="print-settings-label">PDF erzeugen für:</FormLabel>
            <RadioGroup aria-labelledby="print-settings-label" value={printSettingID} onChange={handlePSChange}>
              {allPrintSettings.map((ps) => (
                <FormControlLabel key={ps.name} value={ps.id} control={<Radio />} label={ps.name} />
              ))}
            </RadioGroup>
          </FormControl>
        </ColFlexBox>
      );
    }
  }, [allPrintSettings, printSettingID]);

  return (
    <>
      <AppDialog
        title="Rechnung als PDF speichern"
        open={prindDialogOpen}
        onClose={closeDialog}
        onConfirm={handlePrintRequest}
        confirmDisabled={!(allPrintSettings && allPrintSettings?.length > 0)}
      >
        <Card elevation={0}>
          <CardContent>{dialogChildren}</CardContent>
        </Card>
      </AppDialog>
      <DocumentActions
        isDraft={isDraft}
        unsavedChanges={unsavedChanges}
        onDownload={() => setPrindDialogOpen(true)}
        onDelete={onDelete}
        onCopy={onCopy}
        onSave={onSave}
      />
    </>
  );
}
