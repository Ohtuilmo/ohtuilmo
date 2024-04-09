import React from 'react'

export const NotInGroupPlaceholder = () => (
  <h1 style={{ textAlign: 'center' }}>
    You are currently not assigned to any group.
  </h1>
)

export const NoSprintsPlaceholder = () => (
  <h1 style={{ textAlign: 'center' }}>
    Your group has no sprints. Add a sprint using Sprint Dashboard.
  </h1>
)

export const LoadingPlaceholder = () => (
  <h1 style={{ textAlign: 'center' }}>Loading...</h1>
)

export const NoneAvailable = () => (
  <h1 style={{ textAlign: 'center' }}>None available</h1>
)

export const NoTimeLogsPlaceholderSprint = () => (
  <div
    id='timelogs-placeholder-sprint'
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      marginTop: '1rem'
    }}
    data-cy='timelogs-placeholder-sprint' >
    <h1
      style={{ textAlign: 'center', width: '360px' }}
      data-cy='timelogs-not-available' >
      There are no time logs available for this sprint.
    </h1>
    <h2
      style={{ textAlign: 'center', width: '360px' }}
      data-cy='timelogs-chart-cannot-generate' >
      The chart cannot be generated.
    </h2>
  </div>
)

export const NoTimeLogsPlaceholderProject = () => (
  <div
    id='timelogs-placeholder-total'
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      marginTop: '1rem'
    }}
    data-cy='timelogs-placeholder-total' >
    <h1
      style={{ textAlign: 'center', width: '360px' }}
      data-cy='timelogs-not-available' >
      There are no time logs available for this project.
    </h1>
    <h2
      style={{ textAlign: 'center', width: '360px' }}
      data-cy='timelogs-chart-cannot-generate' >
      The chart cannot be generated.
    </h2>
  </div>
)
