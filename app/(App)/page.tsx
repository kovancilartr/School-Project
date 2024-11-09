import Link from 'next/link'
import React from 'react'

const AppPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1>Hello World</h1>
        <div>
            <li><Link href="/auth/login">Login</Link></li>
            <li><Link href="/auth/profile">Profile</Link></li>
        </div>
    </div>
  )
}

export default AppPage