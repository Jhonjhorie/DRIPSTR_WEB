import React from 'react';
import BuyConfirm from './buyConfirm';

const ViewProductModal = ({ item, onClose }) => {
  return (
    <dialog id="view_product_modal" className="modal">
      <BuyConfirm item={item} onClose={onClose} />
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ViewProductModal;