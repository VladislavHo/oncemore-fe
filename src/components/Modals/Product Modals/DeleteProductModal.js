import { useContext, useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";
import { UserContext } from "../../../contexts/UserContext";

function DeleteProductModal(props) {
  function enableValidation() {
    const formElement = formRef.current;
    const newValidator = new FormValidator(formElement, setButtonActivity);
    newValidator.enableValidation();
    setValidator(newValidator);
  }

  function toggleButtonState() {
    validator.toggleButtonState();
  }

  function submit() {
    return props.onSubmit(id)
      .catch((err) => console.log(err));
  }


  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const formRef = useRef();
  useEffect(() => {
    enableValidation();
  }, [formRef]);

  const [id, setId] = useState("");

  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title="Удалить продукт"
      buttonText="Удалить"
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >
      <label className="modal__label">
        <p className="modal__label-text">ID</p>
        <input
          className="modal__input"
          type="text"
          id="deleteproduct-id"
          required
          placeholder="Введите ID продукта"
          onChange={(e) => {
            setId(e.target.value);
            toggleButtonState();
          }}
        />
      </label>
    </FormModal>
  );
}

export default DeleteProductModal;
