import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loadConstructionById } from '../fetch/api';
import { AppDispatch } from '../store';
import { updateConstruction } from '../store/constructionReducer';

interface Props {
  id: string | number;
}

export default function EditConstructionWidget(props: Props) {
  const [construction, setConstruction] = useState<Construction | null>(null);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const constructionId = props.id;

  useEffect(() => {
    if (constructionId) {
      loadConstructionById(constructionId).then((res) => {
        if (res) {
          setConstruction(res);
        }
      });
    }
  }, [constructionId]);

  const handleDeactivateRequest = useCallback(async () => {
    if (confirm('Möchtest du die Aktivierung der Baustelle wirklich ändern?') && construction) {
      await dispatch(updateConstruction({ ...construction, active: !construction.active }));
      navigate('/constructions');
    }
  }, [dispatch, navigate, construction]);

  if (!construction) {
    return null;
  }

  return (
    <Card>
      <CardHeader title={construction.name} />
      <CardContent>
        <Typography variant="subtitle1">Baustellen-Nummer: {construction.id}.</Typography>
        <Typography variant="subtitle1">Baustelle ist {construction.active ? 'aktiviert' : 'deaktiviert'}.</Typography>
        <CardActions>
          <Button onClick={handleDeactivateRequest}>Aktivierung ändern</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
