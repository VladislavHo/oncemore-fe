import { useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";

function NewProductModal(props) {
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
    return props.addProduct(photo, {name, category, brand, color, price,
      country, size, barcode, article, description, appliance, composition,
      colorImage, type,
  });
  }

  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const formRef = useRef();
  useEffect(() => {
    enableValidation();
  }, [formRef]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [country, setCountry] = useState("");
  const [size, setSize] = useState("");
  const [barcode, setBarcode] = useState("");
  const [article, setArticle] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [appliance, setAppliance] = useState("");
  const [composition, setComposition] = useState("");
  const [colorImage, setColorImage] = useState("#000000");
  const [type, setType] = useState("");

  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title="Новый продукт"
      buttonText="Создать"
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >
      <label className="modal__label">
        <p className="modal__label-text">Название</p>
        <input
          className="modal__input"
          type="text"
          id="product-name"
          placeholder="Введите название"
          onChange={(e) => {
            setName(e.target.value);
            toggleButtonState();
          }}
          value={name}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Категория</p>
        <input
          className="modal__input"
          type="text"
          id="product-category"
          placeholder="Введите категорию"
          onChange={(e) => {
            setCategory(e.target.value);
            toggleButtonState();
          }}
          value={category}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Фото</p>
        <input
          className="modal__input modal__input_file"
          type="file"
          id="product-photo"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setPhoto(e.target.files[0]);
            toggleButtonState();
          }}
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Бренд</p>
        <input
          className="modal__input"
          type="text"
          id="product-brand"
          placeholder="Введите бренд"
          onChange={(e) => {
            setBrand(e.target.value);
            toggleButtonState();
          }}
          value={brand}
          required
        />
      </label>


      <label className="modal__label">
        <p className="modal__label-text">Цвет</p>
        <input
          className="modal__input"
          type="text"
          id="product-color"
          placeholder="Введите название цвета"
          onChange={(e) => {
            setColor(e.target.value);
            toggleButtonState();
          }}
          value={color}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Тип продукта (для цвета)</p>
        <input
          className="modal__input"
          type="text"
          id="product-color-type"
          placeholder="Введите тип"
          onChange={(e) => {
            setType(e.target.value);
            toggleButtonState();
          }}
          value={type}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Цвет (для выбора)</p>
        <input
          className="modal__input modal__input_file"
          type="color"
          id="product-color-image"
          onChange={(e) => {
            setColorImage(e.target.value);
            toggleButtonState();
          }}
        />
      </label>


      <label className="modal__label">
        <p className="modal__label-text">Цена</p>
        <input
          className="modal__input"
          type="number"
          id="product-price"
          onChange={(e) => {
            setPrice(e.target.value);
            toggleButtonState();
          }}
          value={price}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Страна производства</p>
        <input
          className="modal__input"
          type="text"
          id="product-country"
          placeholder="Введите страну"
          onChange={(e) => {
            setCountry(e.target.value);
            toggleButtonState();
          }}
          value={country}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Объём / вес</p>
        <input
          className="modal__input"
          type="text"
          id="product-size"
          placeholder="Введите размер"
          onChange={(e) => {
            setSize(e.target.value);
            toggleButtonState();
          }}
          value={size}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Артикул</p>
        <input
          className="modal__input"
          type="number"
          id="product-article"
          onChange={(e) => {
            setArticle(e.target.value);
            toggleButtonState();
          }}
          value={article}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Штрихкод</p>
        <input
          className="modal__input"
          type="number"
          id="product-barcode"
          onChange={(e) => {
            setBarcode(e.target.value);
            toggleButtonState();
          }}
          value={barcode}
          required
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Описание</p>
        <textarea
          className="modal__textarea"
          id="product-description"
          placeholder="Описание продукта"
          onChange={(e) => {
            setDescription(e.target.value);
            toggleButtonState();
          }}
          value={description}
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Способ применения</p>
        <textarea
          className="modal__textarea"
          id="product-appliance"
          placeholder="Способ применения"
          onChange={(e) => {
            setAppliance(e.target.value);
            toggleButtonState();
          }}
          value={appliance}
        />
      </label>

      <label className="modal__label">
        <p className="modal__label-text">Состав</p>
        <textarea
          className="modal__textarea"
          id="product-composition"
          placeholder="Состав продукта"
          onChange={(e) => {
            setComposition(e.target.value);
            toggleButtonState();
          }}
          value={composition}
        />
      </label>
    </FormModal>
  );
}

export default NewProductModal;
