const {
  responseFormatter,
  errorFormatter
} = require("utils/facebook-auth/formatter.js");

describe("formatter", () => {
  it("responseFormatter should work", () => {
    const data = {
      id:        "123",
      email:     "meow@test.com",
      first_name: "me",
      last_name:  "ow",
    };
    const response = {
      id:        data.id,
      email:     data.email,
      firstName: data.first_name,
      lastName:  data.last_name,
    };
    expect(responseFormatter(data)).toEqual(response);
  });

  it("errorFormatter should work", () => {
    const error1 = {
      response: {
        data: {
          error: {
            message: "weeee"
          }
        }
      }
    };
    const error2 = {
      message: "lalalal"
    };
    expect(errorFormatter(error1)).toEqual(error1.response.data.error.message);
    expect(errorFormatter(error2)).toEqual(error2);
  });
});
