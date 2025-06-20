import React from "react";
import "./RouteLoader.css";

const RouteLoader = ({ text = "Loading..." }) => {
  return (
    <div className="route-loader-container">
      <div className="route-loader-content">
        <div className="spinner-container">
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        </div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default RouteLoader;