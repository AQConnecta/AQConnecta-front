import { Link } from 'react-router-dom'
import * as C from "./styles"
import Button from '../../components/button'
import Input from '../../components/input'


function Register() {

    return (
        <div>
            <C.Container>
                <C.Content>
                    <C.Label>Registre-se</C.Label>
                    <Input placeholder='Nome' type='text'></Input>
                    <Input placeholder='E-mail' type='text'></Input>
                    <Input placeholder='Senha' type='password'></Input>
                    <Button text='Registrar'></Button>
                    <p>Já tem conta? <C.Strong> <Link to="/login">Entrar</Link></C.Strong> </p>
                </C.Content>
            </C.Container>
        </div>
    )
}

export default Register