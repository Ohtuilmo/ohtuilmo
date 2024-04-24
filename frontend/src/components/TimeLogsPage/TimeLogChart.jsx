
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts'
import { NoTimeLogsPlaceholderSprint, NoTimeLogsPlaceholderProject } from '../common/Placeholders'
import Error from '@material-ui/icons/Error'

import './TimeLogsPage.css'

// Used colours are based on University of Helsinki visual guidelines
const barColourSet = [
  '#9258c8',
  '#3a75c4',
  '#8c0032',
  '#15bef0',
  '#00b08c',
  '#fca311',
  '#009e60',
  '#e5053a',
  '#5bbf21',
  '#00a39a',
  '#e63375',
  '#256ec7',
  '#e95c55',
  '#a3af07'
]

const CustomizedTick = (props) => {
  const { variant, x, y, payload } = props
  const parts = payload.value.split(' ')
  return (
    <g transform={`translate(${x},${y})`} id={`timelogs-chart-${variant}-tick-${payload.index}`}>
      <text x={0} y={0} dy={-8} dx={-40} transform='rotate(270)' fill={barColourSet[payload.index % barColourSet.length]}>
        <tspan textAnchor='middle' x='0' dx={-36}>
          {parts[0]}
        </tspan>
        <tspan textAnchor='middle' x='0' dy='16' dx={-36}>
          {parts[1]}
        </tspan>
      </text>
    </g>
  )
}

const TimeLogChart = (props) => {
  const {
    groupSprintSummary,
    selectedSprintNumber,
    chartVariant
  } = props
  const [chartData, setChartData] = useState([])
  const [sprints, setSprints] = useState([])
  const mapSprintSummaryData = () => {
    let mappedData = []
    if (groupSprintSummary.length === 0) {
      return null
    }
    for (let sprintIndex = 0; sprintIndex < groupSprintSummary.length; sprintIndex++) {
      const sprint = Object.keys(groupSprintSummary[sprintIndex])[0]
      const sprintData = Object.values(groupSprintSummary[sprintIndex])[0]
      if (sprint === 'Total') {
        for (let entryIndex = 0; entryIndex < sprintData.length; entryIndex++) {
          const name = Object.keys(sprintData[entryIndex])[0]
          const minutes = Object.values(sprintData[entryIndex])[0]
          const hours = minutes/60
          mappedData.push({
            sprint: -1,
            name: name,
            hours: parseFloat(hours.toFixed(1))
          })
        }
      } else {
        for (let entryIndex = 0; entryIndex < sprintData.length; entryIndex++) {
          const name = Object.keys(sprintData[entryIndex])[0]
          const minutes = Object.values(sprintData[entryIndex])[0]
          const hours = minutes/60
          mappedData.push({
            sprint: Number(sprint),
            name: name,
            hours: parseFloat(hours.toFixed(1))
          })
        }
      }
    }
    return mappedData
  }

  useEffect(() => {
    const mappedData = mapSprintSummaryData()
    setSprints([...new Set(mappedData.map((entry) => entry.sprint).filter((entry) => entry !== -1))])
    setChartData(mappedData)
  }, [])

  if (chartData && chartData.length > 0) {
    return chartVariant === 'total'
      ? (<div className='timelogs-chart-container'>
        <ResponsiveContainer>
          <BarChart
            id='timelogs-chart-total'
            className='timelogs-chart'
            data={chartData.filter((entry) => entry.sprint === -1)}
          >
            <XAxis dataKey='name' minTickGap={0} height={70} tick={<CustomizedTick variant={chartVariant} />} angle={270} tickLine={false} />
            <YAxis />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar
              dataKey='hours'
              background={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColourSet[index % barColourSet.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>)
      : sprints.includes(selectedSprintNumber)
        ? (<div className='timelogs-chart-container'>
          <ResponsiveContainer>
            <BarChart
              id='timelogs-chart-sprint'
              className='timelogs-chart'
              data={chartData.filter((entry) => entry.sprint === selectedSprintNumber)}
            >
              <XAxis dataKey='name' minTickGap={0} height={70} tick={<CustomizedTick variant={chartVariant} />} angle={270} tickLine={false} />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar
                dataKey='hours'
                background={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColourSet[index % barColourSet.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>)
        : (<div className='timelogs-not-available-message-and-icon'><Error /><NoTimeLogsPlaceholderSprint /></div>)
  } else {
    return chartVariant === 'total'
      ? (<div className='timelogs-not-available-message-and-icon'><Error /><NoTimeLogsPlaceholderProject /></div>)
      : (<div className='timelogs-not-available-message-and-icon'><Error /><NoTimeLogsPlaceholderSprint /></div>)
  }
}

const mapStateToProps = (state) => ({
  state: state,
  groupSprintSummary: state.timeLogs.groupSprintSummary,
  selectedSprintNumber: state.timeLogs.selectedSprintNumber
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TimeLogChart)