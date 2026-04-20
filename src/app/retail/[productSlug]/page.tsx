import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { productSlug } = await params;
  redirect(`/${productSlug}`);
}
