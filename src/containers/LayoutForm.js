import React from 'react';
import axios from 'axios';

class LayoutForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} encType="multipart/form-data">
        <div className="file-input">
          <input type="file" name="image" /><br /><br />
        </div>
      </form >
    )
  }
}

export default LayoutForm; 