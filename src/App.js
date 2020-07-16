import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import img_1 from "./image/1.jpg";
import img_3 from "./image/3.jpg"
import NavBar from './components/NavBar';
import MyMenu from './components/Menu'
import OCRForm from './containers/OCRForm'
import LayoutForm from './containers/LayoutForm'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { Grid } from 'semantic-ui-react'

const props = { imageSrc: img_1, largeImageSrc: img_3, magnifierSize: "25%" };

function App() {

  return (
    <div>
      <NavBar />
      <div className="container-fluid">
        <Router>
          <Grid>
            <MyMenu/>
            {/* A <Switch> looks through its children <Route>s and
                  renders the first one that matches the current URL. */}
            <Grid.Column width={12}>
              <Switch>
                <Route exact path="/">
                    <h1>Home</h1>
                </Route>
                <Route exact path="/ocr">
                    <OCRForm />
                </Route>
                <Route exact path="/layout">
                    <LayoutForm />
                </Route>
                <Route exact path="/translate">
                    <h1>translate</h1>
                </Route>
              </Switch>
            </Grid.Column>
          </Grid>
        </Router>
      </div>
    </div>
  );
}

export default App;
