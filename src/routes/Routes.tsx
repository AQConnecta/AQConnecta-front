import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeLayout from '../layout/HomeLayout.tsx'
import Register from '../pages/Register/Register'
import Error from '../pages/Error/Error'
import Login from '../pages/Login/Login'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import ListCompetencia from '../pages/Competencia/ListaCompetencias'
import ProtectedRoute from './ProtectedRoute.tsx'
import Home from '../pages/Home/Home.tsx'
import Usuario from '../pages/Usuario/Usuario.tsx'
import MinhasVagas from '../pages/MinhasVagas/MinhasVagas.tsx'
import MinhasCandidaturas from '../pages/MinhasCandidaturas/MinhasCandidaturas.tsx'
import Buscar from '../pages/Buscar/Buscar.tsx'
import OnlyHeaderLayout from '../layout/OnlyHeaderLayout.tsx'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="competencias"
          element={(
            <ProtectedRoute>
              <ListCompetencia />
            </ProtectedRoute>
          )}
        />
        <Route
          path="usuario"
          element={(<OnlyHeaderLayout />)}
        >
          <Route
            index
            element={(
              <ProtectedRoute>
                <Usuario />
              </ProtectedRoute>
            )}
          />
          <Route
            path=":user-url"
            element={(
              <ProtectedRoute>
                <Usuario />
              </ProtectedRoute>
            )}
          />
        </Route>
        <Route
          path="minhas-vagas"
          element={(<OnlyHeaderLayout />)}
        >
          <Route
            index
            element={(
              <ProtectedRoute>
                <MinhasVagas />
              </ProtectedRoute>
            )}
          />
        </Route>
        <Route
          path="minhas-candidaturas"
          element={<OnlyHeaderLayout/>}
        >
            <Route 
              index
              element={(
                <ProtectedRoute>
                  <MinhasCandidaturas />
                </ProtectedRoute>
              )}>
            </Route>
        </Route>
        <Route
          path="buscar"
          element={<OnlyHeaderLayout/>}
        >
            <Route 
              index
              element={(
                <ProtectedRoute>
                  <Buscar />
                </ProtectedRoute>
              )}>
            </Route>
        </Route>
        <Route element={<HomeLayout />}>
          <Route
            path="home"
            element={(
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )}
          />
          <Route
            path=""
            element={(
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )}
          />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
