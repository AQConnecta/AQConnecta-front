import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import Card from '../../../components/Card';
import VagaModal from './VagaModal';

type CreateVagaProps = {
  sx?: object
  reloadVagas: () => void
}

function CreateVaga(props: CreateVagaProps) {
  const { sx, reloadVagas } = props;
  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    reloadVagas();
    setIsOpen(false);
  }

  return (
    <Card sx={[{ width: '100%' }, sx]}>
      <VagaModal isOpen={isOpen} handleClose={handleClose} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="caption" sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 600, textAlign: 'center' }}>
          Tem algum projeto e precisa se conectar com alguém?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '100%', height: { xs: 40, sm: 44 } }}
          onClick={() => setIsOpen(true)}
        >
          Publique uma nova vaga
        </Button>
      </Box>
    </Card>
  );
}

export default CreateVaga;
