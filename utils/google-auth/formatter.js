module.exports.responseFormatter = (data) => {
  const result = data.getPayload();
  return {
    id:        result.sub,
    email:     result.email,
    firstName: result.family_name,
    lastName:  result.given_name
  };
};
module.exports.errorFormatter    = (err) => err;
