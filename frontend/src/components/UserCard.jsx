import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const UserCard = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <button className="btn btn-soft btn-secondary w-20 h-130">Nope</button>
      <div className="card bg-base-300 w-84 shadow-sm">
        <figure>
          <img src={user.photoURL} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {user.firstName}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p>{user.about}</p>
          <div className="card-actions">
            {user.skills.map((skill) => (
              <div key={skill} className="badge badge-outline badge-info">
                {skill}
              </div>
            ))}
          </div>
          <div className="flex justify-around"></div>
        </div>
      </div>
      <button className="btn btn-soft btn-primary w-20 h-130 ">Like</button>
    </div>
  );
};

export default UserCard;
