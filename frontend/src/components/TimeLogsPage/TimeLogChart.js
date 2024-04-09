
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { BarChart, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts'

import { NoTimeLogsPlaceholderSprint, NoTimeLogsPlaceholderProject } from '../common/Placeholders'

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
    <g transform={`translate(${x},${y})`} data-cy={`timelogs-chart-${variant}-tick-${payload.index}`}>
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
    mobileView,
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
      for (let entryIndex = 0; entryIndex < sprintData.length; entryIndex++) {
        const name = Object.keys(sprintData[entryIndex])[0]
        const minutes = Object.values(sprintData[entryIndex])[0]
        mappedData.push({
          sprint: Number(sprint),
          name: name,
          minutes: minutes
        })
      }
    }
    return mappedData
  }

  useEffect(() => {
    const mappedData = mapSprintSummaryData()
    setSprints([...new Set(mappedData.map((entry) => entry.sprint))])
    setChartData(mappedData)
  }, [])

  const reduceData = (data) => data.reduce((acc, cur) => {
    const { sprint, name, minutes } = cur
    const item = acc.find(it => it.name === name)
    item ? item.minutes += minutes : acc.push({ sprint, name, minutes })
    return acc
  } , [])

  if (chartData && chartData.length > 0) {
    return chartVariant === 'total'
      ? (<BarChart
        id='timelogs-chart-total'
        className='timelogs-chart'
        width={mobileView ? 400 : 500}
        height={mobileView ? 300 : 350}
        data={reduceData(chartData)}
        margin={{
          top: 10,
          left: 10,
          right: 10,
          bottom: 10
        }} >
        <XAxis dataKey='name' minTickGap={0} height={70} tick={<CustomizedTick variant={chartVariant} />} angle={270} tickLine={false} />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey='minutes'
          background={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColourSet[index % barColourSet.length]} />
          ))}
        </Bar>
      </BarChart>)
      : sprints.includes(selectedSprintNumber)
        ? (<BarChart
          id='timelogs-chart-sprint'
          className='timelogs-chart'
          width={mobileView ? 400 : 500}
          height={mobileView ? 300 : 350}
          data={chartData.filter((entry) => entry.sprint === selectedSprintNumber)}
          margin={{
            top: 10,
            left: 10,
            right: 10,
            bottom: 10
          }} >
          <XAxis dataKey='name' minTickGap={0} height={70} tick={<CustomizedTick variant={chartVariant} />} angle={270} tickLine={false} />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey='minutes'
            background={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColourSet[index % barColourSet.length]} />
            ))}
          </Bar>
        </BarChart>)
        : (<NoTimeLogsPlaceholderSprint />)
  } else {
    return chartVariant === 'total'
      ? (<NoTimeLogsPlaceholderProject />)
      : (<NoTimeLogsPlaceholderSprint />)
  }
}

const mapStateToProps = (state) => ({
  state: state,
  groupSprintSummary: state.timeLogs.groupSprintSummary,
  selectedSprintNumber: state.timeLogs.selectedSprintNumber
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TimeLogChart)