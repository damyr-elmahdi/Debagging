import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const ClientProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const { token } = useContext(AppContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!token) {
      setCartMessage("Please log in to add items to your cart");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      setCartMessage("Product added to cart!");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      setCartMessage(err.message);
      setTimeout(() => setCartMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>

        {cartMessage && (
          <div className={`p-4 rounded-md mb-4 ${cartMessage.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {cartMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center p-6">
              No products available at the moment.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={`http://localhost:8000/storage/${product.image}`}
                  alt={product.nom}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{product.nom}</h2>
                  <p className="text-gray-600 mt-2">{product.categorie}</p>
                  <p className="text-gray-800 font-bold mt-2">${parseFloat(product.prix).toFixed(2)}</p>
                  <p className="text-gray-600 mt-2">
                    {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/client/products/${product.id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(product.id)}
                      className={`font-bold py-2 px-4 rounded ${
                        product.stock > 0
                          ? "bg-green-500 hover:bg-green-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={product.stock <= 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProductList;