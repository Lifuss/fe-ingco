'use client';

import { Button } from '@/app/ui/buttons/button';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  onAddToCart: () => Promise<void>;
  className?: string;
  disabled?: boolean;
}

const AddToCartButton = ({
  productId,
  productName,
  price,
  onAddToCart,
  className = '',
  disabled = false,
}: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onAddToCart();
      setIsAdded(true);
      toast.success(`${productName} додано в кошик`);

      // Reset added state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      toast.error('Помилка додавання в кошик');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`relative overflow-hidden transition-all duration-300 ${
        isAdded
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-orange-400 hover:bg-orange-500'
      } ${className}`}
      aria-label={`Додати ${productName} в кошик`}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isAdded ? (
        <Check className="h-5 w-5" />
      ) : (
        <ShoppingCart className="h-5 w-5" />
      )}
      <span className="ml-2">
        {isLoading ? 'Додавання...' : isAdded ? 'Додано!' : 'В кошик'}
      </span>

      {/* Price display */}
      {/* <span className="ml-2 text-sm opacity-90">{price} грн</span> */}
    </Button>
  );
};

export default AddToCartButton;
