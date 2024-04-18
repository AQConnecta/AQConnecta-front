import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
    const nome = 'juandesenvolvedor'
    return (
        <div className='bg-amber-700'>
            <h1 className='text-xl text-red-500'>Home</h1>
            <h2>Olá {nome}</h2>

        </div>
    )
}

export default Home

