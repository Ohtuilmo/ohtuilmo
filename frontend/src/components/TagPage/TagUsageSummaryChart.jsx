import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  '#a3af07',
]

const importTagData = (allSprints, availableTags, tagData) => {
  const importedData = []

  for (const sprint of allSprints) {
    const sprintTagMinutes = {}

    for (const tag of availableTags) {
      if (!tagData[tag]) {
        sprintTagMinutes[tag] = 0
      } else {
        const matchingSprints = tagData[tag].filter(x => x.sprint_id === sprint.id)
        sprintTagMinutes[tag] = matchingSprints ? matchingSprints[0].minutes : 0
      }
    }

    const dataEntry = {name: `Sprint ${sprint.sprint}`, ...sprintTagMinutes}
    importedData.push(dataEntry)
  }

  return importedData
}

const TagUsageSummaryChart = ({allSprints, availableTags, tagData}) => (
  <ResponsiveContainer width="100%" aspect={2} style={{ maxWidth: 800 }}>
    <LineChart
      responsive
      data={importTagData(allSprints, availableTags, tagData)}
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
      {availableTags.map((tag, index) =>
        <Line
          key={tag}
          type="monotone"
          dataKey={tag}
          stroke={colourSet[index % colourSet.length]}
          strokeWidth={3}
          dot={false}
        />
      )}
    </LineChart>
  </ResponsiveContainer>
)

export default TagUsageSummaryChart
