import { useParams } from 'react-router-dom'
import { FileText } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import PostForm from './components/PostForm'

function NovoPost() {
  const { id } = useParams()

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader icon={FileText} title="Novo post" />
      {id && <PostForm idProjeto={id} />}
    </div>
  )
}

export default NovoPost
