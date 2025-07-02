import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addVideoToPlaylist,
  createPlaylist,
  getPlaylist,
  removeVideoFromPlaylist,
  updatePlaylistDetails,
} from "../store/videoDux";
import { setCustomLoading } from "../store/commonDux";
import VideoListCard from "./common/VideoListCard";

const PlaylistModal = ({
  isOpen,
  onClose,
  mode = "create", // "create" or "edit"
  initialData = null,
  userVideos = [],
  userId,
}) => {
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [selectedVideoIds, setSelectedVideoIds] = useState([]);
  const [addVideoModalOpen, setAddVideoModalOpen] = useState(false);

  const dispatch = useDispatch();
  const isEditMode = mode == "edit" && initialData;

  console.log("initialData>>", initialData);
  console.log("mode>>", mode);
  console.log("userId>>", userId);

  // Initialize form data based on mode
  useEffect(() => {
    if (isEditMode) {
      setPlaylistTitle(initialData.name || "");
      setPlaylistDescription(initialData.description || "");
      setVisibility(initialData.visibility || "public");
      setSelectedVideoIds(initialData.videoDetails?.map((v) => v._id) || []);
    } else {
      // Reset form for create mode
      setPlaylistTitle("");
      setPlaylistDescription("");
      setVisibility("public");
      setSelectedVideoIds([]);
    }
  }, [isEditMode, initialData, isOpen]);

  const handleSubmit = async () => {
    console.log("inside handleSubmit");

    if (!playlistTitle.trim()) {
      alert("Please enter a playlist title");
      return;
    }

    const playlistData = {
      name: playlistTitle,
      description: playlistDescription,
      visibility,
      videos: selectedVideoIds,
    };

    const updatedTitleOrDesc =
      playlistTitle !== initialData.name ||
      playlistDescription !== initialData.description;

    const previousVideoIds = initialData.videoDetails?.map((v) => v._id) || [];
    const currentVideoIds = selectedVideoIds;

    // Videos to add and remove
    const videosToAdd = currentVideoIds.filter(
      (id) => !previousVideoIds.includes(id)
    );
    const videosToRemove = previousVideoIds.filter(
      (id) => !currentVideoIds.includes(id)
    );

    console.log("videosToAdd>>", videosToAdd);
    console.log("videosToRemove>>", videosToRemove);

    try {
      if (isEditMode) {
        // 1. Update title/description
        if (updatedTitleOrDesc) {
          dispatch(setCustomLoading(true));
          dispatch(
            updatePlaylistDetails({
              _id: initialData._id,
              name: playlistTitle,
              description: playlistDescription,
            })
          ).then((res) => {
            dispatch(setCustomLoading(false));
            onClose();
          });
        }

        // 2. Add videos
        if (videosToAdd.length) {
          dispatch(setCustomLoading(true));
          for (const videoId of videosToAdd) {
            dispatch(
              addVideoToPlaylist({
                playlist_id: initialData._id,
                video_id: videoId,
              })
            ).then((res) => {
              dispatch(setCustomLoading(false));
            });
          }
          onClose();
        }

        // 3. Remove videos
        if (videosToRemove.length) {
          console.log("inside videosToRemove>>", videosToRemove);

          dispatch(setCustomLoading(true));
          for (const videoId of videosToRemove) {
            console.log("videoId>>", videoId);
            dispatch(setCustomLoading(true));
            dispatch(
              removeVideoFromPlaylist({
                playlist_id: initialData._id,
                video_id: videoId,
              })
            ).then((res) => {
              console.log("res>>", res);
            });
          }
          onClose();
        }

        // if (updatedTitleOrDesc || videosToAdd.length || videosToRemove.length) {
        //   dispatch(getPlaylist({ userId }));
        //   onClose();
        // }
        dispatch(getPlaylist({ userId }));
      } else {
        result = dispatch(createPlaylist(playlistData));
      }
    } catch (error) {
      console.error("Error saving playlist:", error);
    } finally {
      dispatch(setCustomLoading(false));
    }
  };

  const handleVideoRemove = (videoToRemove) => {
    if (isEditMode) {
      setSelectedVideoIds((prev) =>
        prev.filter((id) => id !== videoToRemove._id)
      );
    }
  };

  const getSelectedVideosForEdit = () => {
    const selectedFromUser = userVideos.filter((video) =>
      selectedVideoIds.includes(video._id)
    );

    const selectedFromInitial =
      initialData?.videoDetails?.filter((video) =>
        selectedVideoIds.includes(video._id)
      ) || [];

    const all = [...selectedFromUser, ...selectedFromInitial];

    // Remove duplicates
    const uniqueMap = new Map();
    for (const v of all) uniqueMap.set(v._id, v);

    return Array.from(uniqueMap.values());
  };

  const getTitle = () => {
    return isEditMode ? "Edit playlist" : "Create a new playlist";
  };

  const getSubmitButtonText = () => {
    return isEditMode ? "Update" : "Create";
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="bg-[#181818] w-full max-w-2xl p-6 rounded-lg shadow-lg max-h-[80%] overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <h2 className="text-lg font-semibold text-white">{getTitle()}</h2>
            <button
              className="p-2 rounded-full hover:bg-gray-700"
              onClick={onClose}
            >
              <X size={20} color="#ffffff" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 mt-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Title (required)
              </label>
              <textarea
                className="w-full bg-[#212121] text-gray-300 p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Add title"
                rows="2"
                value={playlistTitle}
                onChange={(e) => setPlaylistTitle(e.target.value)}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full bg-[#212121] text-gray-300 p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Add description"
                rows="4"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
              />
            </div>

            {/* Visibility Select */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Visibility
                </label>
                <select
                  className="w-full bg-[#212121] text-gray-300 p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* Videos Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300">Videos</h3>
              <p className="text-gray-400 text-xs">
                {isEditMode
                  ? "Manage videos in your playlist."
                  : "Choose existing videos to add to your playlist."}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                onClick={() => setAddVideoModalOpen(true)}
              >
                {isEditMode ? "Manage videos" : "Add videos"}
              </button>

              {selectedVideoIds.length > 0 && (
                <p className="text-gray-400 text-xs mt-1">
                  {selectedVideoIds.length} video(s) selected
                </p>
              )}
            </div>

            {/* Show selected videos in edit mode */}
            {isEditMode && selectedVideoIds.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Current Videos
                </h4>
                <VideoListCard
                  data={getSelectedVideosForEdit()}
                  onClose={() => {}}
                  isEdit={true}
                  handleVideoRemove={handleVideoRemove}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              className="px-5 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-700"
              onClick={handleSubmit}
              disabled={!playlistTitle.trim()}
            >
              {getSubmitButtonText()}
            </button>
          </div>
        </div>
      </div>

      {/* Add/Manage Video Modal */}
      {addVideoModalOpen && (
        <div className="modal-overlay">
          <div className="bg-[#181818] w-full max-w-[450px] p-6 rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <h2 className="text-lg font-semibold text-white">
                {isEditMode
                  ? "Manage Playlist Videos"
                  : "Add Videos to Playlist"}
              </h2>
              <button
                className="p-2 rounded-full hover:bg-gray-700"
                onClick={() => setAddVideoModalOpen(false)}
              >
                <X size={20} color="#ffffff" />
              </button>
            </div>

            {/* Video List */}
            <div className="space-y-4 mt-4 flex flex-col border-b border-gray-700 pb-4">
              <VideoListCard
                data={userVideos}
                setSelectedVideoIds={setSelectedVideoIds}
                onClose={setAddVideoModalOpen}
                preSelectedIds={selectedVideoIds}
                isEdit={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistModal;
