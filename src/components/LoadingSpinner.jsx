import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setCustomLoading } from "../store/commonDux";

const LoadingSpinner = ({ isLoading }) => {
  // const [showSpinner, setShowSpinner] = useState(isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        dispatch(setCustomLoading(false));
      }, 10000);
    }
  }, [isLoading]);

  return (
    <div
      className={isLoading ? "loadingSpinner" : "loadingSpinner hideLoading"}
    >
      <StyledWrapper>{isLoading && <div className="loader" />}</StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .loader {
    position: fixed;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    box-sizing: border-box;
    border-top: 8px solid #fff;
    border-left: 8px solid #fff;
    border-right: 8px solid #ff00;
    animation: loader 0.7s infinite linear;
  }

  @keyframes loader {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default LoadingSpinner;
