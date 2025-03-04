import { useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";

function LoginModal(props) {
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
    return props.signIn(email, password);
  }

  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const formRef = useRef();
  useEffect(() => {
    enableValidation();
  }, [formRef]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      altText="Зарегистрироваться"
      title="Вход"
      buttonText="Войти"
      openAnotherModal={props.openAnotherModal}
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >
      <label className="modal__label">
        <p className="modal__label-text">E-mail</p>
        <input
          className="modal__input"
          type="email"
          id="login-email"
          placeholder="Введите e-mail"
          onChange={(e) => {
            setEmail(e.target.value);
            toggleButtonState();
          }}
          value={email}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Пароль</p>
        <input
          className="modal__input"
          type="password"
          id="login-password"
          placeholder="Введите пароль"
          onChange={(e) => {
            setPassword(e.target.value);
            toggleButtonState();
          }}
          value={password}
          required
        />
      </label>
    </FormModal>
  );
}

export default LoginModal;
