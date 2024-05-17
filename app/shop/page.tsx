'use client';

import Table from './table/table';
import withAuth from '../service/PrivateRouting';
import Sidebar from './Sidebar';

function Page() {
  return (
    <>
      <main className="flex gap-14 px-[60px] pt-8">
        <Sidebar />
        <div className="grow">
          <Table />
        </div>
      </main>
    </>
  );
}

export default withAuth(Page);
