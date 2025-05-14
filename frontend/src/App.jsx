import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";

import Feed from "./components/Feed";
import EditProfile from "./components/EditProfile";
import Connections from "./components/Connections";
import Request from "./components/Request";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes basepath="/">
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />}>
              <Route path="edit" element={<EditProfile />} />
            </Route>
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Request />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
