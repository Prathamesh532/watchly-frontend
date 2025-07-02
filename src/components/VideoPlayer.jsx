import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  channelSubscribeToggle,
  getUserById,
  UserSubscribedChannels,
} from "../store/userDux";
import {
  getVideoById,
  isVideoLikedbyUser,
  videoLikeToogle,
  videoViewIncrement,
} from "../store/videoDux";
import { EllipsisVertical, Smile, ThumbsUp } from "lucide-react";
import {
  addVideoComment,
  deleteVideoComment,
  getVideoComments,
  updateVideoComment,
  videoComment,
} from "../store/commentDux";
import { setCustomLoading } from "../store/commonDux";
import { getTimeAgo } from "../utils/timeUtils";
import EmojiPicker from "emoji-picker-react";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-700 animate-pulse rounded ${className}`} />
);

const VideoPlayer = () => {
  const { _id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emojiPickerRef = useRef(null);

  const videoComments = videoComment(_id);
  const userSubscribedChannels = UserSubscribedChannels();

  const [user, setUser] = useState(null);
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState("");
  const [isCommentFocus, setIsCommentFocus] = useState(false);
  const [commentOptions, setCommentOptions] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [isChannelSubscribed, setIsChannelSubscribed] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  // calcate channel subscribed or not
  useEffect(() => {
    if (userSubscribedChannels && userSubscribedChannels?.length > 0) {
      const isSubscribe = userSubscribedChannels?.map((channel) => {
        return channel.channel_id === user?._id;
      });

      setIsChannelSubscribed(isSubscribe);
    }
  }, [userSubscribedChannels, user]);

  // TODO _id is not persent initaily
  useEffect(() => {
    dispatch(getVideoById({ videoId: _id }))
      .then((res) => {
        if (res.payload?.error?.includes("TokenExpiredError")) {
          navigate("/login");
        } else if (res.type.includes("fulfilled")) {
          setVideo(res.payload?.data);
          setIsLoading(false);

          dispatch(getUserById({ userId: res.payload?.data?.owner })).then(
            (res) => {
              if (res.type.includes("fulfilled")) {
                setUser(res.payload?.data);
              }
            }
          );

          dispatch(videoViewIncrement({ videoId: res.payload?.data?._id }));
          dispatch(getVideoComments({ videoId: _id }));
        } else {
          setIsError(true);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  // set default like
  useEffect(() => {
    dispatch(isVideoLikedbyUser({ videoId: _id })).then((res) => {
      if (res.type.includes("fulfilled")) {
        console.log("res", res);
        setIsLike(res.payload?.isLikedOrNot);
      }
    });
  }, [video, user]);

  // comment on video
  const handelCommentSubmit = async () => {
    dispatch(setCustomLoading(true));
    dispatch(
      addVideoComment({ content: comment, video: _id, owner: user?._id })
    ).then((res) => {
      if (res.type.includes("fulfilled")) {
        setComment("");
        setIsCommentFocus(false);
      }
      dispatch(setCustomLoading(false));
    });
  };

  // delete comment
  const handelCommentDelete = async (commentId) => {
    dispatch(setCustomLoading(true));
    dispatch(deleteVideoComment({ comment_id: commentId })).then((res) => {
      if (res.type.includes("fulfilled")) {
      }
      dispatch(setCustomLoading(false));
    });
  };

  // edit comment
  const handleCommentEdit = (commentId, content) => {
    setEditCommentId(commentId); // Track the specific comment being edited
    setEditedComment(content); // Set the current comment content in state

    setTimeout(() => {
      document.getElementById(`edit-input-${commentId}`)?.focus();
    }, 100); // Auto-focus on input field
  };

  // update comment
  const handleEditComment = async (commentId) => {
    dispatch(setCustomLoading(true));
    dispatch(
      updateVideoComment({ id: commentId, content: editedComment })
    ).then((res) => {
      if (res.type.includes("fulfilled")) {
        setEditCommentId(null); // Reset after update
      }
      dispatch(setCustomLoading(false));
    });
  };

  // toogel channel subscribe
  const handleSubscribe = async () => {
    dispatch(setCustomLoading(true));
    dispatch(channelSubscribeToggle({ channel_id: video?.owner })).then(
      (res) => {
        if (res.type.includes("fulfilled")) {
          console.log("res", res.payload?.message);

          if (res.payload?.message === "Channel Subscribe") {
            setIsChannelSubscribed(true);
          } else if (res.payload?.message === "Channel UnSubscribed") {
            setIsChannelSubscribed(false);
          }
        }
        dispatch(setCustomLoading(false));
      }
    );
  };

  // toogel Like
  const handleLike = async () => {
    dispatch(setCustomLoading(true));
    dispatch(videoLikeToogle({ videoId: _id })).then((res) => {
      if (res.type.includes("fulfilled")) {
        if (res.payload?.message === "Comment Added successfull") {
          setIsLike(true);
        } else if (res.payload?.message === "Un-Liked") {
          setIsLike(false);
        }
      }
      dispatch(setCustomLoading(false));
    });
  };

  const handleEmojiClick = (emojiObject) => {
    setEditedComment((prev) => prev + emojiObject.emoji);
    setIsEmojiOpen(false); // Close picker after selection
  };

  return (
    <section className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
      {isLoading ? (
        <div className="w-full">
          <SkeletonBox className="w-full h-64 mb-4" />
          <SkeletonBox className="h-6 w-2/3 mb-2" />
          <SkeletonBox className="h-5 w-1/3 mb-4" />
          <SkeletonBox className="h-40 w-full" />
        </div>
      ) : isError ? (
        <div className="w-full text-red-500 text-center p-4">
          Something went wrong. Please try again later.
        </div>
      ) : video ? (
        <>
          <div className="lg:w-2/3 flex flex-col gap-4">
            {video?.videoFile && (
              <video controls className="w-full rounded-lg shadow-lg">
                <source src={video?.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <h1 className="text-2xl px-4 font-semibold text-white">
              {video?.title}
            </h1>
            <div className="flex justify-between items-center flex-wrap gap-2.5">
              {user && (
                <div className="flex justify-between items-center flex-wrap gap-4 w-full py-2 px-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar}
                      alt={video?.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-white font-medium">
                      {user?.fullname}
                    </span>
                    <button
                      className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition`}
                      onClick={handleSubscribe}
                    >
                      {isChannelSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                  </div>
                  <div>
                    <button
                      className={`text-black flex items-center justify-between gap-2 ${
                        isLike ? "bg-gray-400" : "bg-gray-200"
                      } py-2 px-4 rounded-2xl w-full cursor-pointer hover:bg-gray-300`}
                      onClick={handleLike}
                    >
                      <ThumbsUp size={20} /> {isLike ? "Unlike" : "Like"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-800 text-white p-4 rounded-lg">
              <div className="flex gap-4 text-gray-400">
                <p>{video?.views} Views</p>
                <p>Uploaded {getTimeAgo(video?.createdAt)}</p>
              </div>
              <p className="mt-2 text-gray-300">{video?.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="lg:w-1/3 bg-gray-900 p-4 rounded-lg">
            {/*  add comment  */}
            <div className="flex w-full gap-4">
              <div className="flex  gap-4">
                <img
                  src={user?.avatar}
                  alt={video?.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div className="w-full">
                <textarea
                  placeholder="Add a comment"
                  className="w-full bg-gray-800 text-white p-2 rounded-lg"
                  onFocus={() => setIsCommentFocus(true)}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                {isCommentFocus && (
                  <div
                    className={`text-white flex justify-between py-2 transition-all duration-300 ease-in-out ${
                      isCommentFocus
                        ? "opacity-100 max-h-20"
                        : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                  >
                    <div className="relative inline-block">
                      {/* Emoji Icon */}
                      <Smile
                        className="cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                      />

                      {/* Emoji Picker */}
                      {isEmojiOpen && (
                        <div
                          ref={emojiPickerRef}
                          className="absolute top-full left-0 mt-2 z-50 bg-gray-900 p-2 rounded-lg shadow-md"
                        >
                          <EmojiPicker
                            theme="dark"
                            searchLabel={false}
                            searchDisabled={false}
                            categoryDisabled={false}
                            onEmojiClick={handleEmojiClick}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                        onClick={() => setIsFocused(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-300"
                        onClick={handelCommentSubmit}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* show comments */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">Comments</h3>
              <div className="mt-4 space-y-4">
                {videoComments?.length > 0 ? (
                  videoComments?.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex gap-4 p-3 bg-gray-800 rounded-lg"
                    >
                      {/* User Avatar */}
                      <img
                        src={user?.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="w-full">
                        {/* User Name & Time */}
                        <div className="flex items-center justify-between relative">
                          <span className="text-white font-medium">
                            {user?.fullname || "Anonymous"}
                          </span>
                          <div className="text-gray-400 text-sm flex items-center gap-1">
                            {getTimeAgo(comment.createdAt)}

                            {/* Three Dots Button */}
                            <div className="relative">
                              <button
                                className="cursor-pointer p-2 hover:bg-gray-700 rounded-full transition"
                                onClick={() =>
                                  setCommentOptions((prev) =>
                                    prev === comment._id ? null : comment._id
                                  )
                                }
                              >
                                <EllipsisVertical className="w-5 h-5 text-gray-400 hover:text-white" />
                              </button>

                              {/* Dropdown Menu */}
                              {commentOptions === comment._id && (
                                <div className="absolute right-0 mt-2 w-32 bg-gray-900 shadow-lg rounded-lg overflow-hidden z-10">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700"
                                    onClick={() => {
                                      setCommentOptions(null);
                                      handleCommentEdit(
                                        comment._id,
                                        comment.content
                                      );
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                                    onClick={() => {
                                      setCommentOptions(null);
                                      handelCommentDelete(comment._id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Comment Content */}
                        {editCommentId === comment._id ? (
                          <div className="mt-2">
                            <input
                              id={`edit-input-${comment._id}`}
                              className="w-full bg-gray-700 text-white p-2 rounded-lg"
                              value={editedComment}
                              onChange={(e) => setEditedComment(e.target.value)}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                onClick={() => handleEditComment(comment._id)}
                              >
                                Update
                              </button>
                              <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
                                onClick={() => setEditCommentId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300 mt-1">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-white text-5xl text-center w-full">
          Something Went Wrong
        </h1>
      )}
    </section>
  );
};

export default VideoPlayer;
