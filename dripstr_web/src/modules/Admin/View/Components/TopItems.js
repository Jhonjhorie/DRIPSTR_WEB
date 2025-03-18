import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

function TopItems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("shop_Product")
          .select("id, item_Name, item_Variant, shop_Name, item_Category, item_Orders")
          .gt("item_Orders", 0) // Only fetch products with orders > 0
          .order("item_Orders", { ascending: false }); // Sort by orders, highest first

        if (error) throw error;

        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {products.length > 0 ? (
        products.map((product, index) => (
          <div
            key={product.id}
            className="bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 relative text-white"
          >
            {/* Rank Badge */}
            <div
              className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0
                  ? "bg-yellow-400"
                  : index === 1
                  ? "bg-gray-400"
                  : index === 2
                  ? "bg-amber-600"
                  : "bg-violet-500"
              }`}
            >
              {index + 1}
            </div>

            {/* Product Content */}
            <div className="mt-2">
              {/* Product Image */}
              {product.item_Variant && product.item_Variant[0]?.imagePath && (
                <img
                  src={product.item_Variant[0].imagePath}
                  alt={product.item_Name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                  onError={(e) => (e.target.style.display = "none")} // Hide broken images
                />
              )}
              <div>
              <h3 className="text-lg font-semibold text-white line-clamp-2 min-h-[3rem]">
                {product.item_Name}
              </h3>
              <h3 className="text-lg font-semibold text-white line-clamp-2 min-h-[3rem]">
                {product.item_Category}
              </h3>
              </div>
              <div className="">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Orders:</span> {product.item_Orders}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Shop:</span> {product.shop_Name}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-300">
          No products with orders found.
        </div>
      )}
    </div>
  );
}

export default TopItems;