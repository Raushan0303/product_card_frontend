import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const CartButton = ({ cartCount = 0 }) => {
  return (
    <Link href="/cart">
      <div className="relative">
        <ShoppingCart className="w-8 h-8 text-gray-600" />

        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {cartCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartButton;
