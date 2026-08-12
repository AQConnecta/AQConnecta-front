import styled from 'styled-components';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CompetenciaLevel } from '../../services/endpoints/competencia';

const CompetencyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px;
`;

const CompetencyName = styled(Typography)`
  flex: 1;
  text-overflow: ellipsis;
`;

const LevelIcon = styled.img`
  width: 32px;
  height: 32px;
  padding: 0px 8px;
`;

interface CompetencyCardProps {
  competencies: CompetenciaLevel[] | undefined;
}

function CompetencyCard({ competencies }: CompetencyCardProps) {
  return (
    <Box className="container" sx={{ height: '300px', borderRadius: '8px', padding: '0px 16px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', scrollbarGutter: 'stable' }}>
      <Box sx={{ padding: '16px', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, whiteSpace: 'nowrap' }}>Competências quentes</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', width: '100%' }}>
        {competencies?.map((comp, index) => (
          <Link to={`/buscar?tipo=vagas&idCompetencia=${comp.competencia.id}`}>
            <CompetencyContainer key={index}>
              <LevelIcon src={`/images/level-${comp.level}.svg`} alt={`Nível ${comp.level}`} />
              <CompetencyName variant="body1">{comp.competencia.descricao}</CompetencyName>
            </CompetencyContainer>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export default CompetencyCard;
