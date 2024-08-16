import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { FaTrash, FaPencil } from 'react-icons/fa6';
import api from '../../services/api';
import { FormacaoAcademica } from '../../services/endpoints/formacaoAcademica.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import FormacaoAcademicaRegister from './FormacaoAcademicaRegister.tsx';
import Card from '../../components/Card.tsx';

function MinhaFormacaoAcademica() {
  const { user } = useAuth();
  const [formacoesAcademicas, setFormacoesAcademicas] = useState<FormacaoAcademica[]>([]);
  const [shouldReload, setShouldReload] = useState(0);

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

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card>
      <Box
        height="100%"
        width="100%"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <Button variant="contained" onClick={() => setOpen(!open)}>Cadastrar formação academica</Button>

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
              <Box key={index} sx={{ padding: '15px', border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: 'white' }}>
                <Typography variant="h6" color="grey">
                  Formação
                  {' '}
                  {index + 1}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formacaoAcademica.descricao.toUpperCase()}
                  {' '}
                  -
                  {' '}
                  {formacaoAcademica.universidade.nomeInstituicao}
                </Typography>
                <Typography
                  variant="body1"
                  color="grey"
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
                  display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'space-around', gap: '16px',
                }}
                >
                  <Button variant="contained" sx={{ width: '150px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setOpen(!open)}>
                    <FaPencil />
                    Editar
                  </Button>
                  <Button variant="contained" sx={{ width: '150px', height: '50px', backgroundColor: 'tomato', display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:hover': { backgroundColor: 'red' } }} onClick={() => handleDelete(formacaoAcademica.id!)}>
                    <FaTrash />
                    Excluir
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <Typography variant="body1">Sem formações até o momento</Typography>
            </Box>
          )}
        </Box>
        <FormacaoAcademicaRegister isOpen={open} setOpen={setOpen} />
      </Box>
    </Card>

  );
}

export default MinhaFormacaoAcademica;
