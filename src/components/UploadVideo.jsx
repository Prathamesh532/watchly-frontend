import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadVideo, UserVideos } from "../store/videoDux";
import { X } from "lucide-react";
import { setCustomLoading } from "../store/commonDux";
import VideoCard from "./VideoCard";
import LoadingSpinner from "./LoadingSpinner";

const UploadVideo = () => {
  const dispatch = useDispatch();

  const userVideos = UserVideos();
  console.log("userVideos", userVideos);
  

  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handelClose = () => {
    setIsVideoUploading(false);
    setVideoFile(null);
    setThumbnailFile(null);
    setTitle("");
    setDescription("");
    setVideoPreview(null);
    setThumbnailPreview(null);
  };

  const handelVideoUpload = () => {
    if (!title || !description) {
      console.error("Title or description is missing");
      return;
    }
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("video", videoFile);
    fd.append("thumbnail", thumbnailFile);

    dispatch(setCustomLoading(true));
    dispatch(uploadVideo(fd)).then((res) => {
      console.log("res", res);
      if (res.type.includes("fulfilled")) {
        handelClose();
      }
      dispatch(setCustomLoading(false));
    });
  };

  useEffect(() => {
    if (userVideos?.length > 0) {
      setIsLoading(false);
    }
  }, [userVideos]);

  return (
    <div>
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
      <div className="upload_video_header">
        <button
          className="upload_video_button"
          onClick={() => setIsVideoUploading(true)}
        >
          Upload
        </button>
      </div>

      {isVideoUploading && (
        <div className="modal-overlay">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">Upload Video</h2>
              <button
                className="text-gray-500 hover:text-red-500 transition"
                onClick={handelClose}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col gap-3">
              <label className="relative flex justify-center items-center w-full bg-gray-200 py-2 rounded-md cursor-pointer hover:bg-gray-300 transition">
                Select Video
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleVideoChange}
                />
              </label>
              {/* Video Preview */}
              {videoPreview && (
                <video
                  className="mt-2 w-full rounded-md"
                  controls
                  src={videoPreview}
                />
              )}
              <label className="relative flex justify-center items-center w-full bg-gray-200 py-2 rounded-md cursor-pointer hover:bg-gray-300 transition">
                Select Thumbnail
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleThumbnailChange}
                />
              </label>
              {/* Thumbnail Preview */}
              {thumbnailPreview && (
                <img
                  className="mt-2 w-full h-40 object-cover rounded-md"
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                />
              )}

              <button
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                onClick={handelVideoUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {userVideos?.length > 0 ? (
        <div className="">
          <VideoCard data={userVideos} />
        </div>
      ) : (
        <div className="text-white w-full text-4xl text-center">
          No Video Uploaded
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
