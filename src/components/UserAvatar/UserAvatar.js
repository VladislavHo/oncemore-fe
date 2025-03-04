import "./UserAvatar.css";

export default function UserAvatar(props) {
  if (!props.userData)
    return;

  function getFirstLetter(username) {
    return username[0];
  }

  const {avatar, name} = props.userData;

  if(!name) return;

  return (
    <div className="avatar">
      <div className="avatar__container">
        <img className="avatar__image"
          src={avatar}
          crossOrigin=""
          alt={getFirstLetter(name)}
        />
      </div>
      {props.children}
    </div>
  );
}