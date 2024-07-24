'use client';
import Modal from 'react-modal';
import { customModalStyles } from './CategoryModal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Order, OrderStatusEnum } from '@/lib/types';
import { Button } from '../buttons/button';
import { useEffect, useState } from 'react';
import {
  updateOrderThunk,
  updateRetailOrderThunk,
} from '@/lib/appState/dashboard/operations';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

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
  const { USD } = useAppSelector(
    (state) => state.persistedMainReducer.currencyRates,
  );
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState<Order>(order);
  useEffect(() => {
    setSelectedOrder(order);
  }, [order]);

  if (!selectedOrder) return null;
  const { products, totalPrice, status, isPaid, user } = selectedOrder;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // @ts-ignore
    const status = OrderStatusEnum[form.status.value];
    const declarationNumber = form.declarationNumber.value;
    const normalizeProducts = selectedOrder.products.map((product) => ({
      _id: product._id,
      quantity: product.quantity,
      totalPriceByOneProduct: product.totalPriceByOneProduct,
      product: product.product._id,
      price: product.price,
    }));
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
    setSelectedOrder(order);
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
      <form onSubmit={handleSubmit} className="text-lg">
        <h2 className="font-medium">Номер замовлення: {order?.orderCode}</h2>
        <h3 className="w-full border-t border-gray-400">Клієнт:</h3>
        <div className="mb-2 flex gap-5 border-b border-gray-400 pb-2 text-base">
          <div>
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
        <div className="mb-2 flex gap-5 border-b border-gray-400 pb-2 text-base">
          <div>
            <p>Коментар:</p>
            <p>Номер декларації:</p>
          </div>
          <div>
            <p>{order.comment || 'Відсутній ❌'}</p>
            <input
              className="rounded-lg py-1"
              type="text"
              name="declarationNumber"
              defaultValue={order.declarationNumber}
              placeholder="Номер накладної"
            />
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
            {products.map((product) => (
              <div
                key={product._id}
                className="relative grid grid-cols-4 gap-2 border-b border-gray-400 text-center"
              >
                <div className="text-left text-base">
                  {product.product.name}
                </div>
                <div>
                  {!isRetail
                    ? `${product.price} | ${Math.ceil(product.price * USD)}`
                    : product.price + ' грн'}
                </div>
                <input
                  type="number"
                  defaultValue={
                    selectedOrder?.products.find(
                      (item) => item._id === product._id,
                    )?.quantity
                  }
                  className="rounded-md text-center font-medium"
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    const updatedProducts = selectedOrder?.products.map(
                      (item) => {
                        if (item._id === product._id) {
                          return {
                            ...item,
                            quantity: Number(value),
                            totalPriceByOneProduct: +(
                              Number(value) * item.price
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
                            .reduce(
                              (acc, item) =>
                                acc + Number(item.totalPriceByOneProduct),
                              0,
                            )
                            .toFixed(2),
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
                    ? `${product.totalPriceByOneProduct} | ${Math.ceil(product.totalPriceByOneProduct * USD)}`
                    : product.totalPriceByOneProduct + ' грн'}
                </div>
                <button
                  className="text-red absolute bottom-0 right-0"
                  onClick={() => {
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
                              acc + Number(item.totalPriceByOneProduct),
                            0,
                          )
                          .toFixed(2),
                      ),
                    });
                  }}
                >
                  Вид
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <Button className="mb-2" type="submit">
              Підтвердити зміни
            </Button>
            <Button
              className="bg-red-300 hover:bg-red-400"
              type="reset"
              onClick={handleReset}
            >
              Відмінити зміни
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
