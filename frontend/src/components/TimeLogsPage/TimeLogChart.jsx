
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, ReferenceLine, Label, LabelList, Bar, Cell } from 'recharts'
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


const durationInDays = (start_date, end_date) => {
  // This is a... ahem... _borrowed_ solution
  // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript/15289883#15289883
  const _MS_PER_DAY = 1000 * 60 * 60 * 24

  const utc1 = Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
  const utc2 = Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());

  return Math.floor(Math.abs((utc2 - utc1)) / _MS_PER_DAY);
}

// The ideal hours per project is 200h
// The approximation for calculations is:
// 14h/week is a ideal pace.
// 12h/week will lead to 180h,
// 10h/week to 150h
// if less that that... good luck
const idealHoursPerWeek = 14
const idealHoursPerDay = idealHoursPerWeek / 7

const okHoursPerWeek = 12
const okHoursPerDay = okHoursPerWeek / 7

const dangerousHoursPerWeek = 8
const dangerousHoursPerDay = dangerousHoursPerWeek / 7


const projectDurationFromSprints = (allSprintDates) => {
  const projectStartDate = allSprintDates[Math.min(...Object.keys(allSprintDates))].start_date
  const projectEndDate = allSprintDates[Math.max(...Object.keys(allSprintDates))].end_date

  const sprintDuration = durationInDays(projectStartDate, projectEndDate)
  return sprintDuration
}

const idealHours = (durationDays) => {
  return durationDays*idealHoursPerDay
}

const barBorderColorByPace = (pace) => {
  switch (pace) {
    case "Ideal":
      return "none"
    case "Ok":
      return "none"
    case "Dangerous":
      return "orange"
    case "Panic":
      return "red"
    default:
      console.error("Student pace not matched:", studentName, pace, "- skipping.")
      return "none"
  }
}

const checkStudentProgressPaceTotal = (studentName, allStudentHours, totalDuration) => {
  const totalHours = allStudentHours.find(sprint => sprint.name === studentName && sprint.sprint === -1)?.hours

  let pace = ""
  if (totalHours >= totalDuration*idealHoursPerDay) {
    pace = "Ideal"
  } else if (totalHours >= totalDuration*okHoursPerDay) {
    pace = "Ok"
  } else if (totalHours >= totalDuration*dangerousHoursPerDay) {
    pace = "Dangerous"
  } else {
    pace = "Panic"
  }
  const paceColor = barBorderColorByPace(pace)
  return { pace, paceColor, totalHours, idealHours: idealHours(totalDuration) }
}

const checkStudentProgressPacePerSprint = (targetStudent, allStudentHours, allSprintDates) => {
  const sprintPaces = {}
  allStudentHours.forEach((student, index) => {
    if (student.sprint === -1)
      return

    const studentName = student.name
    const studentHours = student.hours
    const sprintDates = allSprintDates[student.sprint]

    if (studentName !== targetStudent)
      return
    if (!sprintDates)
      return


    let pace = ""
    const sprintDuration = durationInDays(sprintDates.start_date, sprintDates.end_date)
    if (studentHours > sprintDuration*idealHoursPerDay) {
      pace = "Ideal"
    } else if (studentHours > sprintDuration*okHoursPerDay) {
      pace = "Ok"
    } else if (studentHours > sprintDuration*dangerousHoursPerDay) {
      pace = "Dangerous"
    } else {
      pace = "Panic"
    }

    const paceColor = barBorderColorByPace(pace)
    sprintPaces[student.sprint] = { pace, paceColor, hours: studentHours, idealHours: idealHours(sprintDuration) }
  })
  return sprintPaces
}

const checkStudentProgress = (mappedData, allSprintDates) => {
  const students = [...new Set(mappedData.map(sprint => sprint.name))];
  const paces = {}
  const projectDuration = projectDurationFromSprints(allSprintDates)

  students.forEach(student => {
    const studentPaceTotal = checkStudentProgressPaceTotal(student, mappedData, projectDuration)
    const studentPacePerSprint = checkStudentProgressPacePerSprint(student, mappedData, allSprintDates)
    paces[student] = { total: studentPaceTotal, sprints: studentPacePerSprint}
  })
  return paces
}


