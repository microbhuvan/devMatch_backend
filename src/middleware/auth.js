const adminAuth = (req, res, next) => {
  console.log("checking admin auth");
  let token = "xyz";
  let isAuthorized = (token) => {
    return token === "xyz";
  };
  if (!isAuthorized) {
    res.status(401).send("admin is unauthorized");
  } else {
    console.log("admin authorized");
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("checking admin auth");
  let token = "xyz";
  let isAuthorized = (token) => {
    return token === "xyz";
  };
  if (!isAuthorized) {
    res.status(401).send("user is unauthorized");
  } else {
    console.log("user authorized");
    next();
  }
};

module.exports = {
  adminAuth: adminAuth,
  userAuth,
};
