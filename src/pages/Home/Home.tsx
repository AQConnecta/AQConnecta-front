import React from 'react'
import { Link } from 'react-router-dom'
import { Usuario } from '../../services/endpoints/auth'

function Home() {
    const user:Usuario = JSON.parse(localStorage.getItem('user'))

    if(!user) {
        return <Link to='/login'>Login</Link>
    }

    return (
        <div className='bg-amber-700'>
            <h1 className='text-xl text-red-500'>Home</h1>
            <h2>Olá {user.nome}</h2>

        </div>
    )
}

export default Home

