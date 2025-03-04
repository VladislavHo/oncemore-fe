import { useState } from "react";
import Modal from "../Modal/Modal";

function ShareModal(props) {
  const link = window.location.href;

  return (
    <Modal name={props.name} onClose={props.onClose} isOpen={props.isOpen}>
      <h2 className="modal__title">Ссылка на этот обзор</h2>
      <div className="modal__share-link">
        {link}
      </div>
    </Modal>
  );
}

export default ShareModal;
