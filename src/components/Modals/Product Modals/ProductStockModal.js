import { useContext, useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";
import { UserContext } from "../../../contexts/UserContext";

function ProductStockModal(props) {
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
    return props.onSubmit(id, stock)
      .catch((err) => console.log(err));
  }


  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const formRef = useRef();
  useEffect(() => {
    enableValidation();
  }, [formRef]);

  const [id, setId] = useState("");
  const [stock, setStock] = useState("");


  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title="Изменить кол-во продукта на складе"
      buttonText="Сохранить"
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >
      <label className="modal__label">
        <p className="modal__label-text">ID продукта</p>
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

      <label className="modal__label">
        <p className="modal__label-text">Сколько единиц сейчас в наличии?</p>
        <input
          className="modal__input"
          type="number"
          id="deleteproduct-id"
          required
          onChange={(e) => {
            setStock(e.target.value);
            toggleButtonState();
          }}
          value={stock}
        />
      </label>
    </FormModal>
  );
}

export default ProductStockModal;
