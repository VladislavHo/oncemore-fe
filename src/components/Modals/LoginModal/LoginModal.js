import { useEffect, useRef, useState, useCallback } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";


/**
 * Компонент модального окна входа в систему
 * @param {Object} props - Свойства компонента
 * @param {string} props.name - Имя модального окна
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {boolean} props.isOpen - Флаг открытия модального окна
 * @param {Function} props.openAnotherModal - Функция открытия другого модального окна
 * @param {Function} props.signIn - Функция авторизации
 */
function LoginModal({ name, onClose, isOpen, openAnotherModal, signIn }) {
  // Состояния
  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Рефы
  const formRef = useRef(null);
  const emailInputRef = useRef(null);

  // Инициализация валидатора формы
  const enableValidation = useCallback(() => {
    if (!formRef.current) return;
    
    const formElement = formRef.current;
    const newValidator = new FormValidator(formElement, setButtonActivity);
    newValidator.enableValidation();
    setValidator(newValidator);
  }, []);

  // Обновление состояния кнопки отправки
  const toggleButtonState = useCallback(() => {
    if (validator) {
      validator.toggleButtonState();
    }
  }, [validator]);

  // Обработка отправки формы
  const handleSubmit = useCallback(async () => {
    if (!isButtonActive || isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      // Очистка формы после успешного входа
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Ошибка при входе. Проверьте email и пароль.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, signIn, isButtonActive, isLoading]);

  // Обработчики изменения полей
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    setError(""); // Сбрасываем ошибку при изменении поля
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setError(""); // Сбрасываем ошибку при изменении поля
  }, []);


  // Обработка нажатия Enter
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && isButtonActive && !isLoading) {
      handleSubmit();
    }
  }, [handleSubmit, isButtonActive, isLoading]);

  // Инициализация валидатора при монтировании
  useEffect(() => {
    if (isOpen) {
      enableValidation();
      // Фокус на поле email при открытии модального окна
      setTimeout(() => {
        if (emailInputRef.current) {
          emailInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, enableValidation]);

  // Обновление состояния кнопки при изменении полей
  useEffect(() => {
    toggleButtonState();
  }, [email, password, toggleButtonState]);

  // Очистка формы при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  }, [isOpen]);

  return (
    <FormModal
      name={name}
      onClose={onClose}
      isOpen={isOpen}
      altText="Зарегистрироваться"
      title="Вход"
      buttonText={isLoading ? "Вход..." : "Войти"}
      openAnotherModal={openAnotherModal}
      formRef={formRef}
      isButtonActive={isButtonActive && !isLoading}
      onSubmit={handleSubmit}
    >
      {error && <div className="modal__error">{error}</div>}
      
      <label className="modal__label">
        <p className="modal__label-text">E-mail</p>
        <input
          className={`modal__input ${error ? "modal__input_error" : ""}`}
          type="email"
          id="login-email"
          placeholder="Введите e-mail"
          onChange={handleEmailChange}
          onBlur={toggleButtonState}
          value={email}
          required
          ref={emailInputRef}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="email"
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Пароль</p>
        <div className="modal__password-container">
          <input
            className={`modal__input ${error ? "modal__input_error" : ""}`}
            type={showPassword ? "text" : "password"}
            id="login-password"
            placeholder="Введите пароль"
            onChange={handlePasswordChange}
            onBlur={toggleButtonState}
            value={password}
            required
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="current-password"
          />
          {/* <button
            type="button"
            className={`modal__password-toggle ${showPassword ? "modal__password-toggle_visible" : ""}`}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          /> */}
        </div>
      </label>
      {/* Удалены учетные данные, которые были в коде */}
    </FormModal>
  );
}

export default LoginModal;