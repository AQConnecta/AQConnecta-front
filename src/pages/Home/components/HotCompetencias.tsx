import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { enqueueSnackbar } from 'notistack';
import CompetencyCard from '../../../layout/components/CompetencyCard';
import { CompetenciaLevel } from '../../../services/endpoints/competencia';
import api from '../../../services/api';

const Container = styled.div`
  min-width: 200px;
`

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  border-radius: 5px;
  background-color: #fff;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 15%),
    0 0 0 rgb(0 0 0 / 20%);
`

function HotCompentencias() {
  const [competenciasLevel, setCompetenciasLevel] = useState<CompetenciaLevel[]>([]);

  useEffect(() => {
    async function getFormacaoAcademica() {
      try {
        const res = await api.competencia.listHotCompetencies();
        if (res.data.data.length === 0) {
          return;
        }
        setCompetenciasLevel(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as competencias mais usadas', { variant: 'error' });
      }
    }

    getFormacaoAcademica();
  }, []);

  return (
    <Container>
      <ArtCard>
        <CompetencyCard competencies={competenciasLevel} />
      </ArtCard>
    </Container>
  )
}

export default HotCompentencias
