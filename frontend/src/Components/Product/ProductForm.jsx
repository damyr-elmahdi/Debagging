import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL if in edit mode
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(isEditMode); // Loading state for form data
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    prix: "",
    description: "",
    categorie: "",
    stock: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImagePath, setOriginalImagePath] = useState(null);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const product = await response.json();
      
      // Update form data with fetched product
      setFormData({
        nom: product.nom,
        prix: product.prix,
        description: product.description,
        categorie: product.categorie,
        stock: product.stock,
        image: null, // Image file will be null initially as we can't fetch the file itself
      });
      
      // Set the original image path for display
      setOriginalImagePath(product.image);
      setImagePreview(`http://localhost:8000/storage/${product.image}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Create form data for file upload
    const productData = new FormData();
    productData.append("nom", formData.nom);
    productData.append("prix", formData.prix);
    productData.append("description", formData.description);
    productData.append("categorie", formData.categorie);
    productData.append("stock", formData.stock);
    
    // Only append image if a new one was selected or if in create mode
    if (formData.image) {
      productData.append("image", formData.image);
    }

    try {
      const url = isEditMode ? `/api/products/${id}` : "/api/products";
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: productData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
      }

      // Product operation successful
      alert(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">Loading product data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
              Product Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nom"
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prix">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="prix"
              type="number"
              name="prix"
              min="0"
              step="0.01"
              value={formData.prix}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categorie">
              Category
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="categorie"
              type="text"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
              Stock
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stock"
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Product Image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!isEditMode} // Only required for new products
            />
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-1">
                  {isEditMode && !formData.image ? 'Current Image:' : 'Preview:'}
                </p>
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="w-64 h-64 object-cover border rounded"
                />
              </div>
            )}
            {isEditMode && (
              <p className="text-sm text-gray-500 mt-2">
                {formData.image ? 'New image selected' : 'Leave empty to keep current image'}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Product" : "Add Product")}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;