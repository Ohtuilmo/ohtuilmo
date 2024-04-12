import React from 'react'

import SingleGroupEdit from './SingleGroupEdit'
import SingleGroupView from './SingleGroupView'

class GroupViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
  }

  toggleEditMode = () => {
    this.setState((prevState) => ({
      editMode: !prevState.editMode
    }))
    if (this.state.editMode) {
      this.props.setSuccess(
        `Editing for group ${this.props.group.name} disabled!`
      )
    } else {
      this.props.setSuccess(
        `Editing for group ${this.props.group.name} enabled!`
      )
    }
  }

  render() {
    if (this.state.editMode) {
      return (
        <SingleGroupEdit
          group={this.props.group}
          toggleEditMode={this.toggleEditMode}
        />
      )
    } else {
      return (
        <div>
          <SingleGroupView
            group={this.props.group}
            topics={this.props.topics}
            users={this.props.users}
            deleteFromGroupAction={this.props.deleteFromGroupAction}
            toggleEditMode={this.toggleEditMode}
            setSuccess={this.props.setSuccess}
            setError={this.props.setError}
          />
        </div>
      )
    }
  }
}

export default GroupViewer
