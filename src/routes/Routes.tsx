import { lazy, Suspense, ComponentType } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingState'
import ErrorBoundary from '../components/ErrorBoundary'
import ProtectedRoute from './ProtectedRoute'

// Layouts
import HomeLayout from '../layout/HomeLayout'
import OnlyHeaderLayout from '../layout/OnlyHeaderLayout'

/**
 * Wrapper de React.lazy que recupera de "Failed to fetch dynamically imported module".
 * Esse erro acontece quando o usuário está com o HTML antigo em cache e o build novo
 * mudou os hashes dos chunks. Em vez de quebrar a tela, recarregamos uma única vez.
 */
function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    const RELOAD_KEY = 'aq:chunk-reload-attempted'
    try {
      return await factory()
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      const isChunkError =
        message.includes('Failed to fetch dynamically imported module') ||
        message.includes('Importing a module script failed') ||
        message.includes('error loading dynamically imported module')

      if (isChunkError && !sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1')
        window.location.reload()
        // devolve um componente vazio enquanto o reload acontece
        return { default: (() => null) as unknown as T }
      }
      throw err
    } finally {
      // limpa a flag em casos de sucesso após reload
      if (sessionStorage.getItem(RELOAD_KEY)) {
        setTimeout(() => sessionStorage.removeItem(RELOAD_KEY), 5000)
      }
    }
  })
}

// Lazy-loaded pages
const Login = lazyWithRetry(() => import('../pages/Login/Login'))
const Register = lazyWithRetry(() => import('../pages/Register/Register'))
const ForgotPassword = lazyWithRetry(() => import('../pages/ForgotPassword/ForgotPassword'))
const RedefinirSenha = lazyWithRetry(() => import('../pages/RedefinirSenha/RedefinirSenha'))
const Home = lazyWithRetry(() => import('../pages/Home/Home'))
const Usuario = lazyWithRetry(() => import('../pages/Usuario/Usuario'))
const MinhasVagas = lazyWithRetry(() => import('../pages/MinhasVagas/MinhasVagas'))
const MinhasCandidaturas = lazyWithRetry(() => import('../pages/MinhasCandidaturas/MinhasCandidaturas'))
const Admin = lazyWithRetry(() => import('../pages/Admin/Admin'))
const Denuncias = lazyWithRetry(() => import('../pages/Admin/Denuncias'))
const AprovarCompetencias = lazyWithRetry(() => import('../pages/Admin/AprovarCompetencias'))
const Buscar = lazyWithRetry(() => import('../pages/Buscar/Buscar'))
const ListCompetencia = lazyWithRetry(() => import('../pages/Competencia/ListaCompetencias'))
const ListaProjetos = lazyWithRetry(() => import('../pages/Projetos/ListaProjetos'))
const NovoProjeto = lazyWithRetry(() => import('../pages/Projetos/NovoProjeto'))
const ProjetoDetalhe = lazyWithRetry(() => import('../pages/Projetos/Projeto'))
const EditarProjeto = lazyWithRetry(() => import('../pages/Projetos/EditarProjeto'))
const GerenciarMembros = lazyWithRetry(() => import('../pages/Projetos/GerenciarMembros'))
const MeusConvites = lazyWithRetry(() => import('../pages/Projetos/MeusConvites'))
const NovoPost = lazyWithRetry(() => import('../pages/Projetos/NovoPost'))
const PostDetalhe = lazyWithRetry(() => import('../pages/Projetos/PostDetalhe'))
const EditarPost = lazyWithRetry(() => import('../pages/Projetos/EditarPost'))
const ProjetosSeguidos = lazyWithRetry(() => import('../pages/Projetos/ProjetosSeguidos'))
const ErrorPage = lazyWithRetry(() => import('../pages/Error/Error'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Carregando..." />}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </Suspense>
  )
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="register" element={<SuspenseWrapper><Register /></SuspenseWrapper>} />
          <Route path="login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
          <Route path="forgot-password" element={<SuspenseWrapper><ForgotPassword /></SuspenseWrapper>} />
          <Route path="redefinir-senha" element={<SuspenseWrapper><RedefinirSenha /></SuspenseWrapper>} />

          {/* Protected routes with OnlyHeaderLayout */}
          <Route
            path="competencias"
            element={(
              <ProtectedRoute>
                <SuspenseWrapper><ListCompetencia /></SuspenseWrapper>
              </ProtectedRoute>
            )}
          />

          <Route path="usuario" element={<OnlyHeaderLayout />}>
            <Route
              index
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><Usuario /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path=":user-url"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><Usuario /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
          </Route>

          <Route path="minhas-vagas" element={<OnlyHeaderLayout />}>
            <Route
              index
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><MinhasVagas /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
          </Route>

          <Route path="minhas-candidaturas" element={<OnlyHeaderLayout />}>
            <Route
              index
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><MinhasCandidaturas /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
          </Route>

          <Route element={<OnlyHeaderLayout />}>
            <Route
              path="admin"
              element={(
                <ProtectedRoute adminRoute>
                  <SuspenseWrapper><Admin /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path="admin/denuncias"
              element={(
                <ProtectedRoute adminRoute>
                  <SuspenseWrapper><Denuncias /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path="admin/competencias"
              element={(
                <ProtectedRoute adminRoute>
                  <SuspenseWrapper><AprovarCompetencias /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
          </Route>

          <Route path="buscar" element={<OnlyHeaderLayout />}>
            <Route
              index
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><Buscar /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
          </Route>

          <Route path="projetos" element={<OnlyHeaderLayout />}>
            <Route
              index
              element={<SuspenseWrapper><ListaProjetos /></SuspenseWrapper>}
            />
            <Route
              path="novo"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><NovoProjeto /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path="convites"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><MeusConvites /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path="seguidos"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><ProjetosSeguidos /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path=":id"
              element={<SuspenseWrapper><ProjetoDetalhe /></SuspenseWrapper>}
            />
            <Route
              path=":id/editar"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><EditarProjeto /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path=":id/membros"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><GerenciarMembros /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path=":id/posts/novo"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><NovoPost /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
            <Route
              path=":id/posts/:postId"
              element={<SuspenseWrapper><PostDetalhe /></SuspenseWrapper>}
            />
            <Route
              path=":id/posts/:postId/editar"
              element={(
                <ProtectedRoute>
                  <SuspenseWrapper><EditarPost /></SuspenseWrapper>
                </ProtectedRoute>
              )}
            />
          </Route>

          {/* Home with full layout - navegação pública */}
          <Route element={<HomeLayout />}>
            <Route
              path="home"
              element={<SuspenseWrapper><Home /></SuspenseWrapper>}
            />
            <Route
              path=""
              element={<SuspenseWrapper><Home /></SuspenseWrapper>}
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<SuspenseWrapper><ErrorPage /></SuspenseWrapper>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRoutes
