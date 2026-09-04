import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import HotCompetencias from '../../pages/Home/components/HotCompetencias';

function Left() {
  const [iniciante, setIniciante] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (checked: boolean) => {
    setIniciante(checked);
    navigate(`/buscar?tipo=vagas&iniciante=${checked}`);
  };

  return (
    <div className="space-y-4">
      <HotCompetencias />
      
      <div className="flex items-center space-x-2 p-4 bg-card rounded-lg border">
        <Checkbox 
          id="iniciante"
          checked={iniciante} 
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="iniciante" className="text-sm cursor-pointer">
          Mostrar apenas vagas para iniciantes
        </Label>
      </div>
    </div>
  );
}

export default Left;
