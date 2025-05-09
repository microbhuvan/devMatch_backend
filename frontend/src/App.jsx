import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import EditProfile from "./components/EditProfile";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes basepath="/">
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />}>
                <Route path="edit" element={<EditProfile />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
