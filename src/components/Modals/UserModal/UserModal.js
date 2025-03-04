import { useContext, useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";
import { UserContext } from "../../../contexts/UserContext";

function UserModal(props) {
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
    return props.onSubmit(avatar)
      .then(() => props.onClose())
      .catch((err) => console.log(err));
  }

  function checkFileSize(file) {
    if (!validator) return;

    if (file.size > 1073741824) {
      setButtonActivity(false);
      alert("Размер файла превышает 1Гб");
    }
  }


  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const formRef = useRef();
  useEffect(() => {
    enableValidation();
  }, [formRef]);

  const currentName = useContext(UserContext).user.name;
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentName);

  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title="Изменение данных"
      buttonText="Сохранить"
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >
      {/* <label className="modal__label">
        <p className="modal__label-text">Новое имя</p>
        <input
          className="modal__input"
          type="text"
          id="user-name"
          minLength={2}
          maxLength={64}
          placeholder="Введите имя пользователя"
          onChange={(e) => {
            setName(e.target.value);
            toggleButtonState();
          }}
          value={name}
        />
      </label> */}

      <label className="modal__label">
        <p className="modal__label-text">Новый аватар</p>
        <input
          className="modal__input modal__input_file"
          type="file"
          id="user-avatar"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setAvatar(e.target.files[0]);
            checkFileSize(e.target.value);
            toggleButtonState();
          }}
        />
      </label>
    </FormModal>
  );
}

export default UserModal;
