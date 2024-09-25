
'use client'

import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card.jsx';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:5000/api/products'); 
        const data = await response.json();
        setProducts(data); 
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/products/${product._id}`}>
            <div>
              <ProductCard {...product} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
