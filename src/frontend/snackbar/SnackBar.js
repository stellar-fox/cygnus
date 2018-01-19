import React, {Component} from 'react'
import Snackbar from 'material-ui/Snackbar'

const styles = {
  body: {
    backgroundColor: 'rgb(244,176,4)',
  },
  content: {
    color: 'rgb(15,46,83)',
  }
}

export default class SnackBar extends Component {
  render() {
    return (
      <Snackbar
        bodyStyle={styles.body}
        contentStyle={styles.content}
        open={this.props.open}
        message={this.props.message}
        autoHideDuration={3500}
        onRequestClose={this.props.onRequestClose}
      />
    )
  }
}
