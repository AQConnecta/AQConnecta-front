import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FormacaoAcademica, Universidade } from '../../services/endpoints/formacaoAcademica.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

function MinhaFormacaoAcademica() {
  const { user } = useAuth();
  const [formacoesAcademicas, setFormacoesAcademicas] = useState<FormacaoAcademica[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function getFormacaoAcademica() {
      try {
        const res = await api.formacaoAcademica.getFormacaoAcademica(user.id);
        console.log(res.data.data)
        setFormacoesAcademicas(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar experiencia', { variant: 'error' });
      }
    }

    getFormacaoAcademica();
  }, [shouldReload]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  const formatDate = (dateString: string) => {
    const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  async function handleDelete(idFormacaoAcademica: string) {
    try {
      await api.formacaoAcademica.deletarFormacaoAcademica(idFormacaoAcademica);
      enqueueSnackbar('Formação Academica deletada com sucesso', { variant: 'success' });
      reload()
    } catch (err) {
      enqueueSnackbar('Erro ao deletar formação', { variant: 'error' });
    }
  }

  return (
    <Box
      height="100%"
      width="100%"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Button variant="contained" onClick={() => navigate('register')}>Cadastrar formação academica</Button>

      <Box
        width="100%"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 1px 2px #0003',
          backgroundColor: 'white',
          maxWidth: '500px',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        {formacoesAcademicas && formacoesAcademicas.length > 0 ? (
          formacoesAcademicas.map((formacaoAcademica, index) => (
            <Box key={index} sx={{ padding: '8px', border: '1px solid #000', borderRadius: '5px' }}>
              <Typography variant="h6">
                Formação {index + 1}
              </Typography>
              <Typography variant="body1">
                {formacaoAcademica.descricao}
                {' '}
                -
                {' '}
                {formacaoAcademica.universidade.nomeInstituicao}
              </Typography>
              <Typography
                variant="body1"
              >
                {formatDate(formacaoAcademica.dataInicio)}
                {' '}
                -
                {' '}
                {formatDate(formacaoAcademica.dataFim)}
                {formacaoAcademica.atualFormacao ? ' - Cursando' : ''}
              </Typography>
              <hr
                style={{
                  color: 'black',
                  backgroundColor: 'red',
                }}
              />
              {/* <Typography variant="body1">{formacaoAcademica.descricao}</Typography> */}
              <Box sx={{
                display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
              }}
              >
                <Button variant="contained" sx={{ width: '100%', height: '50px' }} onClick={() => navigate(`register/${formacaoAcademica.id}`)}>
                  Editar
                </Button>
                <Button variant="contained" sx={{ width: '100%', height: '50px', backgroundColor: 'tomato' }} onClick={() => handleDelete(formacaoAcademica.id!)}>
                  Excluir
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box>
            <Typography variant="body1">Sem formações até o momento</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MinhaFormacaoAcademica;
