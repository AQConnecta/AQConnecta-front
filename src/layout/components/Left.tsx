import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HotCompentencias from '../../pages/Home/components/HotCompetencias';

function Left() {
  const [iniciante, setIniciante] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    setIniciante(isChecked);
    navigate(`/buscar?tipo=vagas&iniciante=${isChecked}`);
  };

  return (
    <Box>
      <HotCompentencias />
      
      <FormControlLabel
        control={<Checkbox checked={iniciante} onChange={handleCheckboxChange} />}
        label="Mostrar apenas vagas para iniciantes"
      />
    </Box>
  );
}

export default Left;
