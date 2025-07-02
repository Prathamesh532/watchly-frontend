import React, { useEffect, useState } from "react";

const VideoListCard = ({
  data = [],
  setSelectedVideoIds,
  onClose,
  isEdit = false,
  handleVideoRemove,
  preSelectedIds = [], // For edit mode, pre-selected video IDs
}) => {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [playlistVideoCount, setPlaylistVideoCount] = useState(0);

  // Initialize selected videos based on preSelectedIds
  useEffect(() => {
    if (preSelectedIds.length > 0 && data.length > 0) {
      const preSelected = data.filter((video) =>
        preSelectedIds.includes(video._id)
      );
      setSelectedVideos(preSelected);
    }
  }, [preSelectedIds, data]);

  useEffect(() => {
    setPlaylistVideoCount(selectedVideos.length);
  }, [selectedVideos]);

  const handleVideoSelect = (video) => {
    setSelectedVideos((prev) => {
      const alreadySelected = prev.find(
        (selected) => selected._id === video._id
      );
      if (alreadySelected) {
        return prev.filter((selected) => selected._id !== video._id);
      } else {
        return [...prev, video];
      }
    });
  };

  const handleVideoSubmit = () => {
    const videoIDS = selectedVideos.map((v) => v._id);
    setSelectedVideoIds(videoIDS);
    onClose(false);
  };

  const isVideoSelected = (video) => {
    return selectedVideos.some((v) => v._id === video._id);
  };

  return (
    <div className="space-y-4">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((video, index) => (
          <div
            key={video._id || index}
            className="flex items-start gap-4 bg-gray-800 shadow-md rounded-lg p-2 hover:bg-gray-700 transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="w-[30%] flex-shrink-0">
              <img
                src={video.thumbnail}
                alt="video thumbnail"
                className="w-full h-auto object-cover rounded-md"
              />
            </div>

            {/* Text container */}
            <div className="w-[65%] flex flex-col justify-between min-w-0">
              <h3 className="text-lg font-semibold text-gray-100 line-clamp-2 mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {video.description}
              </p>
              <div className="text-xs text-gray-500 mt-1">
                {video.duration &&
                  `Duration: ${Math.floor(video.duration / 60)}:${String(
                    video.duration % 60
                  ).padStart(2, "0")}`}
                {video.views && ` • ${video.views} views`}
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-[5%] flex items-center justify-end gap-2 flex-shrink-0">
              {!isEdit && (
                <input
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer transition-all duration-200"
                  type="checkbox"
                  checked={isVideoSelected(video)}
                  onChange={() => handleVideoSelect(video)}
                />
              )}

              {isEdit && (
                <button
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                  onClick={() => handleVideoRemove(video)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {isEdit ? "No videos in this playlist" : "No videos available"}
          </p>
        </div>
      )}

      {/* Footer for selection mode */}
      {!isEdit && (
        <div className="mt-6 flex flex-col items-end gap-2 border-t border-gray-700 pt-4">
          <div className="text-gray-300 text-sm">
            Selected: {playlistVideoCount} video
            {playlistVideoCount !== 1 ? "s" : ""}
          </div>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
            onClick={handleVideoSubmit}
            disabled={selectedVideos.length === 0}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoListCard;
