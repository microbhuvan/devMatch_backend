import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
//some changes

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setgender] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [age, setAge] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          gender,
          age,
          about,
          photoURL,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card card-border bg-base-300 w-96 m-auto ">
      <form>
        <div className="card-body">
          <h2 className="card-title">Edit Profile</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="firstname"
              className="input input-primary"
            />
            <input
              type="text"
              placeholder="lastname"
              className="input input-primary"
            />
            <input
              type="text"
              placeholder="gender"
              className="input input-primary"
            />
            <input
              type="number"
              placeholder="age"
              className="input input-primary"
            />
            <input
              type="text"
              placeholder="photoURL "
              className="input input-primary"
            />
            <input
              type="text"
              placeholder="about"
              className="input input-primary"
            />
          </div>
          <button className="btn btn-primary" onClick={saveProfile}>
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
