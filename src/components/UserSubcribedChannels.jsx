import React, { useState } from "react";
import { UserSubscribedChannels } from "../store/userDux";
import { useDispatch } from "react-redux";
import {
  getUserSubscribedVideos,
  UserSubscribedVideos,
} from "../store/videoDux";
import { setCustomLoading } from "../store/commonDux";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

const UserSubcribedChannels = () => {
  const [showChannelVideos, setShowChannelVideos] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const userSubscribedChannels = UserSubscribedChannels();
  const userSubsVideos = UserSubscribedVideos();

  const handelUserSubscribedChannel = async (channel_id) => {
    setShowChannelVideos(true);
    dispatch(setCustomLoading(true));
    dispatch(getUserSubscribedVideos({ userId: channel_id })).then((res) => {
      if (res.type.includes("fulfilled")) {
      }
      dispatch(setCustomLoading(false));
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
      <section className="w-full p-4 rounded-lg">
        {userSubscribedChannels?.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {userSubscribedChannels.map((channel) => (
              <div
                key={channel.channel_id}
                className="flex flex-col max-w-[100px] items-center cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 md:w-20 md:h-18 rounded-full overflow-hidden">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                    onClick={() =>
                      handelUserSubscribedChannel(channel.channel_id)
                    }
                  />
                </div>
                <h3 className="text-white text-sm text-center mt-2 truncate w-full">
                  {channel.name}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24">
            <span className="text-lg text-gray-400">
              No Subscribed Channels
            </span>
          </div>
        )}
        <div>
          {showChannelVideos && (
            <div className="mt-8 flex flex-wrap gap-6">
              <VideoCard data={userSubsVideos} />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default UserSubcribedChannels;
