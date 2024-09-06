import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom'; // Importação para acessar parâmetros da URL
import { enqueueSnackbar } from 'notistack';

import Card from '../../components/Card';
import { Vaga } from '../../services/endpoints/vaga';
import { Competencia } from '../../services/endpoints/competencia';
import { UsuarioFilter } from '../../services/endpoints/usuario';
import api from '../../services/api';
import VagaCard from '../../components/VagaCard';
import UsuarioCard from '../../components/UsuarioCard'; // Importe o componente de usuário

function Buscar() {
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get('tipo');
  const filtro = searchParams.get('filtro');
  const idCompetencia = searchParams.get('idCompetencia');
  const iniciante = searchParams.get('iniciante');
  const [vagas, setVagas] = useState<Array<Vaga>>([]);
  const [usuarios, setUsuarios] = useState<Array<UsuarioFilter>>([]);
  const [shouldReload, setShouldReload] = useState(0);

  useEffect(() => {
    if (tipo === 'vagas') {
      getVagas();
    } else if (tipo === 'usuarios') {
      getUsuarios();
    }
  }, [tipo, shouldReload]);

  async function getVagas() {
    try {
      const res = await api.vaga.listAllWithFilters(filtro, idCompetencia, iniciante);
      if (res.data.data.length === 0) {
        return;
      }
      setVagas(res.data.data);
    } catch (err) {
      enqueueSnackbar('Erro ao buscar as vagas', { variant: 'error' });
    }
  }

  async function getUsuarios() {
    try {
      const res = await api.usuario.filtrarUsuarios(filtro);
      console.log(res)
      if (res.data.data.length === 0) {
        return;
      }
      setUsuarios(res.data.data);
    } catch (err) {
      enqueueSnackbar('Erro ao buscar os usuários', { variant: 'error' });
    }
  }

  function reloadData() {
    setShouldReload((prev) => prev + 1);
  }

  return (
    <Box sx={{ maxWidth: '608px', width: '100%', padding: '0px 16px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tipo === 'vagas' && vagas.length ? vagas.map((vaga) => {
          return (
            <VagaCard vaga={vaga} reloadVagas={reloadData} hideButton={false} />
          );
        }) : tipo === 'usuarios' && usuarios.length ? usuarios.map((usuario) => {
          return (
            <UsuarioCard usuario={usuario} />
          );
        })
          : (
            <Card sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h1>{`Nenhum${tipo === 'vagas' ? 'a vaga' : ' usuário'} encontrado(a)`}</h1>
            </Card>
          )}
      </Box>
    </Box>
  );
}

export default Buscar;
