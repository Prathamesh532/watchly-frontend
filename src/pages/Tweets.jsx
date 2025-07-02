import React, { useEffect, useRef, useState } from "react";
import { Plus, SendHorizontal, Smile } from "lucide-react";
import { UserDetail } from "../store/userDux";
import { useDispatch } from "react-redux";
import { AllTweets, getAllTweets, postTweet } from "../store/tweetDux";
import { setCustomLoading } from "../store/commonDux";
import TweetBox from "../components/common/TweetBox";
import EmojiPicker, { Theme } from "emoji-picker-react";

const Tweets = () => {
  const [userTweetContent, setUserTweetContent] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [searchLabel, setSearchLabel] = useState("Procurar emoji");
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [categoryDisabled, setCategoryDisabled] = useState(false);
  const emojiPickerRef = useRef(null);

  const disptach = useDispatch();
  const userData = UserDetail();
  const allTweets = AllTweets() || [];

  const handleTweetPost = async () => {
    disptach(setCustomLoading(true));
    disptach(
      postTweet({ content: userTweetContent, owner: userData._id })
    ).then((res) => {
      disptach(setCustomLoading(false));
    });
  };

  useEffect(() => {
    disptach(
      getAllTweets({ page: 1, limit: 10, sortBy: "createdAt", sortType: "asc" })
    );
  }, []);

  const handleEmojiClick = (emojiObject) => {
    setUserTweetContent((prev) => prev + emojiObject.emoji);
    setIsEmojiOpen(false); // Close picker after selection
  };

  return (
    <div className="m-4">
      {/* input div */}
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md">
        {/* Avatar */}
        <div className="w-12 h-12">
          <img
            className="w-full h-full rounded-full object-cover"
            src={userData.avatar}
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
          <Smile
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setIsEmojiOpen(!isEmojiOpen)}
          />
          {isEmojiOpen && (
            <div
              ref={emojiPickerRef}
              className="absolute top-43 right-0 z-50 bg-gray-900 p-2 rounded-lg shadow-md"
            >
              <EmojiPicker
                theme="dark"
                searchLabel={searchLabel}
                searchDisabled={searchDisabled}
                categoryDisabled={categoryDisabled}
                onEmojiClick={handleEmojiClick}
              />
            </div>
          )}
          <Plus className="cursor-pointer hover:scale-110 transition-transform" />
          <button onClick={handleTweetPost}>
            <SendHorizontal className="cursor-pointer hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* all tweets */}
      <div>
        {allTweets?.length > 0 &&
          allTweets?.map((tweet) => <TweetBox key={tweet._id} data={tweet} />)}
      </div>
    </div>
  );
};

export default Tweets;
