import { LoaderCircle } from 'lucide-react';
import React from 'react';

const Loader = ({
  size = 16,
  className,
}: {
  size: number;
  className: string;
}) => {
  return <LoaderCircle size={size} className={`animate-spin ${className}`} />;
};

export default Loader;
