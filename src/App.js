import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import SpotifyCallback from "./components/SpotifyCallback";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={'/Login'} element={<Login/>}></Route>
          <Route path={'/Home'} element={<Home/>}></Route>
          <Route path={'/callback'} element={<SpotifyCallback/>}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
