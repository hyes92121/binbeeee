import React from 'react';
import axios from 'axios';
import {GlassMagnifier} from 'react-image-magnifiers'
import '../styles/OCRForm.css'

const APIs = [
  [
    "v3.0/ocr",
    "OCR (3.0)",
    [["en", "English"], ["zh-Hans", "Simplified Chinese"], ["zh-Hant", "Traditional Chinese"]]
  ],
  [
    "v2.1/recognizeText",
    "Recognize-Text (2.1)",
    [["Printed", "Printed"], ["Handwritten", "Handwritten"]]
  ],
  [
    "v3.0/read/analyze",
    "Read (3.0)",
    [["en", "English"], ["es", "Spanish"]]
  ]
]

const value_to_index = {}
for (let i = 0; i < APIs.length; i++) {
  value_to_index[APIs[i][1]] = i;
  const options = APIs[i][2];
  for (let j = 0; j < options.length; j++) {
    value_to_index[options[j][1]] = j;
  }
}

const idxToAPI = (api_idx) => APIs[api_idx][1];
const idxToOption = (api_idx, option_idx) => APIs[api_idx][2][option_idx][1];

const toAPIArgs = (api_idx, option_idx) => {
  const APIArgs = { version: APIs[api_idx][0] };
  if (api_idx === 1) {
    APIArgs["args"] = { mode: APIs[1][2][option_idx][0] };
  }
  else {
    APIArgs["args"] = { language: APIs[api_idx][2][option_idx][0] };
  }
  return APIArgs;
}

class OCRForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { API_idx: 0, option_idx: 0, imageValue: null, showResult: false, init: true };
    this.submitResult = null;
  }

  handleAPIChange = (event) => {
    const newAPI_idx = value_to_index[event.target.value] | 0 ;
    this.setState({ API_idx: newAPI_idx, option_idx: 0});
    console.log(toAPIArgs(newAPI_idx, 0));
  }

  handleImage = (event) => {
    this.setState({ imageValue: event.target.files[0] })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const apiArgs = toAPIArgs(this.state.API_idx, this.state.option_idx);
    let formData = new FormData()
    formData.append('file', this.state.imageValue)
    formData.append('body', JSON.stringify(apiArgs))
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1])
    }

    axios({
      method: 'post',
      // url: 'upload-react',
      url: '//localhost:8000/OCR/upload-react',
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

  handleOptionChange = (event) => {
    const new_option_index = value_to_index[event.target.value] | 0;
    this.setState({ option_idx: new_option_index });
    console.log(toAPIArgs(this.state.API_idx, new_option_index));
  }
// //<img className="OCRResult-img" src={this.submitResult.imgLink} alt="User Image" />
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
            <div className="OCRResult-img">
              <div className="img-show-area">
                <GlassMagnifier
                  imageSrc={this.submitResult.imgLink}
                  largeImageSrc={this.submitResult.imgLink}
                  magnifierSize="40%"
                  square="true"
                />
              </div>
            </div>
            <div className="download-row">
              <div className="download-column">
                <div className="col-align-right">
                  <a className="btn btn-primary" href={this.submitResult.imgLink} download="image.json">Download full image</a>{" "}
                </div>
              </div>
              <div className="download-column">
                <div className="col-align-left">
                  <a className="btn btn-primary" href={this.submitResult.JSONLink} download="result.json">Download JSON file</a>{" "}
                </div>
              </div>
            </div><br />
          </div>
        )
      }
    }

    return (
      <form onSubmit={this.handleSubmit} encType="multipart/form-data">
        <div className="file-input">
          <input type="file" name="image" onChange={this.handleImage} /><br /><br />
        </div>
        <label>Choose an API:</label>
        <select name="api_form" value={idxToAPI(this.state.API_idx)} onChange={this.handleAPIChange}>
          {APIs.map(_API => (
            <option value={_API[1]} key={_API[0]}>{_API[1]}</option>
          ))}
        </select><br />
        <label>{this.state.API_idx === 1 ? "Select Mode:" : "Target Language:"}</label>
        <select
          name="dropDown"
          value={idxToOption(this.state.API_idx, this.state.option_idx)}
          onChange={this.handleOptionChange}
        >
          {APIs[this.state.API_idx][2].map(_option => (
            <option value={_option[1]} key={_option[0]}>{_option[1]}</option>
          ))}
        </select>
        <br /><br />
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