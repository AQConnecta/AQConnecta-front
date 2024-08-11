import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeLayout from '../pages/Home/HomeLayout.tsx'
import Register from '../pages/Register/Register'
import Error from '../pages/Error/Error'
import Login from '../pages/Login/Login'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import ListCompetencia from '../pages/Competencia/ListaCompetencias'
import MeuEndereco from '../pages/Endereco/Endereco'
import EnderecoRegister from '../pages/Endereco/EnderecoRegister'
import MinhaExperiencia from '../pages/Experiencia/Experiencia.tsx'
import ExperienciaRegister from '../pages/Experiencia/ExperienciaRegister.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import Home from '../pages/Home/Home.tsx'
import MinhaFormacaoAcademica from '../pages/FormacaoAcademica/FormacaoAcademica.tsx'
import FormacaoAcademicaRegister from '../pages/FormacaoAcademica/FormacaoAcademicaRegister.tsx'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route element={<HomeLayout />}>
          <Route
            path="home"
            element={(
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )}
          />
        </Route>
        <Route
          path="competencias"
          element={(
            <ProtectedRoute>
              <ListCompetencia />
            </ProtectedRoute>
          )}
        />
        <Route path="experiencias">
          <Route
            index
            element={(
              <ProtectedRoute>
                <MinhaExperiencia />
              </ProtectedRoute>
            )}
          />
          <Route
            path="register"
            element={(
              <ProtectedRoute>
                <ExperienciaRegister />
              </ProtectedRoute>
            )}
          />
          <Route
            path="register/:id"
            element={(
              <ProtectedRoute>
                <ExperienciaRegister />
              </ProtectedRoute>
            )}
          />
        </Route>
        <Route path="endereco">
          <Route
            index
            element={(
              <ProtectedRoute>
                <MeuEndereco />
              </ProtectedRoute>
            )}
          />
          <Route
            path="register"
            element={(
              <ProtectedRoute>
                <EnderecoRegister />
              </ProtectedRoute>
            )}
          />
          <Route
            path="register/:id"
            element={(
              <ProtectedRoute>
                <EnderecoRegister />
              </ProtectedRoute>
            )}
          />
        </Route>
        <Route path="formacoes_academicas">
          <Route
            index
            element={(
              <ProtectedRoute>
                <MinhaFormacaoAcademica />
              </ProtectedRoute>
            )}
          />
          <Route
            path="register"
            element={(
              <ProtectedRoute>
                <FormacaoAcademicaRegister />
              </ProtectedRoute>
            )}
          />
          <Route
            path="register/:id"
            element={(
              <ProtectedRoute>
                <FormacaoAcademicaRegister />
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
