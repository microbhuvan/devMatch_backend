#list of api

## authRouter

POST /signup
POST /login
POST /logout

## profileRouter

GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## connectionRequestRouter

POST /request/send/accepted/:requestId
POST /request/send/ignored/:requestId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

## userRouter

GET /connections
GET /requests/received
GET /feed - gets you profiles of other users on platforms
