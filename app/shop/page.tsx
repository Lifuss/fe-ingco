import { productsCategories } from '@/lib/constants';
import Table from './table/table';

export default function Page() {
  return (
    <>
      <main className="flex gap-6 px-[60px] pt-8">
        <aside className="w-[200px] ">
          <div className="relative mb-4 py-1 shadow-md">
            <h2 className="text-center text-base font-medium tracking-[0.01em]">
              Каталог товарів
            </h2>
            <svg
              viewBox="0 0 24 17"
              className="absolute left-1 top-[50%] h-4 w-6 -translate-y-[50%]"
            >
              <path
                d="M1.33333 16.5H22.6667C23.4 16.5 24 15.9 24 15.1667C24 14.4333 23.4 13.8333 22.6667 13.8333H1.33333C0.6 13.8333 0 14.4333 0 15.1667C0 15.9 0.6 16.5 1.33333 16.5ZM1.33333 9.83333H22.6667C23.4 9.83333 24 9.23333 24 8.5C24 7.76667 23.4 7.16667 22.6667 7.16667H1.33333C0.6 7.16667 0 7.76667 0 8.5C0 9.23333 0.6 9.83333 1.33333 9.83333ZM0 1.83333C0 2.56667 0.6 3.16667 1.33333 3.16667H22.6667C23.4 3.16667 24 2.56667 24 1.83333C24 1.1 23.4 0.5 22.6667 0.5H1.33333C0.6 0.5 0 1.1 0 1.83333Z"
                fill="#111111"
              />
            </svg>
            {/* <Bars3Icon className="absolute left-0 top-0 h-6 w-6" /> */}
          </div>
          <ul className="flex flex-col shadow-md">
            {productsCategories.map((category) => (
              <li
                className=" cursor-pointer border-b-2 border-gray-200 py-1 pl-1 text-base tracking-[0.01em] transition-colors hover:bg-gray-100 hover:text-gray-800"
                key={category}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>
        <div className="grow">
          <Table />
        </div>
      </main>
    </>
  );
}
