import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Check } from '@material-ui/icons'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  ListItemIcon,
} from '@material-ui/core'

import './TimeLogsPage.css'

const StyledMenuItem = withStyles({
  root: {
    backgroundColor: 'transparent !important',
  },
})(MenuItem)

const StyledSelect = withStyles({
  select: {
    '&:focus': {
      backgroundColor: 'transparent',
    },
    minHeight: '32px',
  },
})(Select)

const StyledOutlinedInput = withStyles({
  notchedOutline: {
    borderColor: '#0000003b !important',
    borderWidth: '1px !important',
  },
})(OutlinedInput)

const StyledInputLabel = withStyles({
  focused: {
    color: '#0000008a !important',
  },
})(InputLabel)

const TagSelect = ({ disabled, tags, handleTagsChange, availableTags }) => {
  return (
    <FormControl variant="outlined" className="tags">
      <StyledInputLabel id="tags-label" htmlFor="select-multiple-chip" shrink>
        Tags
      </StyledInputLabel>
      <StyledSelect
        id="tags"
        label="Tags"
        disabled={disabled}
        multiple
        value={tags}
        onChange={handleTagsChange}
        input={
          <StyledOutlinedInput
            id="select-multiple-chip"
            labelWidth={35}
            notched
          />
        }
        renderValue={(selected) => (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </div>
        )}
      >
        {availableTags.map((tag) => (
          <StyledMenuItem key={tag} value={tag} disableRipple>
            {tags.includes(tag) && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            {tag}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  )
}

export default TagSelect
