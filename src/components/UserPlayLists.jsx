import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPlaylist, UserPlaylists, UserVideos } from "../store/videoDux";
import { UserDetail } from "../store/userDux";
import PlaylistCard from "./common/PlaylistCard";
import PlaylistModal from "../components/PlaylistModal";

const UserPlayLists = () => {
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [playlistModalMode, setPlaylistModalMode] = useState("create");
  const [selectedPlaylistData, setSelectedPlaylistData] = useState(null);

  const dispatch = useDispatch();
  const userVideos = UserVideos() || [];
  const playlists = UserPlaylists() || [];
  const userDetail = UserDetail() || {};

  useEffect(() => {
    if (userDetail?._id) {
      dispatch(getPlaylist({ userId: userDetail._id }));
    }
  }, [dispatch, userDetail?._id]);

  const handleCreatePlaylist = () => {
    setPlaylistModalMode("create");
    setSelectedPlaylistData(null);
    setPlaylistModalOpen(true);
  };

  const handleEditPlaylist = (playlist) => {
    setPlaylistModalMode("edit");
    setSelectedPlaylistData(playlist);
    setPlaylistModalOpen(true);
  };

  const handleCloseModal = () => {
    setPlaylistModalOpen(false);
    setSelectedPlaylistData(null);
    setPlaylistModalMode("create");
  };

  return (
    <div>
      {/* Header with Create Button */}
      <div className="flex justify-end items-center w-full m-[4px] py-3 px-3 border-b border-zinc-800">
        <button
          className="bg-[#ae7aff] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#9c6bff] transition-colors duration-200"
          onClick={handleCreatePlaylist}
        >
          New PlayList
        </button>
      </div>

      {/* Playlist Modal */}
      {/* <PlaylistModal
        isOpen={playlistModalOpen}
        onClose={handleCloseModal}
        mode={playlistModalMode}
        initialData={selectedPlaylistData}
        userVideos={userVideos}
        userId={userDetail?._id}
      /> */}

      {/* Create Playlist Modal */}
      {playlistModalOpen && (
        <PlaylistModal
          isOpen={true}
          onClose={handleCloseModal}
          mode="create"
          userVideos={userVideos}
          userId={userDetail?._id}
        />
      )}

      {/* Playlists Display */}
      {playlists?.length > 0 && (
        <PlaylistCard
          playlist={playlists}
          onExpand={(playlistId) => {
            // Handle expand logic if needed
          }}
          onEdit={handleEditPlaylist} // Pass edit handler to PlaylistCard
        />
      )}

      {playlists?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
            <p className="text-sm mb-4">
              Create your first playlist to organize your videos
            </p>
            <button
              className="bg-[#ae7aff] text-white px-6 py-2 rounded cursor-pointer hover:bg-[#9c6bff] transition-colors duration-200"
              onClick={handleCreatePlaylist}
            >
              Create Playlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPlayLists;
