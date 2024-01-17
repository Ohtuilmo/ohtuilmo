/**
 *  Removes duplicates from an array and returns the result as a new array.
 * @param {any[]} arr
 */
const uniq = (arr) => [...new Set(arr)]

/**
 * Joins multiple classNames into a single, space separated className string.
 * Removes duplicate identifiers. NOTE: May re-order elements.
 * @param  {...string} classNames
 */
export const classes = (...classNames) => {
  const uniqueClassNames = uniq(classNames)
  return uniqueClassNames.filter((name) => !!name).join(' ')
}
