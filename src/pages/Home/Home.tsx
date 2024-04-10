import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className='bg-amber-700'>
            <h1 className='text-xl text-red-500'>Home</h1>
            <h2 className='text-3xl font-bold underline'>aaaaaaaaaaaaaaa</h2>
            <Link to="/register">Register</Link>

        </div>
    )
}

export default Home

