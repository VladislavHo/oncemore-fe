import { useContext, useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";
import { UserContext } from "../../../contexts/UserContext";

function BannerDeleteModal(props) {
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

  const [id, setId] = useState(0);

  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title="Удалить баннер"
      buttonText="Удалить"
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >
      <label className="modal__label">
        <p className="modal__label-text">Номер баннера (0-...)</p>
        <input
          className="modal__input"
          type="number"
          id="deletebanner-id"
          min={0}
          required
          placeholder="Введите номер баннера (0-...)"
          onChange={(e) => {
            setId(e.target.value);
            toggleButtonState();
          }}
        />
      </label>
    </FormModal>
  );
}

export default BannerDeleteModal;
