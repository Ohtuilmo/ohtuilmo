import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import tagService from '../../services/tags'
//import { NotInGroupPlaceholder } from '../common/Placeholders'
import './TagsDashboard.css'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
//import myGroupActions from '../../reducers/actions/myGroupActions'

const TagsPage = (props) => {
  console.log('TagsPage props:', props)
  // const [allSprints, setAllSprints] = useState([])
  // const [sprintNumber, setSprintNumber] = useState('')
  // const [startDate, setStartDate] = useState('')
  // const [endDate, setEndDate] = useState('')
  const [allTags, setAllTags] = useState([])
  const [tagTitle, setTagTitle] = useState('')

  //const { group, studentNumber, initializeMyGroup } = props

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedData = await tagService.getTags()
        setAllTags(fetchedData)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }
    fetchTags()
  }, [])

  const handleAddTag = async () => {
    const tag = {
      title: tagTitle,
    }

    try {
      const updatedTags = await tagService.createTag(tag)
      setAllTags(updatedTags)
      clearForm()
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  const clearForm = () => {
    setTagTitle('')
  }

  const handleDeleteTag = async (tagId) => {
    try {
      const updatedTags = await tagService.deleteTag(tagId)
      setAllTags(updatedTags)
    } catch (error) {
      console.error('Error deleting sprint:', error)
    }
  }

  //if (!group) return <NotInGroupPlaceholder />

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
              <th>Tag Title</th>
            </tr>
          </thead>
          <tbody>
            {allTags.map((tag) => (
              <tr key={tag.id}>
                <td>{tag.title}</td>
                <td>
                  <Button
                    onClick={() => handleDeleteTag(tag.id)}
                    className = 'delete-tag-button'
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
      </div>
    </div>
  )
}

// const mapDispatchToProps = {
//   initializeMyGroup: myGroupActions.initializeMyGroup,
// }

const mapStateToProps = (state) => ({
  studentNumber: state.login.user.user.student_number,
  group: state.registrationDetails.myGroup,
})

export default withRouter(
  connect(mapStateToProps)(TagsPage)
)
