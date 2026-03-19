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

const TagUsageLineChart = ({
  allSprints,
  allTags,
  selectedTags,
  tagData,
  tagColors,
}) => {
  const data = allSprints.map((sprint) => {
    const sprintTagHours = {}

    allTags.forEach((tag) => {
      if (selectedTags.includes(tag)) {
        const matchingSprint = tagData[tag]?.find(
          (x) => x.sprint_id === sprint.id,
        )

        sprintTagHours[tag] = (matchingSprint?.minutes ?? 0) / 60
      }
    })

    return {
      name: `Sprint ${sprint.sprint}`,
      ...sprintTagHours,
    }
  })

  return (
    <ResponsiveContainer width="100%" aspect={2} style={{ maxWidth: 800 }}>
      <LineChart responsive data={data} id="tag-usage-line-chart">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          label={{
            value: 'Hours',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Tooltip formatter={(value) => `${value} h`} />
        <Legend />

        {allTags
          .filter((tag) => selectedTags.includes(tag))
          .map((tag) => (
            <Line
              key={tag}
              type="monotone"
              dataKey={tag}
              stroke={tagColors[tag]}
              strokeWidth={3}
              dot={false}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TagUsageLineChart
