import React from 'react'
import PropTypes from 'prop-types'
import AsyncSelect from 'react-select/lib/Async'

import autocomplete from '../../services/autocomplete'

/** @typedef {{ student_number: string, first_names: string, last_name: string }} AutocompleteResult */

const MIN_CHARS = 2

/** @param {AutocompleteResult} option */
const getOptionLabel = (option) => `${option.first_names} ${option.last_name}`

/** @param {AutocompleteResult} option */
const getOptionValue = (option) => option.student_number

const AutocompletedUserSelect = ({
  className,
  classNamePrefix,
  selectedUser,
  onSelectedUserChange,
  defaultUser
}) => {
  /** @param {AutocompleteResult} selectedOption */
  const handleChange = (selectedOption, { action }) => {
    if (action === 'clear') {
      // selectedOption is null
      onSelectedUserChange(null)
    } else if (action === 'select-option') {
      // selectedOption is one of the result objects returned by the
      // autocomplete service
      onSelectedUserChange(selectedOption)
    }
  }

  const handleLoadOptions = async (inputValue) => {
    if (inputValue.length < MIN_CHARS) {
      return
    }

    return await autocomplete.findUsersByPartialName(inputValue)
  }

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      isClearable
      value={selectedUser}
      loadOptions={handleLoadOptions}
      onChange={handleChange}
      getOptionValue={getOptionValue}
      getOptionLabel={getOptionLabel}
      defaultValue={defaultUser}
      placeholder="Search by name"
      className={className}
      classNamePrefix={classNamePrefix}
    />
  )
}

const autosuggestResultShape = PropTypes.shape({
  student_number: PropTypes.string.isRequired,
  first_names: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired
})

AutocompletedUserSelect.propTypes = {
  className: PropTypes.string,
  classNamePrefix: PropTypes.string,
  selectedUser: autosuggestResultShape,
  defaultUser: autosuggestResultShape,
  onSelectedUserChange: PropTypes.func.isRequired
}

export default AutocompletedUserSelect
