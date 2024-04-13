import { Link } from 'react-router-dom'
import * as C from "./styles"
import Button from '../../components/button';
import Input from '../../components/input';

function Login() {
    return (
        <div>
        <C.Container>
            <C.Content>
                <C.Label>Login</C.Label>
                <Input type="text" placeholder='Username'/>
                <Input type="password" placeholder='Password'/>
                <Button text='Entrar'/>
                <p>Não tem conta? <C.Strong> <Link to="/register">Registre-se</Link></C.Strong> </p>
            </C.Content>
        </C.Container>
        </div>
    );
    }

export default Login;