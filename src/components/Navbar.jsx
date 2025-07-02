import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  changePassword,
  UserDetail,
  userLogout,
  UserToken,
} from "../store/userDux";
import { useDispatch } from "react-redux";
import { setCustomLoading } from "../store/commonDux";

const Navbar = () => {
  const userData = UserDetail();
  const userToken = UserToken();

  return (
    <nav className="navbar h-[72px] sticky flex justify-between items-center top-0 z-50">
      <div className="navbar-container flex items-center justify-between w-full px-12 md:px-8 lg:px-16">
        <div className="flex items-center">
          <NavLink className="navbar-logo" to="/">
            Watchly
          </NavLink>
        </div>
        <div>
          {!userToken ? (
            <NavLink to="/login" className="login-button">
              Login
            </NavLink>
          ) : (
            <div>
              <UserDropdown
                username={userData?.username}
                avatar={userData?.avatar}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const UserDropdown = ({ username, avatar }) => {
  const [isChangePassword, setIsChangePassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(setCustomLoading(true));
    dispatch(userLogout()).then((res) => {
      if (res.type.includes("fulfilled")) {
        console.log("res", res);
        navigate("/");
      }
      dispatch(setCustomLoading(false));
    });
  };

  return (
    <div className="user-dropdown">
      <button className="dropdown-button" tabIndex={0}>
        <span className="dropdown-username">{username}</span>
        <img className="dropdown-avatar" src={avatar} alt="avatar" />
      </button>

      <div className="dropdown-menu">
        <ul className="dropdown-list">
          <li className="dropdown-item">
            <NavLink to="/profile" className="dropdown-link">
              View Profile
            </NavLink>
          </li>
          <li className="dropdown-item">
            <a className="dropdown-link" onClick={handleLogout}>
              Logout
            </a>
          </li>
          <li className="dropdown-item">
            <a
              className="dropdown-link"
              onClick={() => setIsChangePassword(true)}
            >
              Change Password
            </a>
          </li>
        </ul>
      </div>

      {isChangePassword && (
        <PasswordChangeModal setIsChangePassword={setIsChangePassword} />
      )}
    </div>
  );
};

const PasswordChangeModal = ({ setIsChangePassword }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const dispatch = useDispatch();

  const handleChangePassword = async () => {
    const data = { oldPassword, newPassword };
    dispatch(setCustomLoading(true));
    dispatch(changePassword(data)).then((res) => {
      if (res.type.includes("fulfilled")) {
        console.log("res", res);
        setIsChangePassword(false);
      }
      dispatch(setCustomLoading(false));
    });
  };

  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        <h3 className="password-modal-title">Change Password</h3>
        <div className="password-modal-body">
          <div className="form-group">
            <label htmlFor="oldpassword">Old Password</label>
            <input
              type="password"
              id="oldpassword"
              name="oldpassword"
              className="form-input"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newpassword">New Password</label>
            <input
              type="password"
              id="newpassword"
              name="newpassword"
              className="form-input"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button
              className="change-password-button"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
            <button
              className="change-password-button"
              style={{ marginLeft: "10px", background: "#888" }}
              onClick={() => setIsChangePassword(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
