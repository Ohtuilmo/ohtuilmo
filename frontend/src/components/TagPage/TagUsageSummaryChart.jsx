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
    <>
    </>
  )
}

export default TagUsageSummaryChart
