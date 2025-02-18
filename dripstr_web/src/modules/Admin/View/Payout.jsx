import React from 'react'
import Sidebar from './Shared/Sidebar'

function Payout() {
    return (
        <>
            <div className='flex flex-row'>
                <Sidebar />
                <div className='bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-screen'>
                    <h1 className='font-bold text-white text-xl'>
                        Payouts
                    </h1>
                </div>
            </div>
        </>
    )
}

export default Payout