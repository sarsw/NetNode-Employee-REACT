import './App.css';

// import the models we created
import {Home} from './Home'
import {Employee} from './Employee'
import {Department} from './Department'
import {Navigation} from './Navigation'

// From react router
import {BrowserRouter, Route, Switch} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="container">
      <h3 className="m-3 d-flex justify-content-center">
        React UI
      </h3>
      <Navigation/>
      <Switch>
        <Route path='/' component={Home} exact/>
        <Route path='/department' component={Department} exact/>
        <Route path='/employee' component={Employee} exact/>
      </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
