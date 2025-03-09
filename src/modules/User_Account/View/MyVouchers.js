import React, { useState, useEffect } from 'react';
import { supabase } from '../../../constants/supabase';
import Sidebar from "../components/Sidebar";
import hmmmEmote from '../../../assets/emote/hmmm.png';

const MyVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No authenticated user');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: customerVouchers, error: cvError } = await supabase
          .from('customer_vouchers')
          .select(`
            *,
            voucher:voucher_id (
              id,
              voucher_name,
              voucher_type,
              discount,
              expiration,
              condition,
              isDeactivate
            )
          `)
          .eq('acc_id', user.id)
          .eq('isClaim', true)
          .eq('isUsed', false);

        if (cvError) throw cvError;

        const validVouchers = customerVouchers.filter(cv => {
          const expirationDate = new Date(cv.voucher.expiration);
          return expirationDate >= today && !cv.voucher.isDeactivate;
        });

        setVouchers(validVouchers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 px-9">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-ticket-alt mr-3 text-primary-color"></i>
          My Vouchers
        </h1>
        
        {loading ? (
          <div className="flex mt-36 flex-col h-100 justify-center items-center">
            <img src={hmmmEmote} alt="Loading..." className="w-24 h-24 mb-4 animate-bounce" />
            <p className="mt-4 text-gray-600">Loading your vouchers...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            Error: {error}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl relative shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.length > 0 ? (
                vouchers.map(({ voucher }) => (
                  <div 
                    key={voucher.id}
                    className={`relative border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300
                      ${voucher.voucher_type === 'Product' 
                        ? 'border-primary-color bg-primary-color/5'
                        : 'border-green-600 bg-green-50'
                      }`}
                  >
                    <div className="p-4">
                      <div className="absolute opacity-20 -right-4 -top-4">
                        <span className={`text-8xl font-bold
                          ${voucher.voucher_type === 'Product' 
                            ? 'text-primary-color'
                            : 'text-green-700'
                          }`}
                        >
                          ₱
                        </span>
                      </div>
                      
                      <div className="relative">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {voucher.voucher_name}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2
                          ${voucher.voucher_type === 'Product' 
                            ? 'bg-primary-color/10 text-primary-color'
                            : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {voucher.voucher_type} Voucher
                        </span>
                        <div className="mt-3">
                          <p className="text-3xl font-bold text-gray-800 mb-1">
                            ₱{voucher.discount}
                          </p>
                          <p className="text-sm text-gray-600">
                            Min. Spend: ₱{voucher.condition}
                          </p>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 flex items-center">
                          <i className="fas fa-clock mr-2"></i>
                          Valid until: {new Date(voucher.expiration).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <img src={hmmmEmote} alt="No vouchers" className="w-24 h-24 mb-4" />
                  <p className="text-gray-500 text-lg">No available vouchers</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVouchers;