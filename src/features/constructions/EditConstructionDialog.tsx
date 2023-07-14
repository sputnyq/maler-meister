import { useEffect, useState } from 'react';

import { AppDialog } from '../../components/AppDialog';
import { loadConstructionById } from '../../fetch/api';
import { appRequest } from '../../fetch/fetch-client';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import EditConstructionWidget from './EditConstructionWidget';

interface Props {
  constructionId: string | number | undefined;
  dialogOpen: boolean;
  onClose(): void;
  initStart?: any;
  initEnd?: any;
}

export default function EditConstructionDialog({ constructionId, dialogOpen, onClose, initEnd, initStart }: Props) {
  const user = useCurrentUser();
  const [construction, setConstruction] = useState<Construction | null>(null);

  useEffect(() => {
    if (!constructionId) {
      setConstruction({
        start: initStart,
        end: initEnd,
        active: false,
        tenant: user?.tenant,
        confirmed: false,
      } as Construction);
    } else {
      console.log(constructionId);
      loadConstructionById(constructionId)
        .then((con) => {
          if (con) {
            setConstruction(con);
          }
        })
        .catch(console.log);
    }
  }, [constructionId, initEnd, initStart, user]);

  const handleSaveRequest = () => {
    appRequest(constructionId ? 'put' : 'post')(`constructions/${constructionId || ''}`, {
      data: construction,
    })
      .then(onClose)
      .catch((e) => {
        console.log(e);
        alert('Fehler beim speichern!');
      });
  };

  if (construction) {
    return (
      <AppDialog title="Baustelle bearbeiten" onClose={onClose} open={dialogOpen} onConfirm={handleSaveRequest}>
        <EditConstructionWidget construction={construction} setConstruction={setConstruction} />
      </AppDialog>
    );
  }
  return null;
}
