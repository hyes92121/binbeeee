import React from 'react'
import axios from 'axios'

class OCRForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'OCR', imageValue: null, showResult: false, init: true, idx: 0}; // default uses the old OCR api
    this.apiArgs = { version: "v3.0/ocr", args: { language: "en" } }
    this.submitResult = null;
    this.dropDownRef = React.createRef();

    // Without the above, we would need to do onChange={(e) => this.handleChange(e)}
    this.handleChange = this.handleChange.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateProperties = this.updateProperties.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value,  });
  }

  handleImage(event) {
    this.setState({ imageValue: event.target.files[0] })
  }

  handleSubmit(event) {
    event.preventDefault()
    let formData = new FormData()
    formData.append('file', this.state.imageValue)
    formData.append('body', JSON.stringify(this.apiArgs))
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1])
    }

    axios({
      method: 'post',
      url: 'upload-react',
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(response => {
        console.log(response)
        this.submitResult = response.data;
        this.setState({ showResult: true });
      })
      .catch(errors => console.log(errors))
  }

  updateProperties(event) {
    console.log(event.target.value)
    switch (event.target.id) {
      case "API_OCR":
      case "API_Read":
        this.apiArgs.args.language = event.target.value
        break
      case "API_Recognize":
        this.apiArgs.args.mode = event.target.value
        break
    }
    console.log(`Using ${this.apiArgs.version} with arguments ${JSON.stringify(this.apiArgs.args)}`)
  }

  showOptions() {
    let selectPrompt, options, id;

    switch (this.state.value) {
      case "OCR":
        this.apiArgs = { version: "v3.0/ocr", args: { language: "en" } }
        selectPrompt = 'Target Language'
        id = 'API_OCR'
        options = [
          ['en', 'English'], 
          ['zh-Hans', 'Simplified Chinese'], 
          ['zh-Hant', 'Traditional Chinese']
        ]
        break
      case "Recognize-Text":
        this.apiArgs = { version: "v2.1/recognizeText", args: { mode: "Printed" } }
        selectPrompt = (<label>Select Mode:</label>)
        id = 'API_Recognize'
        options = [
          ['Printed', 'Printed'], 
          ['Handwritten', 'Handwritten'], 
        ]
        break
      case "Read":
        this.apiArgs = { version: "v3.0/read/analyze", args: { language: "en" } }
        selectPrompt = (<label>Target Language:</label>)
        id = 'API_Read'
        options = [
          ['en', 'English'], 
          ['es', 'Spanish'], 
        ]
        break
    }

    let container = (
      <div>
        <label>{selectPrompt}</label>
        <select value={this.state.idx} id={id} onChange={this.updateProperties}>
          {options.map((_option, _id) => (
            <option key={_option[0]} value={_option[0]}>
              {_option[1]}
            </option>
          ))}
        </select>
      </div>
    )

    console.log(`Using ${this.apiArgs.version} with arguments ${JSON.stringify(this.state.idx)}`)
    return container
  }

  render() {
    let display = null;
    if (this.submitResult) {
      if (this.submitResult.serverError) {
        console.log(this.submitResult.errorMsg)
        display = (
          <div className="error-box">
            <h3>Internal Server Error</h3>
            <p>Please contact t-keawan@microsoft.com for more support</p>
          </div>
        )
      } else {
        display = (
          <div>
            <br /><br />
            <img className="OCRResult-img" src={this.submitResult.imgLink} alt="User Image" />
            <br /><br />
            <div className="text-center">
              <a className="btn btn-primary" href={this.submitResult.JSONLink} download="result.json">Download JSON file</a>{" "}
            </div><br />
          </div>
        )
      }
    }

    return (
      <form onSubmit={this.handleSubmit} encType="multipart/form-data">
        <div className="file-input">
          <input type="file" name="image" onChange={this.handleImage} /><br />
        </div>
        <label>
          <label>Choose an API:</label>
          <select name="api_form" value={this.state.value} onChange={this.handleChange}>
            <option value="OCR">OCR (3.0)</option>
            <option value="Recognize-Text">Recognize-Text (2.1)</option>
            <option value="Read">Read (3.0)</option>
          </select><br />
          <label>{this.showOptions()}</label>
        </label>
        <br />
        <div className="text-center">
          <input className="btn btn-primary" type="submit" value="Submit"></input>
        </div>
        <div className="AfterSubmit">
          {display}
        </div>
      </form>
    );
  }
}

export default OCRForm; 