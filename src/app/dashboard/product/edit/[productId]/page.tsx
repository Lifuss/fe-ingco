'use client';

import AdminProductForm from '@/app/ui/forms/AdminProductForm';
import { updateProductThunk } from '@/lib/appState/dashboard/operations';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, use, useEffect, useState } from 'react';

type PageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const Page = ({ params }: PageProps) => {
  const { productId } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const product: Product | undefined = useAppSelector((state) =>
    state.persistedMainReducer.products.find((product) => String(product.id) === productId),
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const categories = useAppSelector((state) => state.persistedMainReducer.categories);
  const [characteristics, setCharacteristics] = useState<any[]>(
    () => product?.characteristics || [],
  );
  const [characteristic, setCharacteristic] = useState<any>({
    code: '',
    name: '',
    value: '',
    unit: '',
  });
  const imageUrl =
    uploadedImageUrl || (product?.image ? `${process.env.NEXT_PUBLIC_API}${product.image}` : '');

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    () => product?.categories?.map((c) => c.id) || [],
  );

  const [prevProduct, setPrevProduct] = useState<Product | undefined>(product);
  if (product !== prevProduct) {
    setPrevProduct(product);
    setSelectedCategoryIds(product?.categories?.map((c) => c.id) || []);
  }

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
    const characteristicsObj = characteristics.reduce((acc, c) => {
      const key = (c as any).code || c.name;
      acc[key] = c.value;
      return acc;
    }, {} as Record<string, string>);

    formData.append('characteristics', JSON.stringify(characteristicsObj));
    formData.append('categoryIds', JSON.stringify(selectedCategoryIds));
    formData.delete('characteristicName');
    formData.delete('characteristicDesc');

    const imageFile = formData.get('image') as File | null;
    if (!imageFile || imageFile.size === 0) {
      formData.delete('image');
    }
    dispatch(updateProductThunk({ formData, productId }))
      .unwrap()
      .then(() => {
        router.back();
      });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImageUrl(reader.result as string);
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
      selectedCategoryIds={selectedCategoryIds}
      setSelectedCategoryIds={setSelectedCategoryIds}
    />
  );
};

export default Page;
