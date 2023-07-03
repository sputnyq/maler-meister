import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../store';
import DocumentActions from './aa-shared/DocumentActions';

export default function OfferActions() {
  const unsavedChanges = useSelector<AppState, boolean>((s) => s.offer.unsavedChanges);

  const onDelete = () => {
    console.log('');
  };
  const onDownload = () => {
    console.log('');
  };
  const onCopy = () => {
    console.log('');
  };
  const onSave = () => {
    console.log('');
  };

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
