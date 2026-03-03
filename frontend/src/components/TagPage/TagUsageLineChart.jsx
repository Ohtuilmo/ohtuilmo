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
    const sprintTagHours = {}

    for (const tag of availableTags) {
      const matchingSprint = tagData[tag]?.find(
        (x) => x.sprint_id === sprint.id,
      )

      sprintTagHours[tag] = (matchingSprint?.minutes ?? 0) / 60
    }

    const dataEntry = { name: `Sprint ${sprint.sprint}`, ...sprintTagHours }
    importedData.push(dataEntry)
  }

  return importedData
}

const TagUsageLineChart = ({ allSprints, availableTags, tagData }) => (
  <ResponsiveContainer width="100%" aspect={2} style={{ maxWidth: 800 }}>
    <LineChart
      responsive
      data={importTagData(allSprints, availableTags, tagData)}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis
        label={{
          value: 'Time (hours)',
          angle: -90,
          position: 'insideLeft',
        }}
      />
      <Tooltip formatter={(value) => `${value} h`} />
      <Legend />
      {availableTags.map((tag, index) => (
        <Line
          key={tag}
          type="monotone"
          dataKey={tag}
          stroke={colourSet[index % colourSet.length]}
          strokeWidth={3}
          dot={false}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
)

export default TagUsageLineChart
