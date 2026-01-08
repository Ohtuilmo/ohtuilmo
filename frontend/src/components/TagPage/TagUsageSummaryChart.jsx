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
    const dataEntry = {name: `Sprint ${sprint.sprint}`}
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
    <ResponsiveContainer width="100%" aspect={2} style={{ maxWidth: 800 }}>
      <LineChart
        responsive
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          label={{
            value: 'Time (min)',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Tooltip />
        <Legend />
        {availableTags.map(tag => <Line key={tag} type="monotone" dataKey={tag} />)}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TagUsageSummaryChart
