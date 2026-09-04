import { useParams } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import ProjetoForm from './components/ProjetoForm'

function EditarProjeto() {
  const { id } = useParams()

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader icon={Pencil} title="Editar projeto" description="Atualize as informações do projeto." />
      <ProjetoForm projetoId={id} />
    </div>
  )
}

export default EditarProjeto
