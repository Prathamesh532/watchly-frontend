import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserWatchHistory } from "../store/userDux";

const UserWatchHistory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserWatchHistory());
  }, []);

  return (
    <div>
      <h1>UserWatchHistory</h1>
    </div>
  );
};

export default UserWatchHistory;
