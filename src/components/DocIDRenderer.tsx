import { Grid } from '@mui/material';

import { buildDocId } from '../pdf/shared';
import { AppTextField } from './AppTextField';

interface DocIDRendererProps {
  doc: Maybe<AppOffer | AppInvoice>;
  label: string;
}
export const DocIDRenderer = ({ doc, label }: Readonly<DocIDRendererProps>) => {
  if (!doc) {
    return null;
  }
  const docId = buildDocId(doc);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <AppTextField label={label} disabled value={docId} />
    </Grid>
  );
};
