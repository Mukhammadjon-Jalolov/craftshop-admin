"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the data you want to share
interface ProductContextProps {
  product: any; // Replace `any` with your specific type
  setProduct: (product: any) => void; // Function to update the product
}

// Create the context with default values (can be `null` or initial state)
export const ProductContext = createContext<ProductContextProps | null>(null);

// Create a provider component to wrap around your app
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<any>(null); // Replace `any` with your specific type

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the ProductContext in other components
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
