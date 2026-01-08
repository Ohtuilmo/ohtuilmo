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

const colourSet = [
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
    <ResponsiveContainer width="100%" aspect={3}>
      <LineChart
        style={{ width: '50%', maxWidth: '700px', aspectRatio: 1.618 }}
        responsive
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {availableTags.map((tag, index) => <Line type="monotone" dataKey={tag} stroke={colourSet[index % colourSet.length]} />)}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TagUsageSummaryChart
