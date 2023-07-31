import { FormControl } from '@mui/base';
import { Box, Card, CardContent, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';

import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { AppDialog } from '../../components/AppDialog';
import DocumentActions from '../../components/aa-shared/DocumentActions';
import { offerById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentOffer } from '../../hooks/useCurrentOffer';
import { usePrintOffer } from '../../hooks/usePrintOffer';
import { AppDispatch, AppState } from '../../store';
import { createOffer, updateOffer } from '../../store/offerReducer';
import { genericConverter } from '../../utilities';

export default function OfferActions() {
  const [prindDialogOpen, setPrindDialogOpen] = useState(false);

  const unsavedChanges = useSelector<AppState, boolean>((s) => s.offer.unsavedChanges);
  const allPrintSettings = useSelector<AppState, PrintSettingsRoot[] | undefined>((s) => s.prinSettings.all);
  const [printSettingID, setPrintSettingID] = useState<string | undefined>(allPrintSettings?.[0]?.id.toString());

  const [type, setType] = useState('Angebot');
  const offer = useCurrentOffer();

  const navigate = useNavigate();

  const printOffer = usePrintOffer();

  const dispatch = useDispatch<AppDispatch>();

  const onDelete = useCallback(async () => {
    if (offer) {
      await appRequest('delete')(offerById(offer.id));
      navigate('offers');
    }
  }, [navigate, offer]);

  const onCopy = useCallback(async () => {
    const res = await appRequest('post')(offerById(''), { data: { ...offer, id: undefined } });
    const next = genericConverter<AppOffer>(res.data);
    navigate(`offers/${next.id}`);
  }, [offer, navigate]);

  const onSave = useCallback(async () => {
    if (offer?.id) {
      dispatch(updateOffer());
    } else {
      await dispatch(
        createOffer({
          cb: (id: string | number) => {
            navigate(`/offers/${id}`);
          },
        }),
      );
    }
  }, [offer, dispatch, navigate]);

  const isDraft = useMemo(() => {
    return typeof offer?.id === 'undefined';
  }, [offer?.id]);

  const handlePSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrintSettingID((event.target as HTMLInputElement).value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value);
  };

  const dialogChildren = useMemo(() => {
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
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl>
            <FormLabel id="print-settings-label">PDF erzeugen für:</FormLabel>
            <RadioGroup aria-labelledby="print-settings-label" value={printSettingID} onChange={handlePSChange}>
              {allPrintSettings.map((ps) => (
                <FormControlLabel key={ps.name} value={ps.id} control={<Radio />} label={ps.name} />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel id="art-label">Erzeugen als:</FormLabel>
            <RadioGroup aria-labelledby="art-label" value={type} onChange={handleTypeChange}>
              <FormControlLabel value={'Angebot'} control={<Radio />} label={'Angebot'} />
              <FormControlLabel value={'Kostenvoranschlag'} control={<Radio />} label={'Kostenvoranschlag'} />
            </RadioGroup>
          </FormControl>
        </Box>
      );
    }
  }, [allPrintSettings, type, printSettingID]);
  const closeDialog = () => setPrindDialogOpen(false);

  const handlePrintRequest = useCallback(() => {
    if (printSettingID) {
      printOffer(Number(printSettingID), type);
      closeDialog();
    }
  }, [printOffer, printSettingID, type]);

  return (
    <>
      <AppDialog
        title="Angebot als PDF"
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
        unsavedChanges={unsavedChanges}
        onCopy={onCopy}
        onSave={onSave}
        onDelete={onDelete}
        onDownload={() => setPrindDialogOpen(true)}
        isDraft={isDraft}
      />
    </>
  );
}
