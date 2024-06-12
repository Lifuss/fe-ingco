import RetailCartTable from './RetailCartTable';

const Page = () => {
  return (
    <>
      <RetailCartTable />
      <div
        id="image"
        className="absolute z-50 hidden h-[200px] w-[200px]"
      ></div>
    </>
  );
};

export default Page;
