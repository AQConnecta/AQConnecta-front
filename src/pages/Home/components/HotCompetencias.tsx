import { useEffect, useState } from 'react';
import CompetencyCard from '../../../layout/components/CompetencyCard';
import { CompetenciaLevel } from '../../../services/endpoints/competencia';
import api from '../../../services/api';
import { handleApiError } from '../../../lib/errors';

function HotCompetencias() {
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
        handleApiError(err, 'Erro ao buscar as competencias mais usadas');
      }
    }

    getFormacaoAcademica();
  }, []);

  return (
    <div className="min-w-[200px]">
      <CompetencyCard competencies={competenciasLevel} />
    </div>
  );
}

export default HotCompetencias;
