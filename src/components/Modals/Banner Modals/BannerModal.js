import { useContext, useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";
import { UserContext } from "../../../contexts/UserContext";

function BannerModal(props) {
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
    const paragraphs = text.split("\n");
    return props.onSubmit(title, subtitle, image, paragraphs)
      .then(() => props.onClose())
      .catch((err) => console.log(err));
  }


  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const formRef = useRef();
  useEffect(() => {
    enableValidation();
  }, [formRef]);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [text, setText] = useState("");

  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title="Добавить баннер"
      buttonText="Сохранить"
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >
      <label className="modal__label">
        <p className="modal__label-text">Заголовок</p>
        <input
          className="modal__input"
          type="text"
          id="banner-title"
          placeholder="Введите заголовок"
          onChange={(e) => {
            setTitle(e.target.value);
            toggleButtonState();
          }}
          value={title}
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Подзаголовок</p>
        <input
          className="modal__input"
          type="text"
          id="banner-title"
          placeholder="Введите подзаголовок"
          onChange={(e) => {
            setSubtitle(e.target.value);
            toggleButtonState();
          }}
          value={subtitle}
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Картинка</p>
        <input
          className="modal__input"
          type="file"
          required
          id="banner-image"
          onChange={(e) => {
            setImage(e.target.files[0]);
            toggleButtonState();
          }}
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Текст</p>
        <textarea
          className="modal__textarea"
          type="text"
          id="banner-text"
          placeholder="Введите текст"
          onChange={(e) => {
            setText(e.target.value);
            toggleButtonState();
          }}
          value={text}
        />
      </label>
    </FormModal>
  );
}

export default BannerModal;
