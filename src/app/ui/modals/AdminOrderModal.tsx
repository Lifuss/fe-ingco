'use client';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Order, OrderStatusEnum } from '@/lib/types';
import { Button } from '../buttons/button';
import { useEffect, useRef, useState } from 'react';
import { updateOrderThunk } from '@/lib/appState/dashboard/operations';
import { toast } from 'react-toastify';
import { Trash2, X } from 'lucide-react';
import { printOrderExcel } from '@/lib/utils';
import { selectUSDRate } from '@/lib/appState/main/selectors';
import ConfirmModal from './ConfirmModal';

type AdminOrderModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  order: Order | null;
  isRetail: boolean;
};

const modifiedStyles = {
  overlay: {
    backgroundColor: 'rgba(15, 15, 14, 0.4)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'transparent',
    padding: 0,
    overflow: 'visible',
  },
};

const formatUserName = (
  u: { firstName?: string; lastName?: string; surName?: string } | null | undefined,
) => {
  if (!u) return 'Користувач видалений';
  const parts = [u.firstName, u.lastName, u.surName].filter(
    (part) => part && part !== 'undefined' && part !== 'null',
  );
  return parts.join(' ') || 'Без імені';
};

const AdminOrderModal = ({ isOpen, closeModal, order, isRetail }: AdminOrderModalProps) => {
  const USD = useAppSelector(selectUSDRate);
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(order);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const refForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setSelectedOrder(order);
  }, [order]);

  if (selectedOrder === null) return null;

  const { products, totalPrice, status, user } = selectedOrder;

  const handleSubmitAttempt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = () => {
    const form = refForm.current;
    if (!form) return;

    // FIXME
    // @ts-expect-error : form.status.value is a string
    const status = OrderStatusEnum[form.status.value];
    const declarationNumber = form.declarationNumber.value;
    const normalizeProducts =
      selectedOrder.products
        ?.filter((product) => product?.product?.id)
        ?.map((product) => ({
          id: product.id,
          quantity: product.quantity || 0,
          totalPriceByOneProduct: product.totalPriceByOneProduct || 0,
          product: product.product.id,
          price: product.price || 0,
        })) || [];

    const filteredOutCount =
      selectedOrder.products?.filter((product) => !product?.product?.id).length || 0;

    if (filteredOutCount > 0) {
      toast.warning(
        `${filteredOutCount} товар(ів) з видаленими продуктами було виключено з оновлення`,
      );
    }

    const updatedOrder = {
      ...selectedOrder,
      products: normalizeProducts,
      status,
      declarationNumber,
    };
    const {
      user: _user,
      orderCode: _orderCode,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...updatedOrderWithoutUser
    } = updatedOrder;

    dispatch(
      updateOrderThunk({
        orderId: selectedOrder.id,
        updateOrder: updatedOrderWithoutUser,
        isRetail,
      }),
    );

    closeModal();
  };

  const handleConfirmReset = () => {
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

  const clientName =
    'userId' in user
      ? user.userId
        ? formatUserName(user.userId)
        : 'Користувач видалений'
      : user
        ? formatUserName(user)
        : 'Користувач видалений';
  const clientEmail = 'userId' in user ? user.userId?.email || '—' : user?.email || '—';
  const clientPhone = 'userId' in user ? user.userId?.phone || '—' : user?.phone || '—';

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={modifiedStyles} ariaHideApp={false}>
      <div className="animate-fade-in relative max-h-[95vh] w-full max-w-[850px] overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-5 text-neutral-800 shadow-2xl md:w-[800px]">
        {/* Header bar */}
        <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Панель замовлень
            </span>
            <h2 className="text-lg font-bold text-neutral-900 md:text-xl">
              Замовлення #{order?.orderCode}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="cursor-pointer rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Закрити"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmitAttempt} ref={refForm} className="text-sm">
          {/* Customer & Status section */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Customer Information Card */}
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <h3 className="mb-2.5 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                Клієнт
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-neutral-500">Ім&apos;я:</span>
                  <span className="text-right font-semibold text-neutral-900">{clientName}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-neutral-500">Email:</span>
                  <span className="text-right font-medium text-neutral-800">{clientEmail}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-neutral-500">Моб. номер:</span>
                  <span className="text-right font-medium text-neutral-800">{clientPhone}</span>
                </div>
              </div>
            </div>

            {/* Status & Change status Card */}
            <div className="flex flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <div>
                <h3 className="mb-2.5 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  Статус замовлення
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Поточний статус:
                  </span>
                  <span className="rounded-md border border-amber-200/50 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800">
                    {status}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <label
                  htmlFor="status"
                  className="mb-1 block text-xs font-semibold tracking-wider text-neutral-400 uppercase"
                >
                  Змінити статус
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    defaultValue={status}
                    className="focus:border-primary-500 focus:ring-primary-500 w-full cursor-pointer appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-colors focus:ring-1 focus:outline-none"
                  >
                    {Object.entries(OrderStatusEnum).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Waybill card */}
          <div className="mb-4 space-y-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                  Коментар:
                </span>
                {selectedOrder.comment ? (
                  <span className="rounded-md border border-blue-100/50 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800">
                    {selectedOrder.comment}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400 italic">Відсутній</span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <label
                  htmlFor="declarationNumber"
                  className="text-xs font-semibold tracking-wider text-neutral-600 uppercase"
                >
                  № накладної:
                </label>
                <input
                  id="declarationNumber"
                  name="declarationNumber"
                  className="w-[180px] rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  type="text"
                  defaultValue={selectedOrder.declarationNumber}
                  placeholder="Введіть номер"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 border-t border-neutral-200/60 pt-3">
              <span className="mt-0.5 shrink-0 text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                Адреса доставки:
              </span>
              <span className="text-sm leading-relaxed text-neutral-800">
                {selectedOrder.shippingAddress || 'Адреса відсутня, потрібне уточнення'}
              </span>
            </div>
          </div>

          {/* Products Table Card */}
          <div className="mb-4">
            <h3 className="mb-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
              Товари у замовленні
            </h3>
            <div className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50/50 shadow-sm">
              <div className="max-h-[250px] overflow-y-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-100/80 text-xs font-bold tracking-wider text-neutral-600 uppercase">
                      <th className="px-4 py-2.5">Назва</th>
                      <th className="px-4 py-2.5 text-center">Ціна / од</th>
                      <th className="px-4 py-2.5 text-center">Кількість</th>
                      <th className="px-4 py-2.5 text-right">Сума</th>
                      <th className="w-10 px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/60 bg-white">
                    {products && Array.isArray(products) && products.length > 0 ? (
                      products.map((product, index) => {
                        const productKey = product?.id ?? `product-${index}`;
                        const productName =
                          product?.product?.name || 'Продукт застарів та видалений з бази';
                        const unitPriceText = !isRetail
                          ? `$${product?.price || 0} / ${Math.ceil((product?.price || 0) * USD)} ₴`
                          : `${product?.price || 0} грн`;
                        const sumPriceText = !isRetail
                          ? `$${product?.totalPriceByOneProduct || 0} / ${Math.ceil((product?.totalPriceByOneProduct || 0) * USD)} ₴`
                          : `${product?.totalPriceByOneProduct || 0} грн`;

                        return (
                          <tr
                            key={productKey}
                            className="text-xs transition-colors hover:bg-neutral-50"
                          >
                            <td className="max-w-[280px] px-4 py-2.5 leading-normal font-semibold text-neutral-800">
                              {productName}
                            </td>
                            <td className="px-4 py-2.5 text-center font-bold whitespace-nowrap text-neutral-700">
                              {unitPriceText}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <input
                                type="number"
                                defaultValue={product.quantity || 0}
                                className="mx-auto w-14 rounded-md border border-neutral-300 bg-white px-1.5 py-1 text-center text-xs font-bold text-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => {
                                  if (!product?.id) return;
                                  const value = e.currentTarget.value;
                                  const updatedProducts = selectedOrder?.products.map((item) => {
                                    if (item.id === product.id) {
                                      return {
                                        ...item,
                                        quantity: Number(value),
                                        totalPriceByOneProduct: +(
                                          Number(value) * (item.price || 0)
                                        ).toFixed(2),
                                      };
                                    }
                                    return item;
                                  });
                                  if (+value > 0) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      products: updatedProducts,
                                      totalPrice: Number(
                                        updatedProducts
                                          ?.reduce(
                                            (acc, item) =>
                                              acc + Number(item.totalPriceByOneProduct || 0),
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
                            </td>
                            <td className="px-4 py-2.5 text-right font-extrabold whitespace-nowrap text-neutral-900">
                              {sumPriceText}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <button
                                type="button"
                                className="cursor-pointer rounded p-1 text-neutral-400 transition-colors hover:text-red-500"
                                onClick={() => {
                                  if (!product?.id) return;
                                  const updatedProducts = selectedOrder.products.filter(
                                    (item) => item.id !== product.id,
                                  );
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    products: updatedProducts,
                                    totalPrice: Number(
                                      updatedProducts
                                        .reduce(
                                          (acc, item) =>
                                            acc + Number(item.totalPriceByOneProduct || 0),
                                          0,
                                        )
                                        .toFixed(2),
                                    ),
                                  });
                                }}
                                title="Видалити товар"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-neutral-400 italic">
                          Товари відсутні
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action buttons and pricing summary */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-4 sm:flex-row">
            {/* Actions Buttons */}
            <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
              <Button
                className="h-10 cursor-pointer rounded-xl border-none bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-emerald-700 hover:shadow active:bg-emerald-800"
                type="submit"
              >
                Підтвердити зміни
              </Button>
              <Button
                className="h-10 cursor-pointer rounded-xl border-none bg-neutral-200 px-4 text-xs font-semibold text-neutral-700 shadow-sm transition-all duration-150 hover:bg-neutral-300 hover:shadow active:bg-neutral-400"
                type="button"
                onClick={() => setShowResetConfirm(true)}
              >
                Відмінити зміни
              </Button>
              <Button
                className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 h-10 cursor-pointer rounded-xl border-none px-4 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:shadow"
                type="button"
                onClick={handlePrint}
                disabled={isPrinting}
              >
                {isPrinting ? 'Готуємо накладну...' : 'Друк накладної'}
              </Button>
            </div>

            {/* Total Pricing info */}
            <div className="flex w-full shrink-0 items-center justify-between gap-2 text-right sm:w-auto sm:flex-col sm:items-end sm:justify-start sm:gap-0.5">
              <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
                Загальна сума
              </span>
              <div className="flex items-baseline gap-2">
                {!isRetail ? (
                  <>
                    <span className="text-base font-extrabold text-neutral-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-400">/</span>
                    <span className="text-sm font-bold text-neutral-700">
                      {Math.ceil(totalPrice * USD)} ₴
                    </span>
                  </>
                ) : (
                  <span className="text-base font-extrabold text-neutral-900">
                    {Math.ceil(totalPrice)} грн
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Збереження змін"
        message="Ви впевнені, що хочете зберегти зміни в замовленні?"
        confirmText="Зберегти"
        type="warning"
      />
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleConfirmReset}
        title="Скидання змін"
        message="Ця дія скине замовлення до початкового стану. Всі незбережені зміни буде втрачено. Продовжити?"
        confirmText="Скинути"
        type="danger"
      />
    </Modal>
  );
};

export default AdminOrderModal;
