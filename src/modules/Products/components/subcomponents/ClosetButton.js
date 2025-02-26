import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShirt } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '../../../../constants/supabase';

const ClosetButton = ({ profile, item, isLoggedIn, selectedColor }) => {
  const [isInCloset, setIsInCloset] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !profile?.id || !item?.id) return;

    const checkCloset = async () => {
      const { data, error } = await supabase
        .from('closet')
        .select('*')
        .eq('user_id', profile.id)
        .eq('product_id', item.id)
        .eq('variant->>variant_Name', selectedColor.variant_Name)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking closet:', error);
        return;
      }

      setIsInCloset(!!data);
    };

    checkCloset();
  }, [isLoggedIn, profile?.id, item?.id, selectedColor]);

  const toggleCloset = async () => {
    if (!isLoggedIn || !profile?.id || !item?.id) return;
    setLoading(true);

    try {
      if (isInCloset) {
        const { error } = await supabase
          .from('closet')
          .delete()
          .eq('user_id', profile.id)
          .eq('product_id', item.id)
          .eq('variant->>variant_Name', selectedColor.variant_Name);

        if (error) throw error;
        setIsInCloset(false);
      } else {
        const { error } = await supabase
          .from('closet')
          .insert([{ 
            user_id: profile.id, 
            product_id: item.id,
            variant: selectedColor
          }]);

        if (error) throw error;
        setIsInCloset(true);
      }
    } catch (error) {
      console.error('Error updating closet:', error);
      alert('Failed to update closet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <button
          onClick={toggleCloset}
          disabled={loading}
          className={`flex-none flex items-center justify-center w-8 h-8 rounded-md duration-300 transition-all border ${
            loading 
              ? 'bg-gray-200 cursor-not-allowed'
              : isInCloset
                ? 'bg-primary-color text-white border-primary-color'
                : 'text-slate-400 border-slate-400 hover:text-slate-800 hover:border-slate-800'
          }`}
          title={isInCloset ? 'Remove from Closet' : 'Add to Closet'}
        >
          <FontAwesomeIcon icon={faShirt} className={loading ? 'animate-pulse' : ''} />
        </button>
      )}
    </>
  );
};

export default ClosetButton;