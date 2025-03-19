import React, { useState } from 'react';
import Sidebar from './Shared/Sidebar';
import OrdersTab from './OrdersTab';
import CompletedTab from './CompletedTab';
import RefundsTab from './RefundsTab';
import CancellationTab from './CancellationTab';

function Orders() {
  const [activeTab, setActiveTab] = useState('Orders');

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 m-5 bg-slate-900 rounded-3xl p-6 flex flex-col">
        <h1 className="text-white text-2xl font-bold mb-4">Orders Management</h1>
        {/* Tab Buttons */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('Orders')}
            className={`px-4 py-2 rounded ${
              activeTab === 'Orders' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('Completed')}
            className={`px-4 py-2 rounded ${
              activeTab === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('Refunds')}
            className={`px-4 py-2 rounded ${
              activeTab === 'Refunds' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            Refunds
          </button>
          <button
            onClick={() => setActiveTab('Cancellation')}
            className={`px-4 py-2 rounded ${
              activeTab === 'Cancellation' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            Cancellations
          </button>
        </div>
        {/* Tab Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'Orders' && <OrdersTab />}
          {activeTab === 'Completed' && <CompletedTab />}
          {activeTab === 'Refunds' && <RefundsTab />}
          {activeTab === 'Cancellation' && <CancellationTab />}
        </div>
      </div>
    </div>
  );
}

export default Orders;