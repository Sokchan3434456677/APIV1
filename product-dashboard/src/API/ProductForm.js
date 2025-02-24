// import React, { useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ProductForm = ({ onProductAdded }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image: "",
//     category: "NEW ARRIVALS",
//     stock: "",
//     size: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitting form with data:", formData); // Debug log
//     try {
//       const url = `http://localhost:5000/api/products/${encodeURIComponent(formData.category)}`;
//       await axios.post(url, {
//         ...formData,
//         price: Number(formData.price),
//         stock: Number(formData.stock),
//       });
//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         image: "",
//         category: "NEW ARRIVALS",
//         stock: "",
//         size: "",
//       });
//       if (onProductAdded) {
//         onProductAdded(); // Refresh the product list if needed
//       }
//       toast.success("Product added successfully!"); // Success toast
//     } catch (error) {
//       console.error("Error adding product:", error);
//       toast.error("Error: " + error.message); // Error toast
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="product-form">
//         <input
//           type="text"
//           name="name"
//           placeholder="Product Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="stock"
//           placeholder="Stock Quantity"
//           value={formData.stock}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="image"
//           placeholder="Image URL"
//           value={formData.image}
//           onChange={handleChange}
//         />
//         <select
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           required
//         >
//           <option value="NEW ARRIVALS">NEW ARRIVALS</option>
//           <option value="HOODIES">HOODIES</option>
//           <option value="TEES">TEES</option>
//           <option value="OUTFITS">OUTFITS</option>
//         </select>
//         <input
//           type="text"
//           name="size"
//           placeholder="Size (e.g., S, M, L)"
//           value={formData.size}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Add Product</button>
//       </form>
//       <ToastContainer />
//     </>
//   );
// };

// export default ProductForm;





import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: ["", "", "", ""], // Array to store up to 4 image URLs
    category: "NEW ARRIVALS",
    stock: "",
    size: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData); // Debug log
    try {
      const url = `https://apiv-1.vercel.app/api/products/${encodeURIComponent(formData.category)}`;
      await axios.post(url, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.images.filter(url => url.trim() !== ""), // Filter out empty URLs
      });
      setFormData({
        name: "",
        description: "",
        price: "",
        images: ["", "", "", ""], // Reset image URLs
        category: "NEW ARRIVALS",
        stock: "",
        size: "",
      });
      if (onProductAdded) {
        onProductAdded(); // Refresh the product list if needed
      }
      toast.success("Product added successfully!"); // Success toast
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error: " + error.message); // Error toast
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("image")) {
      const index = parseInt(name.split("-")[1], 10); // Extract the index from the input name
      const updatedImages = [...formData.images];
      updatedImages[index] = value;
      setFormData({ ...formData, images: updatedImages });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            type="text"
            name={`image-${index}`}
            placeholder={`Image URL ${index + 1}`}
            value={formData.images[index]}
            onChange={handleChange}
          />
        ))}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="NEW ARRIVALS">NEW ARRIVALS</option>
          <option value="HOODIES">HOODIES</option>
          <option value="TEES">TEES</option>
          <option value="OUTFITS">OUTFITS</option>
        </select>
        <input
          type="text"
          name="size"
          placeholder="Size (e.g., S, M, L)"
          value={formData.size}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      <ToastContainer />
    </>
  );
};

export default ProductForm;
