import React from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core'

const CheckboxMultiSelect = ({allItems, selectedItems, setSelectedItems, isHorizontal}) => {
  const allSelected = selectedItems.length === allItems.length
  const handleToggleAll = (event, checked) => {
    setSelectedItems(checked ? allItems : [])
  }

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={allSelected}
            onChange={handleToggleAll}
          />
        }
        label="Toggle all"
      />
      <FormGroup row={isHorizontal}>
        {allItems.map(item =>
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                checked={selectedItems.includes(item)}
                onChange={(event, checked) =>
                  setSelectedItems(checked
                    ? [item, ...selectedItems]
                    : selectedItems.filter(x => x !== item)
                  )
                }
              />
            }
            label={item}
          />
        )}
      </FormGroup>
    </>
  )
}

CheckboxMultiSelect.defaultProps = {
  isHorizontal: false,
}

export default CheckboxMultiSelect
