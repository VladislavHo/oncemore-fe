import { useContext, useState } from "react";
import "./Comment.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import { UserContext } from "../../contexts/UserContext";

export default function Comment(props) {
  const { data, likeComment } = props;
  const [author, setAuthor] = useState(null);
  useState(() => {

    console.log(data);
    if (!data.author) return;

    props.getUser(data.author)
      .then((user) => setAuthor(user.data));
  }, [data]);

  const isAdmin = useContext(UserContext).user.privilege >= 1;

  if (!author) return;

  return (
    <div className="comment">
      <UserAvatar
        userData={author}
      />
      <div className="comment__container">
        <p className="comment__author">{author.name}</p>
        <p className="comment__text">{data.text}</p>
        {
          isAdmin? 
          <div className="comment__admin">
            <button className="player__admin-button"
              onClick={() => props.deleteComment(data)}
            >
              Удалить комментарий
            </button>
            <button className="player__admin-button"
              onClick={() => props.blockUser(author)}
            >
              Заблокировать пользователя
            </button>
          </div>
          : ""
        }
        {/* <button className="comment__like"
          onClick={likeComment}
        /> */}
      </div>
    </div>
  );
}