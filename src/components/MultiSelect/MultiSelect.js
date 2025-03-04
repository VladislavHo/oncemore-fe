import "./MultiSelect.css";
import icon from "../../images/caret-down.svg";
import { useState } from "react";

export default function MultiSelect(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="multiselect">
      <button className={`multiselect__button ${
          isOpen ? "multiselect__button_open" : ""
        }`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {props.title}
        <img className="multiselect__icon"
          src={icon}
        />
      </button>
      <div className={`multiselect__options ${
        isOpen ? "multiselect__options_visible" : ""
      }`}>
        {
          props.options.map((option, i) => 
            <div className="multiselect__option"
              key={`${props.title}-$${i}`}
            >
              <label className="multiselect__label">
                <input className="multiselect__checkbox"
                  type="checkbox"
                  value={option}
                  onChange={() => props.onSelect(option)}
                />
                {option}
              </label>
            </div>
          )
        }
      </div>
    </div>
  );
}