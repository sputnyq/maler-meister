import React from 'react';

import DocumentActions from '../../components/DocumentActions';

export function InvoiceActions() {
  return <DocumentActions isDraft={false} unsavedChanges />;
}
