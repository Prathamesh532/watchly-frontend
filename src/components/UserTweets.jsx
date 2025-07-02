import React, { useEffect, useState } from "react";
import TweetBox from "./common/TweetBox";
import { useDispatch } from "react-redux";
import { getUserTweets, postTweet, UserTweet } from "../store/tweetDux";
import { Plus, SendHorizontal, Smile } from "lucide-react";
import { UserDetail } from "../store/userDux";
import { setCustomLoading } from "../store/commonDux";

const UserTweets = () => {
  const [userTweetContent, setUserTweetContent] = useState("");

  const dispatch = useDispatch();
  const userTweets = UserTweet();
  const userData = UserDetail();

  console.log("userTweets>>>", userTweets);

  const handleTweetPost = async () => {
    dispatch(setCustomLoading(true));
    dispatch(
      postTweet({ content: userTweetContent, owner: userData._id })
    ).then((res) => {
      dispatch(setCustomLoading(false));
      setUserTweetContent("");
    });
  };

  useEffect(() => {
    dispatch(getUserTweets());
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4 p-4 my-4 mx-2 bg-gray-800 rounded-lg shadow-md">
        {/* Avatar */}
        <div className="w-12 h-12">
          <img
            className="w-full h-full rounded-full object-cover"
            src={userData?.avatar}
          />
        </div>

        {/* Input Field */}
        <div className="flex-1">
          <textarea
            className="w-full border border-gray-500 bg-transparent p-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type the Tweet"
            value={userTweetContent}
            onChange={(e) => setUserTweetContent(e.target.value)}
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 text-white">
          <Smile className="cursor-pointer hover:scale-110 transition-transform" />
          <Plus className="cursor-pointer hover:scale-110 transition-transform" />
          <button onClick={handleTweetPost}>
            <SendHorizontal className="cursor-pointer hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
      {userTweets?.length > 0 &&
        userTweets?.map((tweet) => {
          return <TweetBox data={tweet} />;
        })}
    </div>
  );
};

export default UserTweets;
