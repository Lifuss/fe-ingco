'use client';
import ToBackButton from '@/app/ui/ToBackButton';
import AdminProductForm from '@/app/ui/forms/AdminProductForm';
import { createProductThunk } from '@/lib/appState/dashboard/operations';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );
  const [imageUrl, setImageUrl] = useState('');
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

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesThunk(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    characteristics?.forEach((item, index) => {
      formData.append(`characteristics[${index}][name]`, item.name);
      formData.append(`characteristics[${index}][value]`, item.value);
    });
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
    />
  );
};

export default Page;
