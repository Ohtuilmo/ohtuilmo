import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'

import { classes } from '../util'
import './LoadingCover.css'

const LoadingCover = ({ className }) => (
  <div className={classes('loading-cover', className)}>
    <p className="loading-cover__text">Loading...</p>
    <LinearProgress className="loading-cover__indicator" color="secondary" />
  </div>
)

export default LoadingCover
