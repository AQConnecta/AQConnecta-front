import { Box, Button, Typography, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import api from '../../services/api';
import { Competencia } from '../../services/endpoints/competencia.ts';
import RelacionarUsuarioCompetencias from './RelacionarUsuarioCompetencias.tsx';
import { Usuario } from '../../services/endpoints/auth.ts';
import Card from '../../components/Card.tsx';
import CustomDialog from '../../components/CustomDialog.tsx';

type CompetenciaProps = {
  user: Usuario;
};

function MinhaCompetencia(props: CompetenciaProps) {
  const { user } = props;
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [selectedCompetencias, setSelectedCompetencias] = useState<string[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getCompetencia() {
      try {
        const res = await api.competencia.listByUserId(user.id);
        setCompetencias(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar competencias', { variant: 'error' });
      }
    }

    getCompetencia();
  }, [shouldReload]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  const handleSelect = (id: string) => {
    setSelectedCompetencias((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((competenciaId) => competenciaId !== id)
        : [...prevSelected, id]
    );
  };

  async function handleUnlink() {
    try {
      // I hate Typescript
      const competenciasEnviar = { 
        competencias: selectedCompetencias.map(competencia => ({ id: competencia }))
      }
      await api.competencia.removeCompetenciaFromMe(competenciasEnviar)
      enqueueSnackbar('Competências desvinculadas com sucesso', {
        variant: 'success',
      })
      setSelectedCompetencias([])
      reload()
    } catch (error) {
      enqueueSnackbar('Erro ao desvincular competências', { variant: 'error' })
    }
  }

  return (
    <Card sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
          Competências
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            // Recomendo adicionar essas duas linhas em todos os componentes da tela de usuário
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {competencias && competencias.length > 0 ? (
            competencias.map((competencia, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  border: '1px solid #e1e4e8',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {competencia.descricao}
                </Typography>
                <Checkbox
                  checked={selectedCompetencias.includes(competencia.id)}
                  onChange={() => handleSelect(competencia.id)}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: 'grey', textAlign: 'center' }}>
              Sem competências adicionadas
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: '8px', marginTop: '16px', width: '100%' }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpen(!open)}
            sx={{ flexGrow: 1 }}
          >
            Adicionar competência
          </Button>
          {selectedCompetencias.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUnlink}
              sx={{ flexGrow: 1 }}
            >
              Remover Selecionadas
            </Button>
          )}
        </Box>
        <CustomDialog
      isOpen={open}
      onClose={() => setOpen(false)}
      title={`Adicionar competência`}
    >
        <RelacionarUsuarioCompetencias 
                    isOpen={open} 
                    handleClose={() => 
                    setOpen(false)} 
                    user={user} 
                    onCompetenciasUpdated={reload}/>
        </CustomDialog>
      </Box>
    </Card>

  );
}

export default MinhaCompetencia;
