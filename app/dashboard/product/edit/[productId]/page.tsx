'use client';

import AdminProductForm from '@/app/ui/forms/AdminProductForm';
import { updateProductThunk } from '@/lib/appState/dashboard/operations';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, use, useEffect, useState } from 'react';

type PageProps = {
  params: {
    productId: string;
  };
};

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState('');
  const categories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );
  const [characteristics, setCharacteristics] = useState<
    { name: string; value: string }[]
  >([]);
  const [characteristic, setCharacteristic] = useState<{
    name: string;
    value: string;
  }>({
    name: '',
    value: '',
  });
  const product: Product | undefined = useAppSelector((state) =>
    state.persistedMainReducer.products.find(
      (product) => product._id === params.productId,
    ),
  );

  useEffect(() => {
    if (product && product.image) {
      setImageUrl(`${process.env.NEXT_PUBLIC_API}${product.image}`);
    }
    if (product && product.characteristics) {
      setCharacteristics(product.characteristics);
    }
  }, [product]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesThunk(''));
    }
    if (!product) {
      router.back();
    }
  }, [dispatch, router, product, categories]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    characteristics.forEach((item, index) => {
      formData.append(`characteristics[${index}][name]`, item.name);
      formData.append(`characteristics[${index}][value]`, item.value);
    });
    formData.delete('characteristicName');
    formData.delete('characteristicDesc');

    const data = Object.fromEntries(formData.entries());
    if (data.image === 'undefined') {
      formData.delete('image');
    }
    dispatch(updateProductThunk({ formData, productId: params.productId }))
      .unwrap()
      .then(() => {
        router.back();
      });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminProductForm
      isEdit
      product={product}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      categories={categories}
      imageUrl={imageUrl}
      characteristics={characteristics}
      setCharacteristics={setCharacteristics}
      characteristic={characteristic}
      setCharacteristic={setCharacteristic}
    />
  );
};

export default Page;
