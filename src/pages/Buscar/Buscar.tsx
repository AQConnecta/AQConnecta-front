import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Vaga } from '../../services/endpoints/vaga';
import { UsuarioFilter } from '../../services/endpoints/usuario';
import api from '../../services/api';
import VagaCard from '../../components/VagaCard';
import UsuarioCard from '../../components/UsuarioCard';
import { handleApiError } from '../../lib/errors';

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
  }, [tipo, shouldReload, filtro, idCompetencia, iniciante]);

  async function getVagas() {
    try {
      const res = await api.vaga.listAllWithFilters(filtro, idCompetencia, iniciante);
      if (res.data.data.length === 0) {
        setVagas([]);
        return;
      }
      setVagas(res.data.data);
    } catch (err) {
      handleApiError(err, 'Erro ao buscar as vagas');
    }
  }

  async function getUsuarios() {
    try {
      const res = await api.usuario.filtrarUsuarios(filtro);
      if (res.data.data.length === 0) {
        setUsuarios([]);
        return;
      }
      setUsuarios(res.data.data);
    } catch (err) {
      handleApiError(err, 'Erro ao buscar os usuários');
    }
  }

  function reloadData() {
    setShouldReload((prev) => prev + 1);
  }

  return (
    <div className="max-w-[608px] w-full px-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Resultados da busca
      </h1>
      <div className="flex flex-col gap-4">
        {tipo === 'vagas' && vagas.length ? (
          vagas.map((vaga) => (
            <VagaCard key={vaga.id} vaga={vaga} reloadVagas={reloadData} hideButton={false} />
          ))
        ) : tipo === 'usuarios' && usuarios.length ? (
          usuarios.map((usuario) => (
            <UsuarioCard key={usuario.id} usuario={usuario} />
          ))
        ) : (
          <Card className="w-full">
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground text-lg">
                {tipo === 'vagas' ? 'Nenhuma vaga encontrada' : 'Nenhum usuário encontrado'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Buscar;
