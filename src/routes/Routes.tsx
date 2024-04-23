import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Register from '../pages/Register/Register';
import Error from '../pages/Error/Error';
import Login from '../pages/Login/Login';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ListCompetencia from '../pages/Competencia/ListaCompetencias';
import MeuEndereco from '../pages/Endereco/Endereco';
import EnderecoRegister from '../pages/Endereco/EnderecoRegister';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='endereco' element={<MeuEndereco />} />
        <Route path='endereco/register' element={<EnderecoRegister />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path="home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path='competencias' element={<ListCompetencia />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
