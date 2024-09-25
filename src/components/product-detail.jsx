'use client';
import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, TruckIcon, RefreshCcw, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import axios from 'axios';

export function ProductDetailComponent({
  productId, // Product ID to add to the cart
  name,
  description,
  color,
  size,
  currentPrice,
  originalPrice,
  discountPercentage,
  imageUrl,
  highlights,
  specifications,
  rating,
  totalReviews,
  inStock,
  stockCount,
  deliveryCharge,
  warranty,
  returnPolicy,
  brand,
  category,
  seller
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState('');

  const formatNumber = (num) => num?.toLocaleString() ?? 'N/A';

  const handleAddToCart = async () => {
    console.log('Product ID:', productId); // Log the product ID
    if (!productId) {
      setAddToCartError('Product ID is missing.');
      return;
    }
  
    setIsAddingToCart(true);
    setAddToCartError('');
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1, // Adding 1 item to the cart
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      alert('Product added to cart');
      console.log('Cart data:', data);
    } catch (error) {
      setAddToCartError('Failed to add product to cart. Please try again.');
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleAddToCart} disabled={!inStock || isAddingToCart} className="flex-1">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
          </div>
          {addToCartError && <p className="text-red-500 mt-2">{addToCartError}</p>}
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-gray-600 mt-2">{description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {rating} <Star className="w-4 h-4 inline ml-1 fill-current" />
              </Badge>
              <span className="text-sm text-gray-500">{formatNumber(totalReviews)} reviews</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">₹{formatNumber(currentPrice)}</span>
              <span className="text-xl text-gray-500 line-through">₹{formatNumber(originalPrice)}</span>
              <span className="text-green-600 font-semibold">{discountPercentage}% off</span>
            </div>
            {inStock ? (
              <Badge variant="outline" className="bg-green-50 text-green-700">In Stock ({stockCount} available)</Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700">Out of Stock</Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="font-semibold">Color:</span> {color}
            </div>
            <div>
              <span className="font-semibold">Size:</span> {size}
            </div>
          </div>

          <Separator />

          {/* Highlights Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Highlights</h2>
            <ul className="list-disc list-inside space-y-1">
              {highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Specifications Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Specifications</h2>
            <Table>
              <TableBody>
                {specifications.map((spec, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{spec.featureName}</TableCell>
                    <TableCell>{spec.featureValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Delivery, Warranty, Return Policy */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TruckIcon className="w-5 h-5 text-blue-600" />
              <span>{deliveryCharge === 0 ? 'Free Delivery' : `Delivery Charge: ₹${formatNumber(deliveryCharge)}`}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>{warranty}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCcw className="w-5 h-5 text-orange-600" />
              <span>{returnPolicy}</span>
            </div>
          </div>

          <Separator />

          {/* Brand, Category, Seller */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>Brand: {brand}</p>
            <p>Category: {category}</p>
            <p>Seller: {seller}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
