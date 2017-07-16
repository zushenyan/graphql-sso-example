module.exports.responseFormatter = (data) => {
  return {
    id:        data.id,
    email:     data.email,
    firstName: data.first_name,
    lastName:  data.last_name
  };
};
module.exports.errorFormatter    = (err) => err.response ? err.response.data.error.message : err;
