import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DocumentActions from '../../components/aa-shared/DocumentActions';
import { offerById } from '../../fetch/endpoints';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentOffer } from '../../hooks/useCurrentOffer';
import { usePrintOffer } from '../../hooks/usePrintOffer';
import { AppDispatch, AppState } from '../../store';
import { createOffer, updateOffer } from '../../store/offerReducer';
import { genericConverter } from '../../utilities';

export default function OfferActions() {
  const unsavedChanges = useSelector<AppState, boolean>((s) => s.offer.unsavedChanges);
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

  const onDownload = () => {
    printOffer();
  };

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

  return (
    <DocumentActions
      unsavedChanges={unsavedChanges}
      onCopy={onCopy}
      onSave={onSave}
      onDelete={onDelete}
      onDownload={onDownload}
      isDraft={isDraft}
    />
  );
}
