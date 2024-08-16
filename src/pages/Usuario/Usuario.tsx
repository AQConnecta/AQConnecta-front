import { Box } from '@mui/material';
import Header from '../../layout/components/Header';
import MeuEndereco from '../Endereco/Endereco';
import MinhaExperiencia from '../Experiencia/Experiencia';
import MinhaFormacaoAcademica from '../FormacaoAcademica/FormacaoAcademica';

function Usuario() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '32px' }}>
      <Header />
      <Box sx={{ width: '592px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
        <MeuEndereco />
        <MinhaFormacaoAcademica />
        <MinhaExperiencia />
      </Box>
    </Box>
  );
}

export default Usuario;
