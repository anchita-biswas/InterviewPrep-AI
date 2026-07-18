import React from 'react'
import '../style/loading-screen.scss'

const LoadingScreen = () => {
  return (
    <div className="loading-screen-overlay">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h2 className="loading-text">Loading</h2>
        <p className="loading-subtext">Please wait a moment...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
