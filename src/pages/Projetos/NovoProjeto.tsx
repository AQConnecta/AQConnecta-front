import { FolderPlus } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import ProjetoForm from './components/ProjetoForm'

function NovoProjeto() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader icon={FolderPlus} title="Novo projeto" description="Crie um projeto de extensão." />
      <ProjetoForm />
    </div>
  )
}

export default NovoProjeto
