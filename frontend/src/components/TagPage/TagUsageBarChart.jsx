import React from 'react'
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

const TagUsageBarChart = ({ allTags, selectedTags, tagData, tagColors }) => {
  const data = allTags
    .filter((tag) => selectedTags.includes(tag))
    .map((tag) => {
      const totalHours =
        tagData[tag]?.reduce((sum, sprint) => sum + sprint.minutes / 60, 0) ?? 0

      return {
        name: tag,
        value: totalHours,
      }
    })

  return (
    <ResponsiveContainer width="100%" aspect={2} style={{ maxWidth: 800 }}>
      <BarChart responsive data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={80}
          tickFormatter={(value) =>
            value.length > 10 ? `${value.substring(0, 10)}...` : value
          }
        />
        <YAxis
          label={{
            value: 'Hours',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Tooltip formatter={(value) => `${Math.round(value * 100) / 100} h`} />
        <Bar dataKey="value">
          {data.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={tagColors[entry.name]}
              id={`bar-${entry.name}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TagUsageBarChart
