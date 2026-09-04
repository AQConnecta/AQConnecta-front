import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import VagaModal from './VagaModal';

type CreateVagaProps = {
  className?: string;
  reloadVagas: () => void;
}

function CreateVaga(props: CreateVagaProps) {
  const { className, reloadVagas } = props;
  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    reloadVagas();
    setIsOpen(false);
  }

  return (
    <Card className={className}>
      <VagaModal isOpen={isOpen} handleClose={() => handleClose()} />
      <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
        <p className="text-base font-semibold text-center">
          Tem algum projeto e precisa se conectar com alguém?
        </p>
        <Button onClick={() => setIsOpen(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Publique uma nova vaga
        </Button>
      </CardContent>
    </Card>
  );
}

export default CreateVaga;
