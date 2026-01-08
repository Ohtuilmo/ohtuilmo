import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const TagUsageSummaryChart = ({allSprints, availableTags, tagData}) => {
  const data = allSprints.map(sprint => {
    const dataEntry = {name: sprint.sprint}
    for (const tag of availableTags) {
      if (!Object.hasOwn(tagData, tag) || !tagData[tag].map(tagSprint => tagSprint.sprint_id).includes(sprint.id)) {
        dataEntry[tag] = 0
      } else {
        dataEntry[tag] = tagData[tag].filter(tagSprint => tagSprint.sprint_id === sprint.id)[0].minutes
      }
    }
    return dataEntry
  })

  return (
    <div>
    jotain2
    <ResponsiveContainer>
    jotain3
    <LineChart
      style={{ width: '100%', maxWidth: '700px', height: '500px', maxHeight: '500px', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 150]} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="tapaaminen" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="koodaus" stroke="#82ca9d" />
    </LineChart>
    </ResponsiveContainer>
    </div>
  )
}

export default TagUsageSummaryChart
