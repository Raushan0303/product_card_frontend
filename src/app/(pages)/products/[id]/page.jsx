
import React from 'react';
import { ProductDetailComponent } from '@/components/product-detail'; 

const ProductDetailPage = async ({ params }) => {
  const { id } = params; 

  let product = null;

  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    product = await response.json(); 
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <ProductDetailComponent 
    productId={product._id}
    {...product} />
  );
}

export default ProductDetailPage;
