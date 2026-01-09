import {
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core'

const CheckboxMultiSelect = ({allItems, selectedItems, setSelectedItems, isHorizontal}) => (
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
)

CheckboxMultiSelect.defaultProps = {
  isHorizontal: false,
}

export default CheckboxMultiSelect
