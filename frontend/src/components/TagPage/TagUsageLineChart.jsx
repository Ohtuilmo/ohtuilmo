import React from 'react'
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
import { useTheme } from '@material-ui/core/styles';

const TagUsageLineChart = ({
  allSprints,
  allTags,
  selectedTags,
  tagData,
  tagColors,
}) => {
  const theme = useTheme()

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
        <XAxis
          dataKey="name"
          tick={{ fill: theme.palette.text.primary }}
          tickLine={{ stroke: theme.custom.chartAxis.stroke }}
          axisLine={{ stroke: theme.custom.chartAxis.stroke, strokeWidth: 1 }}
        />
        <YAxis
          label={{
            value: 'Hours',
            angle: -90,
            position: 'insideLeft',
            fill: theme.palette.text.primary,
          }}
          tick={{ fill: theme.custom.chartAxis.stroke }}
          tickLine={{ stroke: theme.custom.chartAxis.stroke }}
          axisLine={{ stroke: theme.custom.chartAxis.stroke, strokeWidth: 1 }}
        />
        <Tooltip
          formatter={(value) => `${Math.round(value * 100) / 100} h`}
          cursor={{ fill: '#4d4d4d', fillOpacity: 0.2 }}
          contentStyle={{ backgroundColor: theme.custom.chartTooltip.background }}
        />
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
