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
    data-cy='timelogs-placeholder-sprint' >
    <h3
      style={{ textAlign: 'left', margin: '8px' }}
      data-cy='timelogs-not-available' >
      There are no time logs available for this sprint.
    </h3>
    <h4
      style={{ textAlign: 'left', margin: '8px' }}
      data-cy='timelogs-chart-cannot-generate' >
      The chart cannot be generated.
    </h4>
  </div>
)

export const NoTimeLogsPlaceholderProject = () => (
  <div
    id='timelogs-placeholder-total'
    data-cy='timelogs-placeholder-total' >
    <h3
      style={{ textAlign: 'left', margin: '8px' }}
      data-cy='timelogs-not-available' >
      There are no time logs available for this project.
    </h3>
    <h4
      style={{ textAlign: 'left', margin: '8px' }}
      data-cy='timelogs-chart-cannot-generate' >
      The chart cannot be generated.
    </h4>
  </div>
)
