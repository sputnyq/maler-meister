import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DocumentActions from '../../components/aa-shared/DocumentActions';
import { useCurrentOffer } from '../../hooks/useCurrentOffer';
import { AppDispatch, AppState } from '../../store';
import { createOffer, updateOffer } from '../../store/offerReducer';

export default function OfferActions() {
  const unsavedChanges = useSelector<AppState, boolean>((s) => s.offer.unsavedChanges);
  const offer = useCurrentOffer();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const onDelete = () => {
    console.log('');
  };
  const onDownload = () => {
    console.log('');
  };
  const onCopy = () => {
    console.log('');
  };

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

  return (
    <DocumentActions
      unsavedChanges={unsavedChanges}
      onCopy={onCopy}
      onSave={onSave}
      onDelete={onDelete}
      onDownload={onDownload}
    />
  );
}
