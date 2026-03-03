import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

const importTagData = (availableTags, tagData) => {
  const importedData = []

  for (const tag of availableTags) {
    const totalHours =
      tagData[tag]?.reduce((sum, sprint) => sum + sprint.minutes / 60, 0) ?? 0

    importedData.push({
      name: tag,
      value: totalHours,
    })
  }

  return importedData
}

const TagUsageBarChart = ({ availableTags, tagData }) => {
  const data = importTagData(availableTags, tagData)

  return (
    <ResponsiveContainer width="100%" aspect={2} style={{ maxWidth: 800 }}>
      <BarChart responsive data={data}>
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
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colourSet[index % colourSet.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TagUsageBarChart
