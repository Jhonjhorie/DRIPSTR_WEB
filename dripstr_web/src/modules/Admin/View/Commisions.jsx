import React, { useState, useEffect } from 'react'
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';


function Commisions() {
    const [commisions, setCommisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCommisions = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('art_Commision')
                    .select('id, created_at, client_Id(full_name), artist_Id(artist_Name), title, description, deadline, image, payment, commission_Status, image_Ref')
                if (error) throw error;
                setCommisions(data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCommisions();
        const interval = setInterval(fetchCommisions, 60000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className='flex'>
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
                <h1 className='text-2xl font-bold mb-4 text-white'>Commisions</h1>

                <div>
                    {loading ? (
                        <p className="text-white">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="flex flex-col gap-3 w-full">
                            {commisions.length === 0 ? (
                                <h1 className="flex justify-center items-center font-bold text-2xl text-white py-4">
                                    No Pending Commissions
                                </h1>
                            ) : (
                                commisions.map((commision) => (
                                    <div
                                        key={commision.id}
                                        className="border rounded-md shadow-sm p-3 w-full bg-white flex items-center gap-3 hover:shadow-md transition-shadow"
                                    >
                                        <img
                                            src={commision.image}
                                            alt={commision.image}
                                            className="w-[5.5rem] h-[5.5rem] rounded-sm object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 text-sm">
                                            <div className="flex justify-between items-baseline">
                                                <h2 className="font-semibold text-gray-800 truncate">
                                                    {commision.title}
                                                </h2>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(commision.created_at).toLocaleDateString()} - {new Date(commision.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 truncate">
                                                Artist: {commision.artist_Id?.artist_Name}
                                            </p>
                                            <p className="text-gray-600 truncate">
                                                To: {commision.client_Id?.full_name}
                                            </p>
                                            <p className="text-gray-600 truncate">
                                                Commission Amount: ₱{Number(commision.payment).toLocaleString('en-US')}.00
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-gray-500 truncate max-w-[70%]">
                                                    Instruction: {commision.description}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${commision.commission_Status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : commision.commission_Status === 'Completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {commision.commission_Status}
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Commisions