import { useState } from "react";
import Comment from "../Comment/Comment";
import "./Comments.css";

export default function Comments(props) {
  function sendComment()
  {
    props.sendComment(newComment)
      .then(() => {
        setNewComment("");
        setNewCommentEmpty(true);
      });
  }

  const { comments } = props;
  const [newComment, setNewComment] = useState("");
  const [newCommentEmpty, setNewCommentEmpty] = useState(true);

  return (
    <div className="comments">
      <div className="comments__header">
        <h2 className="comments__title">
          Комментарии ({comments.length})
        </h2>
        <button className="comments__close"
          onClick={() => props.setCommentsOpen(false)}
        />
      </div>
      <div className="comments__main">
        {
          comments.map((comment, i) =>
            <Comment
              key={`comment-${i}`}
              data={comment}
              getUser={props.getUser}
              deleteComment={props.deleteComment}
              likeComment={props.likeComment}
            />
          )
        }
      </div>
      <div className="comments__new">
        <input className="comments__input"
          type="text"
          placeholder="Напишите свой комментарий..."
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
            setNewCommentEmpty(e.target.value.length == 0);
          }}
        />
        <button className={`comments__send 
            ${newCommentEmpty ? "" : "comments__send_visible"}`}
          onClick={sendComment}
        />
      </div>
    </div>
  );
}