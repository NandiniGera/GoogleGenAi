import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Navbar from './Components/NavBar';
import Chatbot from './Components/Chatbot/Chat';
import Logout from './Components/Logout';

function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>  
          <Route path='/' element = {<LandingPage/>}/>
          <Route path='/login' element = {<Login/>}/>
          <Route path='/logout' element = {<Logout/>}/>
          <Route path='/signup' element = {<SignUp/>}/>
          <Route path='/chatbot' element = {<Chatbot/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
