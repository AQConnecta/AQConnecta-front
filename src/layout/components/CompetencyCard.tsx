import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { CompetenciaLevel } from '../../services/endpoints/competencia';

interface CompetencyCardProps {
  competencies: CompetenciaLevel[] | undefined;
}

function CompetencyCard({ competencies }: CompetencyCardProps) {
  return (
    <Card className="h-[300px]">
      <CardHeader className="pb-2 sticky top-0 bg-card z-10">
        <CardTitle className="text-base">Competências quentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[230px] px-4">
          <div className="space-y-1 pb-4">
            {competencies?.map((comp, index) => (
              <Link
                key={index}
                to={`/buscar?tipo=vagas&idCompetencia=${comp.competencia.id}`}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <img
                  src={`/images/level-${comp.level}.svg`}
                  alt={`Nível ${comp.level}`}
                  className="w-8 h-8"
                />
                <span className="text-sm flex-1 truncate">
                  {comp.competencia.descricao}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default CompetencyCard;
