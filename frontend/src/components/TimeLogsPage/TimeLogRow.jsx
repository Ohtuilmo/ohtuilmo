import { minutesToFormattedHoursAndMinutes } from '../../utils/functions'
import { Chip } from '@material-ui/core'

import './TimeLogsPage.css'

export const TimeLogRow = ({ log }) => {
  const { hours, minutes } = minutesToFormattedHoursAndMinutes(log.minutes)

  const dateObj = new Date(log.date)
  const formattedDate = dateObj.toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\./g, '/')

  return (
    <div className="timelogs-row-container">
      <div className="timelogs-table-row">
        <div className="timelogs-date-and-time">
          <p>
            {hours}:{minutes}
          </p>
          <p>{formattedDate}</p>
        </div>
        <div className="timelogs-description">
          <p>{log.description}</p>
        </div>
      </div>
      <div className="timelogs-tags-row">
        {log.tags.map((tag) => (
          <Chip key={tag} label={tag} className="timelogs-tag" size="small" />
        ))}
      </div>
    </div>
  )
}
