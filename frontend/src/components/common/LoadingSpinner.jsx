import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import './LoadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <CircularProgress />
      </div>
    </div>
  )
}

export default LoadingSpinner
