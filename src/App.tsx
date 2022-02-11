import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Generate from "./components/Generate";
import Survey from "./components/Survey";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const params = new URLSearchParams(window.location.search);
  const RID = params.get("RID");

  return (
    <div className="app">
      <Toaster position="bottom-center" />
      <Router>
        <Switch>
          <Route exact path="/">
            {RID !== null ? <Survey /> : <Redirect to="/generate" />}
          </Route>
          <Route exact path="/generate" component={Generate} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
