import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { FaTrash, FaPencil } from 'react-icons/fa6';
import api from '../../services/api';
import { Experiencia } from '../../services/endpoints/experiencia.ts';
import ExperienciaRegister from './ExperienciaRegister.tsx';
import { Usuario } from '../../services/endpoints/auth.ts';
import Card from '../../components/Card.tsx';
import CustomDialog from '../../components/CustomDialog.tsx';

type ExperienciaProps = {
  user: Usuario;
  isMe: boolean;
};

function MinhaExperiencia(props:ExperienciaProps) {
  const { user, isMe } = props;
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [experienciaToEdit, setExperienciaToEdit] = useState<Experiencia | null>(null);
  const [shouldReload, setShouldReload] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getExperiencia() {
      try {
        const res = await api.experiencia.getExperiencia(user.id);
        setExperiencias(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar experiencia', { variant: 'error' });
      }
    }

    getExperiencia();
  }, [shouldReload]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  function handleClose() {
    setOpen(false);
    reload();
  }

  const formatDate = (dateString: string) => {
    const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  async function handleDelete(idExperiencia: string) {
    try {
      await api.experiencia.deletarExperiencia(idExperiencia);
      enqueueSnackbar('Experiência deletada com sucesso', { variant: 'success' });
      reload();
    } catch (err) {
      enqueueSnackbar('Erro ao deletar experiência', { variant: 'error' });
    }
  }

  async function handleEdit(experiencia: Experiencia) {
    setExperienciaToEdit(experiencia);
    setOpen(true);
  }

  return (
    <Card sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        <Typography sx={{ fontSize: '20px', alignSelf: 'flex-start', padding: '8px', fontWeight: 600 }}>Experiências</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
          }}
        >
          {experiencias && experiencias.length > 0 ? (
            experiencias.map((experiencia, index) => (
              <Box
                key={index}
                sx={{
                  padding: '20px',
                  border: '1px solid #e1e4e8',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {experiencia.titulo.toUpperCase()}
                  {' '}
                  -
                  {experiencia.instituicao}
                </Typography>
                <Typography variant="body2" sx={{ color: '#868e96', marginBottom: '8px' }}>
                  {formatDate(experiencia.dataInicio)}
                  {' '}
                  -
                  {experiencia.atualExperiencia ? 'até o momento' : formatDate(experiencia.dataFim)}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '16px' }}>
                  {experiencia.descricao}
                </Typography>
                {isMe
                  && (
                    <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={() => handleEdit(experiencia)}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '150px',
                          height: '50px',
                        }}
                      >
                        <FaPencil style={{ marginRight: '8px' }} />
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          backgroundColor: 'tomato',
                          width: '150px',
                          height: '50px',
                          color: 'white',
                          '&:hover': { backgroundColor: 'red' },
                        }}
                        onClick={() => handleDelete(experiencia.id!)}
                      >
                        <FaTrash style={{ marginRight: '8px' }} />
                        Excluir
                      </Button>
                    </Box>
                  )}
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: 'grey', textAlign: 'center' }}>
              Sem experiências até o momento
            </Typography>
          )}
        </Box>
        {isMe
          && (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setOpen(!open)}
              >
                Adicionar experiência
              </Button>

              <CustomDialog isOpen={open} onClose={() => setOpen(false)} title={`${experienciaToEdit ? 'Editar' : 'Adicionar'} experiência`}>
                <ExperienciaRegister experienciaEdit={experienciaToEdit!} handleClose={handleClose} />
              </CustomDialog>
            </>
          )}
      </Box>
    </Card>
  );
}

export default MinhaExperiencia;
