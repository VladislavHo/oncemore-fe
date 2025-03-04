import { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { UserContext } from "../../../contexts/UserContext";
import { NavLink, useSearchParams } from "react-router-dom";
import UserAvatar from "../../UserAvatar/UserAvatar";
import Video from "../../Video/Video";

export default function Profile(props) {
  const [orders, setOrders] = useState([]);
  const searchParams = useSearchParams();
  const id = searchParams[0].get("id");
  const isMe = useContext(UserContext).user._id == id;
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // if (!userData) return;
    props.getUser(id)
      .then((res) => setUserData(res.data));
    setVideos(props.videos
      .filter((data) => data.author == id));

    props.loadOrders()
      .then((res) => setOrders(res));
  }, []);

  return (
    <>
      {
        userData && (
          <main className="profile">
            <div className="profile__header">
              <div className="profile__user">
                <UserAvatar
                  userData={userData}
                >
                  {
                    // isMe ? "" : 
                    // <button className="avatar__user-button"/>
                  }
                </UserAvatar>
                <h2 className="profile__name">{userData.name}</h2>

                {

                  <button className="profile__edit-button"
                    onClick={props.openUserModal}
                  />

                }
              </div>
              {
                orders.length !== 0 &&
                <button className="profile__review-button"
                  onClick={props.openVideoModal}
                >
                  Новый обзор
                </button>

              }
            </div>
            <div className="profile__videos">
              {
                videos.map((video, i) =>
                  <Video
                    data={video}
                    key={`video-${i}`}
                    getProduct={props.getProduct}
                    isSmall={props.isOnMobile}
                  />
                )
              }
            </div>
          </main>
        )
      }

    </>
  );
}