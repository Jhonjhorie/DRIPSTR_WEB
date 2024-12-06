import React,{useState, useEffect} from 'react';
import useResponsiveItems from '../../../shared/hooks/useResponsiveItems';
import { ReactComponent as Logo } from '@/assets/images/BlackLogo.svg'; 
import ProductModal from './productModal'
import RateSymbol from '@/shared/products/rateSymbol';
import { averageRate } from '../hooks/useRate.ts';
import { supabase } from '@/constants/supabase';

const ProductsView = ({ categories, filter}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('products') 
          .select('*'); 
        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const [selectedItem, setSelectedItem] = useState(null);
  const itemsToShow = useResponsiveItems({ mb: 2, sm: 2, md: 4, lg: 6 }); 
  const numColumns = itemsToShow;
  
  const openModal = (item) => {
    setSelectedItem(item);  
    setTimeout(() => {
      document.getElementById('my_modal_4').showModal();
    }, 50);
  };
  const closeModal = () => {
    document.getElementById('my_modal_4').close();
    setSelectedItem(null);
  };

 
const filteredProducts = products.filter(item => {
  switch (filter) {
    case 0:
      return true;
    case 1:
      return item.str === true;
    default:
      return true;
  }
});

const filteredProductsC = filteredProducts.filter(item => {
  return categories === "All" || item.category === categories;
});


const totalItems = filteredProductsC.length;
const remainder = totalItems % numColumns;
const placeholdersNeeded = remainder === 0 ? 0 : numColumns - remainder;

const dataWithPlaceholders = [
  ...filteredProductsC,
  ...Array(placeholdersNeeded).fill({ empty: true }),
];

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

  return (
    
    <div className="w-full flex flex-col items-center pb-24">
       {selectedItem  && <dialog id="my_modal_4" className=" modal modal-bottom sm:modal-middle absolute right-4 sm:right-0">
                   <ProductModal item={selectedItem} onClose={closeModal}/>
                   <form method="dialog" class="modal-backdrop">
                    <button onClick={closeModal}></button>
                  </form>
      </dialog>}
      
      <div className="grid gap-1 items-center justify-center" style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
        {dataWithPlaceholders.map((item, index) =>
          item.empty ? (
            // Placeholder item for alignment
            <div
              key={`placeholder-${index}`}
              className="flex flex-col mx-1 mb-2 p-2 rounded-md"
              style={{ visibility: 'hidden' }}
            />
          ) : (
            <div
              key={item.prodId || `product-${index}`}
              onClick={() => openModal(item)} 
              className="flex flex-col flex-1 max-w-[13.5rem] w-[13.5rem] items-center mx-1 mb-2 rounded-md bg-slate-100 shadow-sm hover:shadow-lg gap-1 hover:scale-105 relative transition-transform duration-300 group"
            >
              {item.str && (
                <Logo
                  className="absolute top-2 left-2 group-hover:opacity-100 duration-300 transition-all opacity-50 w-7 h-7"
                />
              )}
              

              <div className="absolute flex flex-row right-2 top-2 ">
                {item.voucher && (
                  <span className="text-xs border border-primary-color px-0.5 font-thin">
                    SHOP VOUCHER
                  </span>
                )}
                {item.discount > 0 && (
                  <span className="text-xs text-white bg-primary-color border border-primary-color px-0.5 font-bold">
                    {item.discount}%
                  </span>
                )}
              </div>
              <img
                src={item.url}
                alt={item.product}
                className="object-contain mb-2 mt-1 w-[180px] h-[200px]"
                
              />
              <div className="w-full flex flex-col px-3 py-2 bg-slate-200 rounded-b-md">
                {item.product && (
                  <p className="text-secondary-color text-md font-medium truncate">
                    {item.product}
                  </p>
                )}
                <div className="flex flex-row justify-between items-center">
                  {/* Price */}
                  {item.price && (
                    <p className="text-primary-color text-md font-medium">₱{item.price}</p>
                  )}

                  {/* Ratings and Sales */}
                  <div className="flex flex-row items-center just gap-0.5">
                  <p className="text-primary-color text-md">{averageRate(item.reviews)}</p>
                    <RateSymbol item={item.rate} size={'4'} />
                    <span className="text-secondary-color justify-center text-sm ">
                      | {item.sold} sold
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
            
          )
        )}
      </div>
     
     
    </div>
    
  );
};

export default ProductsView;
