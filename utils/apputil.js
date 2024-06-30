exports.sendErrorResponse = (code, status, message, res, statusCode) => {
  let response = {}
  response['code'] = code
  response['status'] = status
  let jsonMessage = {"message": message}
  response['data'] = jsonMessage;
  res.status(statusCode).send(response)
}