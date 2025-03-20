import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove product from state
      setProducts(products.filter(product => product.id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      setError(err.message);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <Link
            to="/admin/products/create"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Product
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Stock</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">
                      <img
                        src={`http://localhost:8000/storage/${product.image}`}
                        alt={product.nom}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-6">{product.nom}</td>
                    <td className="py-3 px-6">${parseFloat(product.prix).toFixed(2)}</td>
                    <td className="py-3 px-6">{product.categorie}</td>
                    <td className="py-3 px-6">{product.stock}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductList;