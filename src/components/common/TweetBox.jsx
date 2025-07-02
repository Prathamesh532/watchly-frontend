import { Smile, ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { getTimeAgo } from "../../utils/timeUtils";
import { UserDetail } from "../../store/userDux";

const TweetBox = ({ data }) => {
  const [isReply, setIsReply] = useState(false);
  const [isCommentFocus, setIsCommentFocus] = useState(false);
  const [comment, setComment] = useState("");

  const userData = UserDetail();

  const handleCancelReply = () => {
    setIsReply(false);
    setIsCommentFocus(false);
  };

  return (
    <div className="space-y-4 my-2 mx-2 hover:scale-102 cursor-pointer">
      {data && (
        <div className="flex justify-items-start items-center bg-[#181818] p-4 rounded-lg shadow-md border-gray-700">
          {/* Avatar */}
          <div className="w-[50px] h-[50px]">
            <img
              src={data.owner.avatar}
              alt="User Avatar"
              className="w-full h-full rounded-full"
            />
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                {data.owner.fullname}
              </span>
              <span className="text-gray-400 text-sm">
                {getTimeAgo(data.createdAt)}
              </span>
            </div>

            <p className="text-gray-300 mt-1">{data.content}</p>

            {/* Actions */}
            <div className="flex items-center mt-3 space-x-4 text-gray-400">
              <button className="flex items-center space-x-1 hover:text-white">
                <ThumbsUp size={18} />
              </button>
              <button className="flex items-center space-x-1 hover:text-white">
                <ThumbsDown size={18} />
              </button>
              <button
                className="flex items-center space-x-1 hover:text-white hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => setIsReply(true)}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {isReply && (
        <div className="lg:w-1/3 bg-gray-900 p-4 rounded-lg">
          {/*  add comment  */}
          <div className="flex w-full gap-4">
            <div className="flex  gap-4">
              <img
                src={userData.avatar}
                alt={userData.username}
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
                  <div>
                    <Smile />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                      onClick={handleCancelReply}
                    >
                      Cancel
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-300">
                      Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetBox;
