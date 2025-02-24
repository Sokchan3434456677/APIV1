

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import "./Style.css";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("NEW ARRIVALS");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: ["", "", "", ""], // Array to store up to 4 image URLs
    stock: "",
    size: "",
  });
  const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image

  // Fetch products from the server
  const fetchProducts = async () => {
    try {
      const url = `https://apiv-1.vercel.app/api/products/${encodeURIComponent(selectedCategory)}`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch products when the selected category changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setEditingProductId(null);
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://apiv-1.vercel.app/api/products/${encodeURIComponent(selectedCategory)}/${id}`
      );
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images || ["", "", "", ""], // Ensure images array is populated
      stock: product.stock,
      size: product.size,
    });
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("image")) {
      const index = parseInt(name.split("-")[1], 10); // Extract the index from the input name
      const updatedImages = [...editFormData.images];
      updatedImages[index] = value;
      setEditFormData({ ...editFormData, images: updatedImages });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  // Handle form submission
  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://apiv-1.vercel.app/api/products/${encodeURIComponent(selectedCategory)}/${id}`,
        {
          ...editFormData,
          price: Number(editFormData.price),
          stock: Number(editFormData.stock),
          images: editFormData.images.filter((url) => url.trim() !== ""), // Filter out empty URLs
        }
      );
      setEditingProductId(null);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // Handle image click to show modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close the image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="product-list">
      <h2>{selectedCategory} Products</h2>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="NEW ARRIVALS">NEW ARRIVALS</option>
        <option value="HOODIES">HOODIES</option>
        <option value="TEES">TEES</option>
        <option value="OUTFITS">OUTFITS</option>
      </select>
      <div className="product-grid">
        {products.length ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              {editingProductId === product._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, product._id)}>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                  />
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                  />
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    required
                  />
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      type="text"
                      name={`image-${index}`}
                      placeholder={`Image URL ${index + 1}`}
                      value={editFormData.images[index]}
                      onChange={handleEditChange}
                    />
                  ))}
                  <input
                    type="number"
                    name="stock"
                    value={editFormData.stock}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="text"
                    name="size"
                    placeholder="Size (e.g., S, M, L)"
                    value={editFormData.size}
                    onChange={handleEditChange}
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingProductId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  {/* Carousel for product images */}
                  <div
                    id={`carousel-${product._id}`}
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                      {product.images &&
                        product.images.map(
                          (image, index) =>
                            image && (
                              <div
                                key={index}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                              >
                                <img
                                  src={image}
                                  alt={`${product.name} - Image ${index + 1}`}
                                  className="d-block w-100 product-image"
                                  style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                                  onClick={() => handleImageClick(image)}
                                />
                              </div>
                            )
                        )}
                    </div>
                    {product.images.filter((url) => url.trim() !== "").length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#carousel-${product._id}`}
                          data-bs-slide="prev"
                        >
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target={`#carousel-${product._id}`}
                          data-bs-slide="next"
                        >
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>
                  <p>Stock: {product.stock}</p>
                  <p>Size: {product.size}</p>
                  <button onClick={() => handleEditClick(product)}>Edit</button>
                  <button onClick={() => handleDelete(product._id)}>Delete</button>
                  
                </>
              )}
            </div>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content">
            <img src={selectedImage} alt="Selected" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
