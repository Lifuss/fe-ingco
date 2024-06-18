'use client';

import Table from '@/app/ui/Table';
import {
  deleteCategoryThunk,
  fetchCategoriesThunk,
  updateCategoryThunk,
} from '../../../lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import Modal from 'react-modal';
import { customModalStyles } from '../../ui/modals/CategoryModal';
import CategoryForm from '../../ui/forms/CategoryForm';

const CategoryTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const productsCategories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );

  const openModal = (name: string, id: string) => {
    setSelectedId(id);
    setSelectedName(name);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  let query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchCategoriesThunk(query));
  }, [dispatch, query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = e.currentTarget[0] as HTMLInputElement;
    dispatch(updateCategoryThunk({ id: selectedId, name: inputElement.value }))
      .unwrap()
      .then(() => closeModal())
      .catch((err) => alert(err.message));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Найменування',
        accessor: 'nameCol',
      },
      {
        Header: 'Кількість товарів',
        accessor: 'productsCountCol',
      },
      {
        Header: 'Редагувати',
        accessor: 'editCol',
        Cell: ({ row }: { row: Row }) => (
          <button
            className="flex w-full justify-center"
            onClick={() => openModal(row.values.nameCol, row.values.editCol)}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              className="cursor-pointer fill-[#667085] transition-colors hover:fill-black"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 13C22 12.7348 22.1054 12.4804 22.2929 12.2929C22.4804 12.1054 22.7348 12 23 12C23.2652 12 23.5196 12.1054 23.7071 12.2929C23.8946 12.4804 24 12.7348 24 13V24C24 24.2652 23.8946 24.5196 23.7071 24.7071C23.5196 24.8947 23.2652 25 23 25H1C0.734784 25 0.48043 24.8947 0.292893 24.7071C0.105357 24.5196 0 24.2652 0 24V2.00001C0 1.7348 0.105357 1.48044 0.292893 1.29291C0.48043 1.10537 0.734784 1.00001 1 1.00001H12C12.2652 1.00001 12.5196 1.10537 12.7071 1.29291C12.8946 1.48044 13 1.7348 13 2.00001C13 2.26523 12.8946 2.51958 12.7071 2.70712C12.5196 2.89465 12.2652 3.00001 12 3.00001H2V23H22V13Z" />
              <path d="M10.686 14.32L12.336 14.084L22.472 3.95001C22.5675 3.85776 22.6437 3.74742 22.6961 3.62542C22.7485 3.50341 22.7761 3.37219 22.7773 3.23941C22.7784 3.10663 22.7531 2.97495 22.7028 2.85206C22.6525 2.72916 22.5783 2.61751 22.4844 2.52362C22.3905 2.42972 22.2789 2.35547 22.156 2.30519C22.0331 2.25491 21.9014 2.22961 21.7686 2.23076C21.6358 2.23192 21.5046 2.2595 21.3826 2.31191C21.2606 2.36432 21.1502 2.4405 21.058 2.53601L10.92 12.67L10.684 14.32H10.686ZM23.886 1.12001C24.1648 1.39861 24.3859 1.72942 24.5368 2.09352C24.6877 2.45762 24.7654 2.84788 24.7654 3.24201C24.7654 3.63614 24.6877 4.0264 24.5368 4.39051C24.3859 4.75461 24.1648 5.08541 23.886 5.36401L13.516 15.734C13.3631 15.8875 13.1645 15.9872 12.95 16.018L9.65 16.49C9.49621 16.5121 9.33938 16.498 9.19197 16.449C9.04455 16.3999 8.9106 16.3171 8.80074 16.2073C8.69087 16.0974 8.60812 15.9635 8.55904 15.816C8.50997 15.6686 8.49591 15.5118 8.518 15.358L8.99 12.058C9.0203 11.8438 9.11925 11.6452 9.272 11.492L19.644 1.12201C20.2066 0.559599 20.9695 0.243652 21.765 0.243652C22.5605 0.243652 23.3234 0.559599 23.886 1.12201V1.12001Z" />
            </svg>
          </button>
        ),
      },
      {
        Header: 'Видалити',
        accessor: 'deleteCol',
        Cell: ({ row }) => (
          <button
            className="flex w-full justify-center"
            onClick={() => dispatch(deleteCategoryThunk(row.values.deleteCol))}
          >
            <svg
              className="cursor-pointer fill-[#667085] transition-colors
            hover:fill-black"
              width="27"
              height="28"
              viewBox="0 0 27 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.833 4.99996V5.33329H16.1663V4.99996C16.1663 4.29272 15.8854 3.61444 15.3853 3.11434C14.8852 2.61424 14.2069 2.33329 13.4997 2.33329C12.7924 2.33329 12.1142 2.61424 11.6141 3.11434C11.114 3.61444 10.833 4.29272 10.833 4.99996ZM9.16634 5.33329V4.99996C9.16634 3.85069 9.62289 2.74849 10.4355 1.93583C11.2482 1.12317 12.3504 0.666626 13.4997 0.666626C14.6489 0.666626 15.7511 1.12317 16.5638 1.93583C17.3765 2.74849 17.833 3.85069 17.833 4.99996V5.33329H25.333C25.554 5.33329 25.766 5.42109 25.9223 5.57737C26.0785 5.73365 26.1663 5.94561 26.1663 6.16663C26.1663 6.38764 26.0785 6.5996 25.9223 6.75588C25.766 6.91216 25.554 6.99996 25.333 6.99996H23.3883L22.055 22.904C21.9537 24.1117 21.4024 25.2373 20.5102 26.0577C19.6181 26.8781 18.4503 27.3334 17.2383 27.3333H9.76101C8.54914 27.3332 7.38152 26.8778 6.48954 26.0575C5.59756 25.2371 5.0463 24.1116 4.94501 22.904L3.61167 6.99996H1.66634C1.44533 6.99996 1.23337 6.91216 1.07709 6.75588C0.920805 6.5996 0.833008 6.38764 0.833008 6.16663C0.833008 5.94561 0.920805 5.73365 1.07709 5.57737C1.23337 5.42109 1.44533 5.33329 1.66634 5.33329H9.16634ZM6.60567 22.7646C6.67204 23.5558 7.03321 24.2933 7.61761 24.8307C8.20202 25.3682 8.96702 25.6666 9.76101 25.6666H17.2383C18.0324 25.6667 18.7976 25.3685 19.3822 24.831C19.9667 24.2935 20.328 23.556 20.3943 22.7646L21.7157 6.99996H5.28367L6.60567 22.7646ZM11.833 11.5C11.833 11.3905 11.8115 11.2822 11.7696 11.1811C11.7277 11.08 11.6663 10.9881 11.5889 10.9107C11.5115 10.8333 11.4197 10.7719 11.3186 10.7301C11.2175 10.6882 11.1091 10.6666 10.9997 10.6666C10.8902 10.6666 10.7819 10.6882 10.6808 10.7301C10.5797 10.7719 10.4878 10.8333 10.4104 10.9107C10.333 10.9881 10.2717 11.08 10.2298 11.1811C10.1879 11.2822 10.1663 11.3905 10.1663 11.5V21.1666C10.1663 21.2761 10.1879 21.3844 10.2298 21.4855C10.2717 21.5866 10.333 21.6785 10.4104 21.7559C10.4878 21.8333 10.5797 21.8946 10.6808 21.9365C10.7819 21.9784 10.8902 22 10.9997 22C11.1091 22 11.2175 21.9784 11.3186 21.9365C11.4197 21.8946 11.5115 21.8333 11.5889 21.7559C11.6663 21.6785 11.7277 21.5866 11.7696 21.4855C11.8115 21.3844 11.833 21.2761 11.833 21.1666V11.5ZM15.9997 10.6666C16.4597 10.6666 16.833 11.04 16.833 11.5V21.1666C16.833 21.3876 16.7452 21.5996 16.5889 21.7559C16.4327 21.9122 16.2207 22 15.9997 22C15.7787 22 15.5667 21.9122 15.4104 21.7559C15.2541 21.5996 15.1663 21.3876 15.1663 21.1666V11.5C15.1663 11.04 15.5397 10.6666 15.9997 10.6666Z" />
            </svg>
          </button>
        ),
      },
    ],
    [dispatch],
  );

  const data = useMemo(
    () =>
      productsCategories?.map((category) => ({
        nameCol: category.name,
        productsCountCol: category.count,
        editCol: category._id,
        deleteCol: category._id,
      })),
    [productsCategories],
  );

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        headerColor="bg-blue-200"
        borderColor="border-gray-400"
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <CategoryForm handleSubmit={handleSubmit} defaultValue={selectedName} />
      </Modal>
      {/* <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
};

export default CategoryTable;
