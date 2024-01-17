import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Topic from './Topic'
import Typography from '@material-ui/core/Typography'

class TopicDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }

    this.handleClose = this.handleClose.bind(this)
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    return (
      <Card style={{ margin: '2px', height: '78px' }}>
        <CardContent
          style={{ padding: '15px', display: 'flex', flexDirection: 'row' }}
        >
          <div style={{ flex: 4 }}>
            <Typography style={{ flex:  1, fontWeight: 'bold', color: 'gray' }}>{this.props.topic.content.title}</Typography>
            <Typography style={{ flex: 1, fontWeight: 'bold', color: 'gray' }}>Customer: {this.props.topic.content.customerName}</Typography>
          </div>
          <Button variant="outlined" style={{ flex: 1, maxHeight: '42px' }} onClick={() => this.setState({ open: true })}>Details</Button>
        </CardContent>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
        >
          <DialogContent>
            <Topic content={this.props.topic.content}/>
          </ DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} variant='outlined'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    )
  }
}

export default TopicDialog