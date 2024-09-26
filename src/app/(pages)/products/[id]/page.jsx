
import React from 'react';
import { ProductDetailComponent } from '@/components/product-detail'; 

const ProductDetailPage = async ({ params }) => {
  const { id } = params; 
  // console.log("id",id)
  let product = null;

  try {
    const response = await fetch(`https://product-card-backend-1.onrender.com/api/products/${id}`); 
   
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
