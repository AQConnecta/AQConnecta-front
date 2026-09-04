import { useParams } from 'react-router-dom'
import { FileText } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import PostForm from './components/PostForm'

function EditarPost() {
  const { id, postId } = useParams()

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader icon={FileText} title="Editar post" />
      {id && <PostForm idProjeto={id} postId={postId} />}
    </div>
  )
}

export default EditarPost
