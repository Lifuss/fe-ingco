import { Order } from '@/lib/types';
import Modal from 'react-modal';
import { customModalStyles } from './CategoryModal';

const OrderModal = ({
  order,
  isOpen,
  closeModal,
  isRetail = false,
}: {
  order: Order | null;
  isOpen: boolean;
  isRetail?: boolean;
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
          <p>
            Загальна сума замовлення:{' '}
            {isRetail ? order.totalPrice : `${order.totalPrice}$`}
          </p>
          <p>Статус: {order.status}</p>
          <p>
            Дата створення:{' '}
            {new Date(order.createdAt).toLocaleDateString('uk-UA')}
          </p>
          <p>
            Номер накладної поштової служби:{' '}
            {order.declarationNumber || '- ще не відправлено'}
          </p>
          <p>Коментар: {order.comment || '- Відсутній'}</p>
          <p>Товари:</p>
          <ul className="max-h-[200px] overflow-auto border-2 border-orange-200 p-2">
            {order.products && Array.isArray(order.products) ? (
              order.products.map((product, index) => {
                const productKey = product?._id || `product-${index}`;

                const productName =
                  product?.product?.name ||
                  'Продукт застарів та видалений з бази';
                const quantity = product?.quantity || 0;

                return (
                  <li key={productKey}>
                    {productName} - {quantity} шт.
                  </li>
                );
              })
            ) : (
              <li>Товари відсутні</li>
            )}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default OrderModal;
