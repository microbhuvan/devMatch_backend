import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoURL, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex items-center gap-4">
      <button
        className="btn btn-soft btn-secondary w-20 h-130"
        onClick={() => handleSendRequest("ignored", _id)}
      >
        Nope
      </button>
      <div className="card bg-base-300 w-84 shadow-sm">
        <figure>
          <img src={user.photoURL} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {user.firstName}
            <div className="badge badge-secondary">{gender}</div>
          </h2>
          <p>{user.about}</p>
          {user.skills?.length > 0 ? (
            <div className="card-actions">
              {user.skills.map((skill) => (
                <div key={skill} className="badge badge-outline badge-info">
                  {skill}
                </div>
              ))}
            </div>
          ) : (
            <p>no skills available</p>
          )}
          <div className="flex justify-around"></div>
        </div>
      </div>
      <button
        className="btn btn-soft btn-primary w-20 h-130 "
        onClick={() => handleSendRequest("interested", _id)}
      >
        Like
      </button>
    </div>
  );
};

export default UserCard;
