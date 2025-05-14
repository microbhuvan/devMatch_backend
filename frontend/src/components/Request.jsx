import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addRequests } from "../utils/requestSlice";
import { useEffect } from "react";

const Request = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const fetchRequest = async () => {
    const res = await axios.post(BASE_URL + "/user/request/received", {
      withCredentials: true,
    });
    console.log(res.data.data);
    dispatch(addRequests(res.data.data));
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return;

  if (requests.length === 0) return <h1>no requests found</h1>;
  return (
    <div>
      <h1>hi from </h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, photoURL, age, gender, about } =
          request.fromUserId;

        return (
          <div key={_id}>
            <div>
              <img alt="photo" src={photoURL} />
            </div>

            <div>
              <h2>{firstName + " " + lastName}</h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>about</p>
            </div>
            <div>
              <button onClick={() => reviewRequest("rejected", request._id)}>
                Reject
              </button>
              <button onClick={() => reviewRequest("accepted", request._id)}>
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Request;
