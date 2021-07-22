import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home';
import Form from './components/Post/Form';
import PostDetail from './components/Post/Detail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header> 
          <div id="topbar">
            <Link to="/">
              <div className="logo">
                Awesome Blog
              </div>
            </Link>
          </div>
        </header>
        <div className="box">
          <Switch>        
            <Route exact path="/" component={Home} />
            <Route exact path="/add" component={Form} />
            <Route exact path="/post/:postId" component={PostDetail} />
          </Switch>
        </div>
        <footer>	
          <div id="footer">
            &copy; 2021 Awesome Blog.		
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
