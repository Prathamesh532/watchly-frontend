import React, { useEffect } from "react";
import { getUserLikedVideos, UserLikedVideo } from "../store/videoDux";
import { useDispatch } from "react-redux";
import VideoCard from "./VideoCard";

const UserLikeVideos = () => {
  const dispatch = useDispatch();
  const likeVideos = UserLikedVideo();

  useEffect(() => {
    dispatch(getUserLikedVideos());
  }, []);

  return (
    <section>
      <div className="">
        <VideoCard data={likeVideos} />
      </div>
    </section>
  );
};

export default UserLikeVideos;
