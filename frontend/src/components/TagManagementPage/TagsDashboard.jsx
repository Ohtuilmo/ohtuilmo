import React, { useState, useEffect, useRef } from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { DeleteOutlineRounded } from '@material-ui/icons'
import tagService from '../../services/tags'
import './TagsDashboard.css'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as notificationActions from '../../reducers/actions/notificationActions'
import ConfirmationDialog from '../common/ConfirmationDialog'

const TagsPage = (props) => {
  const [allTags, setAllTags] = useState([])
  const [tagTitle, setTagTitle] = useState('')
  const isMounted = useRef(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState(null)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedData = await tagService.getTags()
        if (isMounted.current) {
          setAllTags(fetchedData)
        }
      } catch (error) {
        console.error('Error fetching tags:', error.message, ' / ', error.response.data.error)
        if (error.response && error.response.data && error.response.data.error) {
          props.setError(error.response.data.error)
        } else {
          props.setError('An error occurred while fetching tags.')
        }
      }
    }
    fetchTags()
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleAddTag = async () => {
    const tag = {
      title: tagTitle,
    }

    try {
      const updatedTags = await tagService.createTag(tag)
      setAllTags(updatedTags)
      clearForm()
      props.setSuccess('Tag created successfully.')
    } catch (error) {
      console.error('Error fetching tags:', error.message, ' / ', error.response.data.error)
      props.setError(error.response.data.error, 3000)
    }
  }

  const clearForm = () => {
    setTagTitle('')
  }

  const handleDeleteTag = async (tagId) => {
    try {
      const updatedTags = await tagService.deleteTag(tagId)
      setAllTags(updatedTags)
      props.setSuccess('Tag deleted successfully.')
    } catch (error) {
      console.error('Error fetching tags:', error.message, ' / ', error.response.data.error)
      props.setError(error.response.data.error)
    }
  }

  return (
    <div className="tags-container">
      <Typography variant="h4">Add new tag</Typography>
      <div className="spacer"></div>
      <div className="add-tag-container">
        <TextField
          className="tag-title"
          id="tagTitle"
          label="Tag Title"
          aria-describedby="tagName"
          type="text"
          value={tagTitle}
          onChange={(e) => setTagTitle(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      </div>
      <Button
        variant="contained"
        className="button"
        onClick={handleAddTag}
        style={{
          backgroundColor: '#188433',
          color: 'white',
          borderRadius: '8px',
          boxShadow: 'none',
          fontWeight: 'bolder',
        }}
      >
        Add Tag
      </Button>
      <div className="tag-list-container">
        <table>
          <thead>
            <tr>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {allTags.map((tag) => (
              <tr key={tag.id}>
                <td>{tag.title}</td>
                <td>
                  <Button
                    onClick={() => {
                      setTagToDelete(tag.id)
                      setConfirmOpen(true)
                    }}
                    className='delete-tag-button'
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmationDialog
          title="Delete Tag?"
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={() => handleDeleteTag(tagToDelete)}
        >
          Delete this tag? It cannot be restored.
        </ConfirmationDialog>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
}

const mapStateToProps = (state) => ({
  state: state,
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TagsPage)
)
