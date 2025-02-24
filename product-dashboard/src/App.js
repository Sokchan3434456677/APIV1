import React, { useState } from "react";
import ProductForm from "./API/ProductForm";
import ProductList from "./API/ProductList";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    setRefreshKey((prev) => prev + 1); // Force ProductList to re-fetch
  };

  return (
    <div className="App">
      <h1>TargetStore Admin</h1>
      <ProductForm onProductAdded={handleProductAdded} />
      <ProductList key={refreshKey} />
    </div>
  );
}

export default App;