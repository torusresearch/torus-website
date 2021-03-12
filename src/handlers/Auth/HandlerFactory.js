import FacebookHandler from './FacebookHandler'
// import OpenLoginHandler from './OpenLoginHandler'

const createHandler = ({ typeOfLogin, clientId, verifier, redirect_uri, preopenInstanceId, jwtParameters }) => {
  if (!verifier || !typeOfLogin || !clientId) {
    throw new Error('Invalid params')
  }
  return new FacebookHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, jwtParameters })
  // return new OpenLoginHandler({ clientId, verifier, redirect_uri, typeOfLogin, preopenInstanceId, jwtParameters })
}

export default createHandler
