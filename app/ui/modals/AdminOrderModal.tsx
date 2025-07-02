'use client';
import Modal from 'react-modal';
import { customModalStyles } from './CategoryModal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Order, OrderStatusEnum } from '@/lib/types';
import { Button } from '../buttons/button';
import { useEffect, useRef, useState } from 'react';
import {
  updateOrderThunk,
  updateRetailOrderThunk,
} from '@/lib/appState/dashboard/operations';
import { toast } from 'react-toastify';
import { Trash2, X } from 'lucide-react';
import { printOrderExcel } from '@/lib/utils';
import { selectUSDRate } from '@/lib/appState/main/selectors';

type AdminOrderModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  order: Order;
  isRetail: boolean;
};

const modifiedStyles = {
  ...customModalStyles,
  content: {
    ...customModalStyles.content,
    width: '768px',
    overflow: 'auto',
    maxHeight: '95vh',
  },
};
const AdminOrderModal = ({
  isOpen,
  closeModal,
  order,
  isRetail,
}: AdminOrderModalProps) => {
  const USD = useAppSelector(selectUSDRate);
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState<Order>(order);
  const [isPrinting, setIsPrinting] = useState(false);
  const refForm = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    setSelectedOrder(order);
  }, [order]);

  if (!selectedOrder) return null;
  const { products, totalPrice, status, isPaid, user } = selectedOrder;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmDialogBool = confirm(
      'Ви впевненні що хочете змінити замовлення?',
    );
    if (!confirmDialogBool) {
      return;
    }

    const form = e.currentTarget;
    // @ts-ignore
    const status = OrderStatusEnum[form.status.value];
    const declarationNumber = form.declarationNumber.value;
    const normalizeProducts =
      selectedOrder.products?.map((product) => ({
        _id: product?._id,
        quantity: product?.quantity || 0,
        totalPriceByOneProduct: product?.totalPriceByOneProduct || 0,
        product: product?.product?._id || null,
        price: product?.price || 0,
      })) || [];
    const updatedOrder = {
      ...selectedOrder,
      products: normalizeProducts,
      status,
      declarationNumber,
    };
    const {
      user,
      orderCode,
      createdAt,
      updatedAt,
      ...updatedOrderWithoutUser
    } = updatedOrder;
    isRetail
      ? dispatch(
          updateRetailOrderThunk({
            orderId: order._id,
            updateOrder: updatedOrderWithoutUser,
          }),
        )
      : dispatch(
          updateOrderThunk({
            orderId: order._id,
            updateOrder: updatedOrderWithoutUser,
          }),
        );
    closeModal();
  };

  const handleReset = () => {
    const confirmReset = confirm(
      'Ця дія скине замовлення до початкового стану, всі зміни буде втрачено, продовжити?',
    );
    if (!confirmReset) {
      return;
    }
    setSelectedOrder(order);
    refForm.current?.reset();
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      await printOrderExcel(selectedOrder);
    } catch (error) {
      console.error('Помилка при друці накладної:', error);
      toast.error('Не вдалося згенерувати файл. Спробуйте ще раз');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modifiedStyles}
      ariaHideApp={false}
    >
      <div onClick={closeModal} className="absolute right-2 top-2">
        <X size={24} absoluteStrokeWidth className="cursor-pointer" />
      </div>
      <form onSubmit={handleSubmit} ref={refForm} className="text-lg">
        <h2 className="font-medium">Номер замовлення: {order?.orderCode}</h2>
        <h3 className="w-full border-t border-gray-400">Клієнт:</h3>
        <div className="mb-2 flex gap-5 border-b border-gray-400 pb-2 text-base">
          <div className="font-medium">
            <p>Ім&apos;я:</p>
            <p>Email:</p>
            <p>Моб. номер:</p>
            <p>Статус:</p>
            <p>Змінити статус:</p>
          </div>
          <div>
            {'userId' in user ? (
              user.userId ? (
                <>
                  <p>{`${user.userId.firstName} ${user.userId.lastName} ${user.userId.surName}`}</p>
                  <p>{user.userId.email}</p>
                  <p>{user.userId.phone}</p>
                </>
              ) : (
                <p>Користувач видалений</p>
              )
            ) : user ? (
              <>
                <p>{`${user.firstName} ${user.lastName} ${user.surName}`}</p>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </>
            ) : (
              <p>Користувач видалений</p>
            )}
            <p>{status}</p>
            <select
              name="status"
              defaultValue={status}
              className="rounded-lg py-1 pr-4"
            >
              {Object.entries(OrderStatusEnum).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-2 flex items-baseline gap-5 border-b border-gray-400 pb-2 text-base">
          <div className="flex flex-col items-start gap-2 font-medium">
            <p>Коментар:</p>
            <p className="h-[34px]">№накладної:</p>
            <p>Адреса</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>{order.comment || 'Відсутній ❌'}</p>
            <input
              className="max-w-[200px] rounded-lg py-1"
              type="text"
              name="declarationNumber"
              defaultValue={order.declarationNumber}
              placeholder="Номер накладної"
            />
            <p>
              {order.shippingAddress || 'Адреса відсутня, потрібне уточнення'}
            </p>
          </div>
        </div>
        <div>
          <h3 className="w-full">Товари:</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="border-r border-gray-400 text-left font-medium">
              Назва
            </div>
            <div className="border-r border-gray-400 font-medium">
              Ціна\од $|₴
            </div>
            <div className="border-r border-gray-400 font-medium">
              Кількість
            </div>
            <div className="font-medium ">Сума $|₴</div>
          </div>
          <div className="mb-5 max-h-[370px] overflow-auto">
            {products && Array.isArray(products) ? (
              products.map((product, index) => {
                // Safe fallback for product ID
                const productKey = product?._id || `product-${index}`;
                // Safe access to product name
                const productName =
                  product?.product?.name ||
                  'Продукт застарів та видалений з бази';

                return (
                  <div
                    key={productKey}
                    className="relative grid grid-cols-4 gap-2 border-b border-gray-400 text-center"
                  >
                    <div className="text-left text-base">{productName}</div>
                    <div>
                      {!isRetail
                        ? `${product?.price || 0} | ${Math.ceil((product?.price || 0) * USD)}`
                        : (product?.price || 0) + ' грн'}
                    </div>
                    <input
                      type="number"
                      defaultValue={
                        selectedOrder?.products.find(
                          (item) => item._id === product._id,
                        )?.quantity || 0
                      }
                      className="mx-auto h-fit max-w-[50px] rounded-md py-1 text-center font-medium"
                      onChange={(e) => {
                        if (!product?._id) return;

                        const value = e.currentTarget.value;
                        const updatedProducts = selectedOrder?.products.map(
                          (item) => {
                            if (item._id === product._id) {
                              return {
                                ...item,
                                quantity: Number(value),
                                totalPriceByOneProduct: +(
                                  Number(value) * (item.price || 0)
                                ).toFixed(2),
                              };
                            }
                            return item;
                          },
                        );
                        if (+value > 0) {
                          setSelectedOrder({
                            ...selectedOrder,
                            products: updatedProducts,
                            totalPrice: Number(
                              updatedProducts
                                ?.reduce(
                                  (acc, item) =>
                                    acc +
                                    Number(item.totalPriceByOneProduct || 0),
                                  0,
                                )
                                .toFixed(2) || 0,
                            ),
                          });
                        } else {
                          toast.error('Кількість товару не може бути менше 1', {
                            autoClose: 1000,
                          });
                        }
                      }}
                    />
                    <div>
                      {!isRetail
                        ? `${product?.totalPriceByOneProduct || 0} | ${Math.ceil((product?.totalPriceByOneProduct || 0) * USD)}`
                        : (product?.totalPriceByOneProduct || 0) + ' грн'}
                    </div>
                    <button
                      className="text-red absolute bottom-2 right-0"
                      onClick={() => {
                        if (!product?._id) return;

                        const updatedProducts = selectedOrder.products.filter(
                          (item) => item._id !== product._id,
                        );
                        setSelectedOrder({
                          ...selectedOrder,
                          products: updatedProducts,
                          totalPrice: Number(
                            updatedProducts
                              .reduce(
                                (acc, item) =>
                                  acc +
                                  Number(item.totalPriceByOneProduct || 0),
                                0,
                              )
                              .toFixed(2),
                          ),
                        });
                      }}
                    >
                      <Trash2 className="text-gray-200 transition-colors hover:text-red-500" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">
                Товари відсутні
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex h-fit flex-col gap-2 md:flex-row">
            <Button className="h-10 text-white" type="submit">
              Підтвердити зміни
            </Button>
            <Button
              className="h-10 bg-red-300 hover:bg-red-400 focus:bg-red-400 active:bg-red-500"
              type="button"
              onClick={handleReset}
            >
              Відмінити зміни
            </Button>
            <Button
              className="h-10 bg-green-300 hover:bg-green-500 focus:bg-green-500 active:bg-green-600"
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
            >
              {isPrinting ? 'Готуємо накладну...' : 'Друк накладної'}
            </Button>
          </div>
          <p className="font-medium">
            Загальна сума:{' '}
            {!isRetail ? (
              <>
                <span className="block">{totalPrice.toFixed(2)} $</span>
                <span>{Math.ceil(totalPrice * USD)} ₴</span>
              </>
            ) : (
              <span>{Math.ceil(totalPrice)} грн</span>
            )}
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AdminOrderModal;
