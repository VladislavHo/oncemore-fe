import UserAvatar from "../UserAvatar/UserAvatar";

import ("./Review.css");

export default function Review(props) {
  const { isVideo, videoData, author } = props;
  const { text, views } = videoData;

  return (
    <div className="review">
      <div className="review__main">
        <div className="review__author">
          <UserAvatar
            userData={author}
          >
            <button className="avatar__user-button"/>
          </UserAvatar>
          <div className="review__author__info">
            <h2 className="review__username">
              {author.name}
            </h2>
            <p className="review__views">
              {views} просмотров
            </p>
          </div>
        </div>
        <p className="review__text">
          {text}
        </p>
      </div>
    </div>
  );
}