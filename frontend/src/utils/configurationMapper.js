const mapSemesterField = (content) => {
  const patterns = [
    /kevät/i,
    /kesä/i,
    /syksy/i,
    /talvi/i,
    /spring/i,
    /summer/i,
    /autumn/i,
    /fall/i,
    /winter/i,
  ]
  const yearPattern = /[0-9]{1,4}/
  const replacements = [
    'Spring',
    'Summer',
    'Autumn',
    'Winter',
    'Spring',
    'Summer',
    'Autumn',
    'Fall',
    'Winter',
  ]
  const parts = ['', 0]
  for (let i = 0; i < patterns.length; i++) {
    if (content.match(patterns[i])) {
      parts[0] = replacements[i]
      break
    }
  }
  parts[1] = content.match(yearPattern)[0]
  return `${parts[1]} ${parts[0]}`
}

export default mapSemesterField
