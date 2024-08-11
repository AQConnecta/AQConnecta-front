import styled from 'styled-components';
import { Container, Typography } from '@mui/material';
import { CompetenciaLevel } from '../../../services/endpoints/competencia';



const CardTitle = styled(Typography)`
  margin-bottom: 16px;
  font-weight: bold;
`;

const CompetencyContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const CompetencyName = styled(Typography)`
  flex: 1;
`;

const LevelIcon = styled.img`
  width: 40px;
  height: 40px;
`;

interface CompetencyCardProps {
    competencies: CompetenciaLevel[];
}

function CompetencyCard({ competencies }: CompetencyCardProps) {
  return (
    <Container sx={{ height: "300px", borderRadius: "8px", overflowY: "scroll", overflowX: "hidden" }}>
      <CardTitle variant="h6">Competências</CardTitle>
      {competencies.map((comp, index) => (
        <CompetencyContainer key={index}>
          <CompetencyName variant="body1">{comp.competencia.descricao}</CompetencyName>
          <LevelIcon src={`/images/level-${comp.level}.svg`} alt={`Nível ${comp.level}`} />
        </CompetencyContainer>
      ))}
    </Container>
  );
}

export default CompetencyCard;
