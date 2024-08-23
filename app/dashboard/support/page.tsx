import Search from '@/app/ui/search';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl">Підтримка (В розробці)</h1>
      <div className="mb-10 flex justify-between">
        <Search placeholder="Email або номер звернення" />
      </div>
    </div>
  );
};

export default Page;
