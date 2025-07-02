import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { useNavigate } from "react-router-dom";
import { formatDuration, getTimeAgo } from "../utils/timeUtils";

const VideoCard = ({ data = [] }) => {
  const [playVideo, setPlayVideo] = useState(false);
  const navigate = useNavigate();

  console.log("data>>", data);

  const handleVideoClick = (video) => {
    setPlayVideo(true);
    if (video._id) navigate(`/video/${video._id}`, { state: { video } });
    if (video.videoId)
      navigate(`/video/${video.videoId}`, { state: { video } });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.isArray(data) &&
          data?.map((video) => (
            <div
              key={video?.videoId || video?._id}
              onClick={() => handleVideoClick(video)}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {/* Thumbnail Section */}
              <div className="relative">
                <img
                  src={video?.videoThumbnail || video?.thumbnail}
                  alt={video?.videoTitle || video?.title}
                  className="w-full h-48 md:h-52 lg:h-60 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video?.videoDuration || video?.duration)}
                </span>
              </div>

              {/* Video Details */}
              <div className="p-3">
                <div className="flex items-start space-x-3">
                  <img
                    src={video?.avatar || video?.userData?.avatar}
                    alt={video?.username || video?.userData?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white line-clamp-2">
                      {video?.videoTitle || video?.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {video?.fullname}
                    </p>
                  </div>
                </div>

                {/* Video Metrics */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>
                    {(video?.videoViews || video?.views)?.toLocaleString()}{" "}
                    Views
                  </span>
                  <span className="text-gray-500">•</span>
                  <span>{getTimeAgo(video.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {playVideo && <VideoPlayer />}
    </>
  );
};

export default VideoCard;
