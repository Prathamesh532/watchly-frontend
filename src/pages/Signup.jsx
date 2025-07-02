import React, { use, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { userRegister } from "../store/userDux";
import { uploadUserAvatarCoverImage } from "../store/filesDux";
import { setCustomLoading } from "../store/commonDux";

const Signup = () => {
  const [username, setUserName] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");

  console.log("avatar", avatar);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      fullname,
      email,
      password,
    };

    dispatch(setCustomLoading(true));
    dispatch(userRegister(data)).then((res) => {
      console.log("res", res);
      if (res.type.includes("fulfilled")) {
        const fd = new FormData();
        fd.append("userId", res.payload?.data?._id);
        fd.append("avatar", avatar);
        fd.append("coverImage", coverImage);
        dispatch(uploadUserAvatarCoverImage(fd)).then((res) => {
          console.log("uploadUserAvatarCoverImage res", res);
          dispatch(setCustomLoading(false));
        });
      }
      setUserName("");
      setEmail("");
      setFullName("");
      setPassword("");
      setAvatar(null);
      setCoverImage(null);
    });
  };

  return (
    <div className="login-form">
      <StyledWrapper>
        <div className="form-container">
          <form className="form">
            <div className="form-group">
              <label htmlFor="Username">Username</label>
              <input
                type="text"
                id="email"
                name="Username"
                onChange={(e) => setUserName(e.target.value)}
                value={username}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullname">Full-Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                onChange={(e) => setFullName(e.target.value)}
                value={fullname}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar">Avatar</label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverimage">CoverImage</label>
              <input
                type="file"
                id="coverimage"
                name="coverimage"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </div>

            <button
              className="form-submit-btn"
              type="submit"
              onClick={handleSubmit}
            >
              Regsiter
            </button>

            <div className="signupContainer">
              <p>Alredy have account?</p>
              <NavLink to="/login">Login</NavLink>
            </div>
          </form>
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .form-container {
    width: 400px;
    background: linear-gradient(#212121, #212121) padding-box,
      linear-gradient(145deg, transparent 35%, #e81cff, #40c9ff) border-box;
    border: 2px solid transparent;
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
  }

  .form-container button:active {
    scale: 0.95;
  }

  .form-container .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-container .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #717171;
    font-weight: 600;
    font-size: 12px;
  }

  .form-container .form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    color: #fff;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid #414141;
  }

  .form-container .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    resize: none;
    color: #fff;
    height: 96px;
    border: 1px solid #414141;
    background-color: transparent;
    font-family: inherit;
  }

  .form-container .form-group input::placeholder {
    opacity: 0.5;
  }

  .form-container .form-group input:focus {
    outline: none;
    border-color: #e81cff;
  }

  .form-container .form-group textarea:focus {
    outline: none;
    border-color: #e81cff;
  }

  .form-container .form-submit-btn {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    align-self: flex-start;
    font-family: inherit;
    color: #717171;
    font-weight: 600;
    width: 100%;
    background: #313131;
    border: 1px solid #414141;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 6px;
  }

  .form-container .form-submit-btn:hover {
    background-color: #fff;
    border-color: #fff;
  }

  .signupContainer {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .signupContainer p {
    font-size: 0.9em;
    font-weight: 500;
    color: white;
  }

  .signupContainer a {
    font-size: 0.8em;
    font-weight: 500;
    background-color: #2e2e2e;
    color: white;
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 20px;
  }
`;

export default Signup;
