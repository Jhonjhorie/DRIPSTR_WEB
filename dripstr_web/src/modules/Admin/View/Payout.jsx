import React, { useState } from 'react';
import Sidebar from './Shared/Sidebar';

function Payout() {
    // Manage the selected tab (either 'Merchants' or 'Artists')
    const [selectedTab, setSelectedTab] = useState('Merchants');

    return (
        <>
            <div className='flex flex-row'>
                <Sidebar />
                <div className='bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-screen'>
                    <h1 className='font-bold text-white text-xl mb-4'>Payouts</h1>
                    {/* Tab buttons */}
                    <div className="flex mb-6">
                        <button
                            className={`text-white p-2 mr-4 rounded-lg ${selectedTab === 'Merchants' ? 'bg-blue-500' : 'bg-gray-700'}`}
                            onClick={() => setSelectedTab('Merchants')}
                        >
                            Merchants
                        </button>
                        <button
                            className={`text-white p-2 rounded-lg ${selectedTab === 'Artists' ? 'bg-blue-500' : 'bg-gray-700'}`}
                            onClick={() => setSelectedTab('Artists')}
                        >
                            Artists
                        </button>
                    </div>
                    
                    {/* Tab content */}
                    {selectedTab === 'Merchants' ? (
                        <div className="text-white">
                            <h2 className="font-semibold">Merchants' Payout Requests</h2>
                            <p>Content for Merchants goes here.</p>
                            {/* Add content for Merchants */}
                        </div>
                    ) : (
                        <div className="text-white">
                            <h2 className="font-semibold">Artists' Payout Requests</h2>
                            <p>Content for Artists goes here.</p>
                            {/* Add content for Artists */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Payout;
