import { Box } from '@mui/material';
import Header from '../../layout/components/Header';
import MeuEndereco from '../Endereco/Endereco';
import MinhaExperiencia from '../Experiencia/Experiencia';
import MinhaFormacaoAcademica from '../FormacaoAcademica/FormacaoAcademica';
import UploadImagemPerfil from '../perfil/UploadImagemPerfil';
import UploadCurriculo from '../perfil/UploadCurriculo';

function Usuario() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '32px' }}>
      <Header />
      <Box sx={{ width: '592px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
        <UploadImagemPerfil/>
        <MeuEndereco />
        <MinhaFormacaoAcademica />
        <MinhaExperiencia />
        <UploadCurriculo />
      </Box>
    </Box>
  );
}

export default Usuario;
