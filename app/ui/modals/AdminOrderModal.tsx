'use client';
import Modal from 'react-modal';
import { customModalStyles } from './CategoryModal';
import { useAppSelector } from '@/lib/hooks';
import { OrderStatusEnum } from '@/lib/types';

type AdminOrderModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  orderCode: string;
};

const AdminOrderModal = ({
  isOpen,
  closeModal,
  orderCode,
}: AdminOrderModalProps) => {
  const orders = useAppSelector((state) => state.dashboardSlice.orders);
  const order = orders.find((order) => order.orderCode === orderCode);
  console.log(order);
  if (!order) return null;
  const { products, user, totalPrice, status, isPaid } = order;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      ariaHideApp={false}
    >
      <form className="text-lg">
        <h2 className="font-medium">Номер замовлення: {order?.orderCode}</h2>
        <h3 className="w-full border-t border-gray-600">Користувач:</h3>
        <div className="mb-2 flex gap-5 border-b border-gray-600 pb-2 text-base">
          <div>
            <p>Ім&apos;я:</p>
            <p>Email:</p>
            <p>Моб. номер:</p>
            <p>Статус:</p>
          </div>
          <div>
            <p>{`${user.userId.firstName} ${user.userId.lastName} ${user.userId.surName}`}</p>
            <p>{user.userId.email}</p>
            <p>{user.userId.phone}</p>
            <select
              name="status"
              defaultValue={order.status}
              className="py-1 pr-4"
            >
              {Object.entries(OrderStatusEnum).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-2 flex gap-5 border-b border-gray-600 pb-2 text-base">
          <div>
            <p>Коментар:</p>
            <p>Номер декларації:</p>
          </div>
          <div>
            <p>{order.comment || 'Відсутній ❌'}</p>
            {/* <p>{order.declarationNumber || 'Відсутній ❌'}</p> */}
            <input
              className="py-1"
              type="text"
              name="declarationNumber"
              defaultValue={order.declarationNumber}
              placeholder="Номер накладної"
            />
          </div>
        </div>
        <div>
          <h3 className="w-full border-t border-gray-600">Товари:</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="font-medium">Назва</div>
            <div className="font-medium">Ціна</div>
            <div className="font-medium">Кількість</div>
            <div className="font-medium">Сума</div>
          </div>
          {products.map((product) => (
            <div key={product._id} className="grid grid-cols-4 gap-2">
              <div>{product.product.name}</div>
              <div>{product.totalPriceByOneProduct}</div>
              <div>{product.quantity}</div>
              <div>{product.totalPriceByOneProduct * product.quantity}</div>
            </div>
          ))}
          <div className="flex justify-end">
            <p className="font-medium">Загальна сума: {totalPrice}</p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AdminOrderModal;
