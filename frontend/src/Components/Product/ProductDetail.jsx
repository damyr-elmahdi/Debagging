import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && (!product || value <= product.stock)) {
      setQuantity(value);
    }
  };

  const addToCart = async () => {
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
          product_id: product.id,
          quantity: quantity,
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
    return <div className="text-center p-6">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  if (!product) {
    return <div className="text-center p-6">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {cartMessage && (
          <div className={`p-4 ${cartMessage.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {cartMessage}
          </div>
        )}
        
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={`http://localhost:8000/storage/${product.image}`}
              alt={product.nom}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2">
            <h1 className="text-2xl font-bold text-gray-800">{product.nom}</h1>
            <p className="text-gray-600 mt-2">Category: {product.categorie}</p>
            <p className="text-gray-800 font-bold text-xl mt-2">${parseFloat(product.prix).toFixed(2)}</p>
            
            <div className="mt-4">
              <p className="text-gray-600">
                Availability: 
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? ` In stock (${product.stock} available)` : " Out of stock"}
                </span>
              </p>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Description</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>
            
            {product.stock > 0 && (
              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="shadow appearance-none border text-center w-16 py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r"
                    onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex space-x-4">
              <button
                onClick={addToCart}
                className={`font-bold py-2 px-4 rounded ${
                  product.stock > 0
                    ? "bg-green-500 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate("/client/products")}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;