import React, { useState } from "react";
import {
  Video,
  PlayCircle,
  MoreVertical,
  Save,
  Share2,
  PlayIcon,
  ArrowLeft,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import VideoListCard from "./VideoListCard";
import { deletePlaylist, UserVideos } from "../../store/videoDux";
import { useDispatch } from "react-redux";
import { setCustomLoading } from "../../store/commonDux";
import PlaylistModal from "../PlaylistModal";
import { UserDetail } from "../../store/userDux";

const PlaylistCard = ({ playlist, isExpanded, onExpand }) => {
  // Extract the first video thumbnail for the playlist thumbnail
  // const playlistThumbnail = playlist.videoDetails[0]?.thumbnail || "";
  // const videoCount = playlist.videoDetails.length;

  // // Calculate total duration of all videos
  // const totalDuration = playlist.videoDetails.reduce(
  //   (total, video) => total + (video.duration || 0),
  //   0
  // );

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistOptionsOpen, setPlaylistOptionsOpen] = useState(false);
  const [isPlaylistEdit, setIsPlaylistEdit] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userVideos = UserVideos() || [];
  const userDetail = UserDetail() || {};

  // Format duration to minutes:seconds
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const handleVideoClick = (video) => {
    console.log("video>>", video);
    const _id = video._id;
    navigate(`/video/${_id}`, { state: { video } });
  };

  const handlePlayListEdit = () => {
    setIsPlaylistEdit(true);
  };

  const handelPlayListDelete = (_id) => {
    dispatch(setCustomLoading(true));
    dispatch(deletePlaylist(_id)).then((res) => {
      if (res.type.includes("fulfilled")) {
        setSelectedPlaylist(null);
      }
      dispatch(setCustomLoading(false));
    });
  };

  if (selectedPlaylist) {
    return (
      <div className="bg-black text-white min-h-screen">
        {/* Header with back button and playlist name */}
        <div className="bg-black sticky top-0 z-10 border-b border-gray-800">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center">
            <button
              className="mr-4 hover:bg-gray-800 p-2 rounded-full"
              onClick={() => setSelectedPlaylist(null)}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">{selectedPlaylist.name}</h1>
          </div>
        </div>

        {/* Playlist info section */}
        <div className="bg-black">
          <div className="max-w-screen-xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6 py-4">
              {/* Playlist thumbnail */}
              <div className="w-full md:w-64 h-36 md:h-40 rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={
                    selectedPlaylist?.videoDetails?.[0]?.thumbnail ||
                    "/api/placeholder/320/180"
                  }
                  alt={selectedPlaylist.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Playlist details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedPlaylist.name}
                </h2>
                <p className="text-gray-400 mb-2">
                  {selectedPlaylist.description}
                </p>
                <div className="flex items-center text-gray-400 mb-1">
                  <span className="mr-2">
                    By {selectedPlaylist.owner.username}
                  </span>
                  <span className="mr-2">•</span>
                  <span>
                    {selectedPlaylist.videoCount}{" "}
                    {selectedPlaylist.videoCount === 1 ? "video" : "videos"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="bg-white text-black px-4 py-2 rounded-full font-medium flex items-center">
                    <PlayIcon size={18} className="mr-2" fill="black" />
                    Play all
                  </button>
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium flex items-center">
                    <Share2 size={18} className="mr-2" />
                    Share
                  </button>
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium flex items-center">
                    <Save size={18} className="mr-2" />
                    Save
                  </button>

                  <div className="relative">
                    <button
                      className="bg-gray-800 text-white p-2 rounded-full"
                      onClick={() =>
                        setPlaylistOptionsOpen(!playlistOptionsOpen)
                      }
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Playlist options dropdown */}
                    {playlistOptionsOpen && (
                      <div className="absolute right-[-12] mt-2 w-32 bg-gray-900 shadow-lg rounded-lg overflow-hidden z-100">
                        <button
                          className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700"
                          onClick={() => {
                            handlePlayListEdit();
                            setPlaylistOptionsOpen(false);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                          onClick={() => {
                            // setCommentOptions(null);
                            handelPlayListDelete(selectedPlaylist._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPlaylistEdit && (
          <PlaylistModal
            isOpen={true}
            onClose={() => setIsPlaylistEdit(false)}
            mode="edit"
            initialData={selectedPlaylist}
            userVideos={userVideos}
            userId={userDetail?._id}
          />
        )}

        {/* Video list */}
        <div className="max-w-screen-xl mx-auto px-4 pb-8">
          <div className="divide-y divide-gray-800">
            {selectedPlaylist?.videoDetails?.map((video, index) => (
              <div
                key={video._id}
                className="py-2 flex gap-4 hover:bg-gray-900 p-2 rounded-lg cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                {/* Video number and thumbnail */}
                <div className="flex-shrink-0 relative group">
                  <div className="absolute left-2 top-2 bg-black bg-opacity-70 px-2 py-1 rounded text-sm z-10">
                    {index + 1}
                  </div>

                  <div class="relative w-40 h-24 overflow-hidden rounded-lg">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 px-1 py-0.5 rounded text-xs">
                    {formatDuration(video.duration)}
                  </div>

                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/40 flex items-center justify-center transition-all duration-200">
                    <PlayCircle
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      size={32}
                    />
                  </div>
                </div>

                {/* Video info */}
                <div className="flex-1">
                  <h3 className="font-medium text-white line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="text-gray-400 text-sm mt-1">
                    {video.owner.fullname}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <span>{formatViews(video.views)} views</span>
                    <span>•</span>
                    <span>{video.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main playlist cards horizontally scrollable view
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Your Playlists</h2>

        {/* Horizontal scrolling container */}
        <div className="flex overflow-x-auto py-2 gap-4 pb-4 hide-scrollbar">
          {playlist?.map((playlist) => (
            <div
              key={playlist._id}
              className="flex-shrink-0 w-64 cursor-pointer"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              {/* Playlist card */}
              <div className="rounded-lg overflow-hidden bg-gray-900 hover:bg-gray-800 transition-all duration-200">
                {/* Thumbnail with video count */}
                <div className="relative">
                  <img
                    src={
                      playlist?.videoDetails?.[0]?.thumbnail ||
                      "/api/placeholder/320/180"
                    }
                    alt={playlist.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded-sm flex items-center">
                    <Video size={14} className="mr-1" />
                    <span className="text-xs">{playlist.videoCount}</span>
                  </div>
                </div>

                {/* Playlist info */}
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {playlist.name}
                  </h3>
                  <div className="flex items-center text-gray-400 text-xs">
                    <span>View full playlist</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for hiding scrollbar but allowing scroll */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PlaylistCard;
