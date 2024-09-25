"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements } from "@stripe/react-stripe-js"

export default function ShoppingCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/cart");
      console.log(response.data); 
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err); 
      setError("Failed to fetch cart");
      setLoading(false);
    }
  };

  
  const calculateTotal = () => {
    if (!cart || !cart.products) return 0; 
    return cart.products.reduce((total, item) => {
      const price = item?.product?.currentPrice || 0; 
      return total + price * item.quantity; 
    }, 0).toFixed(2); 
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.post("http://localhost:5000/api/cart/update", { productId, quantity });
      fetchCart(); 
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity");
    }
  };

  const removeProduct = async (productId) => {
    try {
      await axios.post("http://localhost:5000/api/cart/remove", { productId });
      fetchCart(); 
    } catch (err) {
      console.error("Error removing product:", err);
      setError("Failed to remove product");
    }
  };

 
    const stripePromise = loadStripe('pk_test_51Q2vFdKPAodQ0QN0vhwpSbyLxvFZkKgAxxcfoIH1gJojIkxNc1c6ijPoNfKRBXpmxsQ1IBxfqnj1hRGBmc8EoUH4008ZvcIRxW'); // Replace with your actual publishable key
    
    const checkout = async () => {
      const stripe = await stripePromise;
    
      try {
        const response = await axios.post("http://localhost:5000/api/cart/checkout");
        const { clientSecret } = response.data;
    
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement), 
            billing_details: {
              name: 'Customer Name', 
            },
          },
        });
    
        if (error) {
          console.error("Payment failed:", error);
          setError("Payment failed. Please try again.");
        } else {
          console.log("Payment successful!");
          fetchCart(); 
        }
      } catch (err) {
        console.error("Error during checkout:", err);
        setError("Checkout failed");
      }
    };
    
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cart || cart.products?.length === 0) return <div>Your cart is empty</div>;  

  const totalAmount = calculateTotal();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {cart?.products?.map((item) => (  
          <div key={item?.product?._id} className="flex items-center justify-between py-2 border-b">
            <div>
              <h3 className="font-semibold">{item?.product?.name}</h3>  
              <p className="text-sm text-gray-500">Rs.{item?.product?.currentPrice}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item?.product?._id, Math.max(1, item.quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span>{item?.quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateQuantity(item?.product?._id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => removeProduct(item?.product?._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <Elements stripe={stripePromise}>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ... your existing cart items code ... */}
        <CardElement />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-lg font-semibold">Total: Rs.{totalAmount}</div>
        <Button onClick={checkout}>Proceed to Checkout</Button>
      </CardFooter>
    </Card>
  </Elements>
    </Card>
  );
}
