import React, { useEffect, useState } from "react";
import {
  getSubscribedChannels,
  getUserChannelDetails,
  updateAvatar,
  updateCoverImage,
  updateUserDetails,
  UserChannelProfile,
  UserDetail,
} from "../store/userDux";
import { useDispatch } from "react-redux";
import { setCustomLoading } from "../store/commonDux";
import { Upload, UserPen, X } from "lucide-react";
import UploadVideo from "../components/UploadVideo";
import { getUserVideos, UserLikedVideo } from "../store/videoDux";
import UserLikeVideos from "../components/UserLikeVideos";
import UserWatchHistory from "../components/UserWatchHistory";
import UserSubscribedChannel from "../components/UserSubcribedChannels";
import UserTweets from "../components/UserTweets";
import UserPlayLists from "../components/UserPlayLists";
import { useLocation, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const UserProfile = () => {
  let params = useLocation();
  console.log("params", params);

  const [userUpdate, setUserUpdate] = useState(false);
  const [userAvatarUpdate, setUserAvatarUpdate] = useState(false);
  const [userCoverImageUpdate, setUserCoverImageUpdate] = useState(false);
  const [avatarFile, setAvatarFile] = useState();
  const [coverImage, setCoverImage] = useState();
  const [activeTab, setActiveTab] = useState("uploads");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const userData = UserDetail();
  const userProfileData = UserChannelProfile();

  const handelAvatar = () => {
    setUserAvatarUpdate(true);
  };

  const handelUserUpdate = async () => {
    const data = { fullname, email };
    dispatch(setCustomLoading(true));
    dispatch(updateUserDetails(data)).then((res) => {
      console.log(res);
      dispatch(setCustomLoading(false));
    });
  };

  const handelAvatarUpdate = async () => {
    const fd = new FormData();
    fd.append("avatar", avatarFile);

    dispatch(setCustomLoading(true));
    dispatch(updateAvatar(fd)).then((res) => {
      console.log(res);
      if (res.type.includes("fulfilled")) {
        setUserAvatarUpdate(false);
      }
      dispatch(setCustomLoading(false));
    });
  };

  const handelCoverImageUpdate = async () => {
    const fd = new FormData();
    fd.append("coverImage", coverImage);

    dispatch(setCustomLoading(true));
    dispatch(updateCoverImage(fd)).then((res) => {
      console.log(res);
      if (res.type.includes("fulfilled")) {
        setUserCoverImageUpdate(false);
      }
      dispatch(setCustomLoading(false));
    });
  };

  useEffect(() => {
    if (params?.search === "?tab=liked") setActiveTab("like-Video");
    if (params?.search === "?tab=playlists") setActiveTab("playlists");
    if (params?.search === "?tab=channels") setActiveTab("channels");
  }, [params]);

  useEffect(() => {
    if (userData?.username) {
      dispatch(getUserChannelDetails({ username: userData.username }));
    }
    if (userData?._id) {
      dispatch(getSubscribedChannels({ subscriberId: userData._id }));
    }
  }, [userData]); // rerun when userData updates

  useEffect(() => {
    if (userData?._id) {
      dispatch(getUserVideos({ userId: userData._id }));
    }
  }, []);

  return (
    <>
      <div className="user-profile-container">
        <div className="user-profile-cover">
          <img
            className="cover-img"
            src={userData?.coverImage}
            onClick={() => setUserCoverImageUpdate(true)}
            alt="Cover"
          />
        </div>
        <div className="user-profile-avatar">
          <img
            className="avatar-img"
            src={userData?.avatar}
            onClick={handelAvatar}
            alt="Avatar"
          />
          <span className="user-profile-name">{userData?.fullname}</span>
          <span className="user-profile-email">{userData?.email}</span>
        </div>

        <div className="user-stats-container">
          <div className="user-stat-item">
            <span className="stat-count">
              {userProfileData?.userSubsCounts}
            </span>
            <span className="stat-label">Subscribers</span>
          </div>
          <div className="user-stat-item">
            <span className="stat-count">{userProfileData?.userSubsTo}</span>
            <span className="stat-label">Channels Subscribed</span>
          </div>
        </div>

        <div className="user-profile-btn">
          <button
            className="profile-button edit-button"
            onClick={() => setUserUpdate(true)}
          >
            {/* <UserPen size={18} /> */}
            Edit Profile
          </button>
          <button
            className={`profile-button ${
              userProfileData?.isChannelSubscribed
                ? "unsubscribe-button"
                : "subscribe-button"
            }`}
          >
            {userProfileData?.isChannelSubscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>

        <div className="profile-tabs">
          <ul className="tabs-list">
            <li
              className={`tab-item ${activeTab === "uploads" ? "active" : ""}`}
              onClick={() => setActiveTab("uploads")}
            >
              Uploaded Videos
            </li>
            <li
              className={`tab-item ${
                activeTab === "playlists" ? "active" : ""
              }`}
              onClick={() => setActiveTab("playlists")}
            >
              PlayLists
            </li>
            <li
              className={`tab-item ${activeTab === "tweet" ? "active" : ""}`}
              onClick={() => setActiveTab("tweet")}
            >
              Tweets
            </li>
            <li
              className={`tab-item ${activeTab === "channels" ? "active" : ""}`}
              onClick={() => setActiveTab("channels")}
            >
              Subscribed Channels
            </li>
            {/* <li
              className={`tab-item ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveTab("videos")}
            >
              Watch History
            </li> */}
            <li
              className={`tab-item ${
                activeTab === "like-Video" ? "active" : ""
              }`}
              onClick={() => setActiveTab("like-Video")}
            >
              Liked Video
            </li>
          </ul>
          <div className="tab-content">
            {activeTab === "uploads" && <UploadVideo />}
            {activeTab === "channels" && <UserSubscribedChannel />}
            {activeTab === "like-Video" && <UserLikeVideos />}
            {activeTab === "videos" && <UserWatchHistory />}
            {activeTab === "tweet" && <UserTweets />}
            {activeTab === "playlists" && <UserPlayLists />}
          </div>
        </div>

        {/* User details update modal */}
        {userUpdate && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <span className="modal-title">Update Profile</span>
                <button
                  className="close-button"
                  onClick={() => setUserUpdate(false)}
                >
                  <X />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="fullname">Fullname</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-input"
                    placeholder="Updated Fullname"
                    value={fullname}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Updated Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="profile-button primary-button"
                  onClick={handelUserUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User avatar update modal */}
        {userAvatarUpdate && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <span className="modal-title">Update Avatar</span>
                <button
                  className="close-button"
                  onClick={() => setUserAvatarUpdate(false)}
                >
                  <X />
                </button>
              </div>
              <div className="modal-body">
                <div className="image-preview-container">
                  <img
                    className="image-preview"
                    src={userData?.avatar}
                    alt="Avatar Preview"
                  />
                </div>
                <div className="file-upload">
                  <label className="file-input-label">
                    <Upload size={18} style={{ marginRight: "10px" }} />
                    <span>Select New Avatar</span>
                    <input
                      className="hidden-file-input"
                      type="file"
                      name="avatar"
                      onChange={(e) => setAvatarFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="profile-button danger-button">Remove</button>
                <button
                  className="profile-button primary-button"
                  onClick={handelAvatarUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User cover image update modal */}
        {userCoverImageUpdate && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <span className="modal-title">Update Cover Image</span>
                <button
                  className="close-button"
                  onClick={() => setUserCoverImageUpdate(false)}
                >
                  <X />
                </button>
              </div>
              <div className="modal-body">
                <div className="image-preview-container">
                  <img
                    className="image-preview"
                    src={userData?.coverImage}
                    alt="Cover Preview"
                  />
                </div>
                <div className="file-upload">
                  <label className="file-input-label">
                    <Upload size={18} style={{ marginRight: "10px" }} />
                    <span>Select New Cover</span>
                    <input
                      className="hidden-file-input"
                      type="file"
                      name="coverImage"
                      onChange={(e) => setCoverImage(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="profile-button danger-button">Remove</button>
                <button
                  className="profile-button primary-button"
                  onClick={handelCoverImageUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