const TimeLogChart = (props) => {
  const {
    groupSprintSummary,
    selectedSprintNumber,
    chartVariant
  } = props
  const [chartData, setChartData] = useState([])
  const [sprints, setSprints] = useState([])
  const [studentPaces, setStudentPaces] = useState({})
  const [sprintDates, setSprintDates] = useState({})
  const [projectDuration, setProjectDuration] = useState(0)
  const [selectedSprintDuration, setSelectedSprintDuration] = useState(0)

  const mapSprintSummaryData = (summaryData) => {
    let mappedData = []
    let sprintDates = {}
    if (summaryData.length === 0) {
      return null
    }

    for (let sprintIndex = 0; sprintIndex < summaryData.length; sprintIndex++) {
      const sprint = Object.keys(summaryData[sprintIndex])[0]
      const sprintData = Object.values(summaryData[sprintIndex])[0]
      if (sprint === 'Total') {
        for (let entryIndex = 0; entryIndex < sprintData.length; entryIndex++) {
          const name = Object.keys(sprintData[entryIndex])[0]
          const minutes = Object.values(sprintData[entryIndex])[0]
          const hours = parseInt(minutes/60)
          const minutesLeft = minutes % 60
          const altHours = minutes/60
          mappedData.push({
            sprint: -1,
            name: name,
            hours: hours,
            altHours: parseFloat(altHours.toFixed(1)),
            altLabel: `${hours} h, ${minutesLeft} min`,
            hLabel: `${hours} hours`,
            minutes: minutesLeft,
            mLabel: `${minutesLeft} minutes`,
            defaultLabel: `${altHours.toFixed(1)} h`
          })
        }
      } else {
        for (let entryIndex = 0; entryIndex < sprintData.length; entryIndex++) {

          // Filter out sprint start+end dates and return them in an object grouped by sprint number
          if (Object.keys(sprintData[entryIndex]).includes("start_date") || Object.keys(sprintData[entryIndex]).includes("end_date")) {
            const start_date = new Date(sprintData[entryIndex].start_date)
            const end_date = new Date(sprintData[entryIndex].end_date)
            sprintDates[sprint] = { start_date, end_date, duration: durationInDays(start_date, end_date) }

            continue
          }

          const name = Object.keys(sprintData[entryIndex])[0]
          const minutes = Object.values(sprintData[entryIndex])[0]
          const hours = parseInt(minutes/60)
          const minutesLeft = minutes % 60
          const altHours = minutes/60
          mappedData.push({
            sprint: Number(sprint),
            name: name,
            hours: hours,
            altHours: parseFloat(altHours.toFixed(1)),
            altLabel: `${hours} h, ${minutesLeft} min`,
            hLabel: `${hours} hours`,
            minutes: minutesLeft,
            mLabel: `${minutesLeft} minutes`,
            defaultLabel: `${altHours.toFixed(1)} h`
          })
        }
      }
    }
    return { mappedData: mappedData.sort((a, b) => a.name.localeCompare(b.name)), sprintDates: sprintDates }
  }

  useEffect(() => {
    if (groupSprintSummary?.length === 0)
      return

    const { mappedData, sprintDates } = mapSprintSummaryData(groupSprintSummary)
    if (mappedData.length === 0)
      return

    setSprints([...new Set(mappedData.map((entry) => entry.sprint).filter((entry) => entry !== -1))])
    setChartData(mappedData)
    setSprintDates(sprintDates)

    const duration = projectDurationFromSprints(sprintDates)
    setProjectDuration(duration)
    const paces = checkStudentProgress(mappedData, sprintDates)
    setStudentPaces(paces)
  }, [groupSprintSummary])

  useEffect(() => {
    if (!sprintDates)
      return

    if (selectedSprintNumber !== null && Object.keys(sprintDates).includes(selectedSprintNumber.toString())) {
      const sprintDuration = durationInDays(sprintDates[selectedSprintNumber].start_date, sprintDates[selectedSprintNumber].end_date)
      setSelectedSprintDuration(sprintDuration)
    } else {
      setSelectedSprintDuration(0)
    }
  }, [selectedSprintNumber])



  const showSprintTooltip = ({ payload, label, active }) => {
    if (active && payload && payload.length) {
      const pace = studentPaces[label].sprints[selectedSprintNumber]?.pace
      const totalHours = studentPaces[label].sprints[selectedSprintNumber]?.hours
      const idealHours = studentPaces[label].sprints[selectedSprintNumber]?.idealHours
      return (
        <div
          className="custom-tooltip"
          style={{
            border: '1px solid #d88488',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '1px 1px 2px #d88488',
          }}
        >
          <h3>{`${label} : ${payload[0].value}h`}</h3>
          <h4>
            Student's pace: { pace } { idealHours-totalHours>0 ? `(missing: ${ idealHours - totalHours }h)` : `(ahead ${totalHours-idealHours}h)`}
          </h4>
          <p className="desc" style={{ margin: '0' }}>
            Student should have around { idealHours } hours, has { totalHours } hours
          </p>
        </div>
      );
    }

    return null;
  }

  const showTotalTooltip = ({ payload, label, active }) => {
    if (active && payload && payload.length) {
      const pace = studentPaces[label].total.pace
      const totalHours = studentPaces[label].total.totalHours
      const idealHours = studentPaces[label].total.idealHours
      return (
        <div
          className="custom-tooltip"
          style={{
            border: '1px solid #d88488',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '1px 1px 2px #d88488',
          }}
        >
          <h3>{`${label} : ${payload[0].value}h`}</h3>
          <h4>
            Student's pace: { pace } { idealHours-totalHours>0 ? `(missing: ${ idealHours - totalHours }h)` : `(ahead ${totalHours-idealHours}h)`}
          </h4>
          <p className="desc" style={{ margin: '0' }}>
            Student should have around { idealHours } hours, has { totalHours } hours
          </p>
        </div>
      );
    }

    return null;
  }

  if (chartData && chartData.length > 0) {
    return chartVariant === 'total'
      ? (<div className='timelogs-chart-container'>
        <ResponsiveContainer>
          <BarChart
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            id='timelogs-chart-total'
            className='timelogs-chart'
            data={chartData.filter((entry) => entry.sprint === -1)}
          >
            <XAxis dataKey='name' minTickGap={0} height={70} tick={<CustomizedTick variant={chartVariant} />} angle={270} tickLine={false} />
            <YAxis domain={[0, (dataMax) => Math.max(dataMax, idealHours(projectDuration))]}/>
            <ReferenceLine
              y={idealHours(projectDuration)}
              label={{ value: "Ideal total hours at the end of latest sprint", position: 'insideTopRight'}}
              stroke="red"
              strokeDasharray="3 3"
            />
            <Tooltip content={showTotalTooltip} />
            <Bar
              dataKey='altHours'
              background={false}
            >
              <LabelList dataKey='defaultLabel' position='top' />
              {chartData.filter((entry) => entry.sprint === -1).map((entry, index) => {
                const paceColor = entry.sprint === -1
                  ? studentPaces[entry.name].total.paceColor
                  : studentPaces[entry.name].sprints[selectedSprintNumber]?.paceColor
                return (<Cell key={`cell-${index}`} fill={barColourSet[index % barColourSet.length]} stroke={paceColor} strokeWidth={1} />)
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>)
      : selectedSprintNumber !== null && sprints.includes(selectedSprintNumber)
        ? (<div className='timelogs-chart-container'>
          <ResponsiveContainer>
            <BarChart
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              id='timelogs-chart-sprint'
              className='timelogs-chart'
              data={chartData.filter((entry) => entry.sprint === selectedSprintNumber)}
            >
              <XAxis dataKey='name' minTickGap={0} height={70} tick={<CustomizedTick variant={chartVariant} />} angle={270} tickLine={false} />
              <YAxis domain={[0, (dataMax) => Math.max(dataMax, idealHours(selectedSprintDuration))]}/>
              <ReferenceLine
                y={idealHours(selectedSprintDuration)}
                label={{ value: "Ideal total hours at the end of latest sprint", position: 'insideTopRight'}}
                stroke="red"
                strokeDasharray="3 3"
              />
              <Tooltip content={showSprintTooltip} />
              <Bar
                dataKey='altHours'
                background={false}
              >
                <LabelList dataKey='defaultLabel' position='top' />
                {chartData.filter((entry) => entry.sprint === selectedSprintNumber).map((entry, index) => {
                  const paceColor = entry.sprint === -1
                    ? studentPaces[entry.name].total.paceColor
                    : studentPaces[entry.name].sprints[selectedSprintNumber]?.paceColor
                  return (<Cell key={`cell-${index}`} fill={barColourSet[index % barColourSet.length]} stroke={paceColor} strokeWidth={1} />)
                })}
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
