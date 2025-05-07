import { useEffect, useRef, useState } from "react";
import FormModal from "../FormModal/FormModal";
import { FormValidator } from "../../../utils/FormValidator";


function parseVideoLink(videoLink) {
  const regex = /clip-(\d+)_(\d+)/;
  let match = videoLink.match(regex);

  if (match) {
    const [_, oid, id] = match;

    return {
      src: `https://vk.com/clip-${oid}_${id}`,
      oid: parseInt(oid),
      id: parseInt(id)
    };
  } else {
    throw new Error("Invalid video link");
  }
}

function VideoModal(props) {
  const [orders, setOrders] = useState([]);
  const [video, setVideo] = useState("");
  const [reviewText, setReviewText] = useState("");


  const [isButtonActive, setButtonActivity] = useState(false);
  const [validator, setValidator] = useState(null);
  const formRef = useRef();
  const [product, setProduct] = useState(null)

  const url = new URL(window.location.href)
  const searchParams = new URLSearchParams(url.search)
  const productId = searchParams.get('id')

  useEffect(() => {
    const filter = productId
    if (url.pathname === '/item') {
      setProduct(filter)
    }
    if (props) {
      const getDataOrders = async () => {
        try {
          const res = await props.loadOrders();
          setOrders(res);
        } catch (error) {
          console.error("Error loading orders:", error);
        }
      };

      getDataOrders();
    }
  }, [props]);

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
    const { src, oid, id } = parseVideoLink(video);

    const videoObj = {
      src, oid, id
    }
    return props.loadVideo(videoObj, product, reviewText)
      .then(props.onClose);

  }



  useEffect(() => {
    enableValidation();
  }, [formRef]);


  return (
    <FormModal
      name={props.name}
      onClose={props.onClose}
      isOpen={props.isOpen}
      title="Новый обзор"
      buttonText="Загрузить"
      formRef={formRef}
      isButtonActive={isButtonActive}
      onSubmit={submit}
    >

      <label className="modal__label">

        <p className="modal__label-text">Ссылка на видео*</p>
        <input
          className="modal__input"
          type="url"
          id="video-link"
          placeholder="https://vk.com/clip-*******_*******"
          onChange={(e) => {
            setVideo(e.target.value);
            toggleButtonState();
          }}
          value={video}
          required
        />
      </label>

      <label className="modal__label">
        {
          url.pathname !== '/item' && (
            <>
              <p className="modal__label-text">Выбрать продукт*</p>
              <select
                className="select__orders"
                onChange={(e) => setProduct(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Выбрать</option>
                {orders && Array.isArray(orders) && orders.map((o, index) => {
                  try {
                    const items = o.items ? JSON.parse(o.items) : [];
                    const orderParse = items[0];
                    if (!orderParse) return null;

                    return (
                      <option key={orderParse._id} value={orderParse._id}>
                        {orderParse.name}
                      </option>
                    );
                  } catch (error) {
                    console.error("Error parsing items:", error);
                    return null;
                  }
                })}
              </select>
            </>

          )
        }


      </label>

      <label className="modal__label">
        <p className="modal__label-text">Текст отзыва</p>
        <textarea
          className="modal__textarea"
          id="video-review"
          placeholder="Ваш отзыв на продукт"
          onChange={(e) => {
            setReviewText(e.target.value);
            toggleButtonState();
          }}
          value={reviewText}
          required
        />
      </label>
    </FormModal>
  );
}

export default VideoModal;
