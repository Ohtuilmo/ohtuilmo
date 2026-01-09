import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core'

const handleChange = (item, selectedItems, setSelectedItems) => {
  return (event, checked) => {
    if (checked) {
      setSelectedItems([item, ...selectedItems])
    } else {
      setSelectedItems(selectedItems.filter(selItem => selItem !== item))
    }
  }
}

const CheckboxMultiSelect = ({allItems, selectedItems, setSelectedItems, isHorizontal}) => {
  return (
    <FormGroup row={isHorizontal}>
      {allItems.map(item => (
        <FormControlLabel
          key={item}
          control={<Checkbox onChange={handleChange(item, selectedItems, setSelectedItems)} />}
          label={item}
        />
      ))}
    </FormGroup>
  )
}

CheckboxMultiSelect.defaultProps = {
  isHorizontal: false,
}

export default CheckboxMultiSelect
