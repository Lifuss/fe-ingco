import { redirect } from 'next/navigation';

type PageProps = {
  params: {
    productSlug: string;
  };
};

export default function Page({ params }: PageProps) {
  redirect(`/${params.productSlug}`);
}
