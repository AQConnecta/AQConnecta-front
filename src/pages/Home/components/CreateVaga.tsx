import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import Card from '../../../components/Card';
import VagaModal from './VagaModal';

type CreateVagaProps = {
  sx?: object
}

function CreateVaga(props: CreateVagaProps) {
  const { sx } = props
  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Card sx={[{ width: '100%' }, sx]}>
      <VagaModal isOpen={isOpen} handleClose={() => handleClose()} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: '16px', fontWeight: 600 }}>Tem algum projeto e precisa se conectar com alguém?</Typography>
        <Button variant="contained" color="primary" sx={{ width: '100%', height: '30px' }} onClick={() => setIsOpen(true)}> Publique uma nova vaga </Button>
      </Box>
    </Card>
  );
}

export default CreateVaga;
