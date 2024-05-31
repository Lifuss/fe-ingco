import { Order } from '@/lib/types';
import Modal from 'react-modal';
import { customModalStyles } from './CategoryModal';

const OrderModal = ({
  order,
  isOpen,
  closeModal,
}: {
  order: Order | null;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <Modal
      ariaHideApp={false}
      style={customModalStyles}
      isOpen={isOpen}
      onRequestClose={closeModal}
    >
      {order && (
        <div className="flex flex-col gap-1 text-lg">
          <h3 className="">Номер замовлення: {order.orderCode}</h3>
          <p>Загальна сума замовлення: {order.totalPrice}$</p>
          <p>Статус: {order.status}</p>
          <p>
            Дата створення: {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p>Коментар: {order.comment || '🗿'}</p>
          <p>Товари:</p>
          <ul className="max-h-[200px] overflow-auto border-2 border-blue-200 p-2">
            {order.products.map((product) => (
              <li key={product._id}>
                {product.product?.name ||
                  'Продукт застарів та видалений з бази'}
                - {product.quantity} шт.
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default OrderModal;
