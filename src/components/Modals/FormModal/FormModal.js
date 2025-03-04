import { useState } from "react";
import Modal from "../Modal/Modal";

function FormModal(props) {
  const [isLoading, setLoading] = useState(false);

  return (
    <Modal name={props.name} onClose={props.onClose} isOpen={props.isOpen}>
      <h2 className="modal__title">{props.title}</h2>
      <form
        className="modal__form"
        ref={props.formRef}
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          props.onSubmit()
            .then(() => {
              props.onClose(props.name);
              setLoading(false); 
            });
        }}
      >
        {props.children}

        <button
          className="modal__submit-button"
          disabled={!props.isButtonActive || isLoading}
        >
          {
            isLoading ? "Загрузка..." :
            props.buttonText
          }
        </button>

        {
          props.altText ? 
          <p className="modal__alt">
            или{" "}
            <button
              className="modal__link-button"
              onClick={props.openAnotherModal}
              tabIndex="0"
            >
              {props.altText}
            </button>
          </p>
          : ""
        }
      </form>
    </Modal>
  );
}

export default FormModal;
