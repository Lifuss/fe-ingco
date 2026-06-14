'use client';

import AdminProductForm from '@/app/ui/forms/AdminProductForm';
import { createProductThunk } from '@/lib/appState/dashboard/operations';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.persistedMainReducer.categories);
  const [imageUrl, setImageUrl] = useState('');
  const [characteristics, setCharacteristics] = useState<any[]>([]);
  const [characteristic, setCharacteristic] = useState<any>({
    code: '',
    name: '',
    value: '',
    unit: '',
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesThunk(''));
    }
  }, [dispatch, categories.length]);

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

    dispatch(createProductThunk(formData))
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
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      categories={categories}
      setCharacteristics={setCharacteristics}
      setCharacteristic={setCharacteristic}
      imageUrl={imageUrl}
      characteristics={characteristics}
      characteristic={characteristic}
      selectedCategoryIds={selectedCategoryIds}
      setSelectedCategoryIds={setSelectedCategoryIds}
    />
  );
};

export default Page;
