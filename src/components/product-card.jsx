'use client';
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProductCard({
  name,
  description,
  color,
  size,
  currentPrice,
  originalPrice,
  discountPercentage,
  imageUrl
}) {
  const formatPrice = (price) => {
    return price !== undefined ? `₹${price.toLocaleString()}` : 'N/A';
  }

  const calculateDiscount = () => {
    if (currentPrice && originalPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return discountPercentage
  }

  return (
    (<Card className="w-[350px] h-[450px] overflow-hidden flex flex-col">
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="relative h-[250px]">
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg" />
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full"
            aria-label="Add to wishlist">
            <Heart className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 bg-purple-100 flex-grow flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold line-clamp-2">{name}</h2>
            <p className="text-sm text-gray-600 mt-1">{color}, {size}</p>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold">{formatPrice(currentPrice)}</span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(originalPrice)}</span>
              )}
            </div>
            {calculateDiscount() !== undefined && (
              <span className="text-sm text-green-600 font-semibold">{calculateDiscount()}% off</span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-700">Free delivery</p>
            <Badge variant="secondary" className="mt-2 bg-purple-200 text-purple-700">
              Sale Price Live
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>)
  );
}