import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Register from '../pages/Register/Register'
import Error from '../pages/Error/Error'
import Login from '../pages/Login/Login'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import ListCompetencia from '../pages/Competencia/ListaCompetencias'
import MeuEndereco from '../pages/Endereco/Endereco'
import EnderecoRegister from '../pages/Endereco/EnderecoRegister'
import MinhaExperiencia from '../pages/Experiencia/Experiencia.tsx'
import ExperienciaRegister from '../pages/Experiencia/ExperienciaRegister.tsx'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="endereco">
          <Route index element={<MeuEndereco />} />
          <Route path="register" element={<EnderecoRegister />} />
          <Route path="register/:id" element={<EnderecoRegister />} />
        </Route>
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="home" element={<Home />} />
        <Route path="competencias" element={<ListCompetencia />} />
        <Route path="experiencias">
          <Route index element={<MinhaExperiencia />} />
          <Route path="register" element={<ExperienciaRegister />} />
          <Route path="register/:id" element={<ExperienciaRegister />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
