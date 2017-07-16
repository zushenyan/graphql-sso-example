const {
  responseFormatter,
  errorFormatter
} = require("./formatter.js");

describe("formatter", () => {
  it("responseFormatter should work", () => {
    const data  = {
      sub:         "google_1234567",
      email:       "foofoo@test.com",
      family_name: "foo",
      given_name:  "bar",
    };
    const response = {
      id:        data.sub,
      email:     data.email,
      firstName: data.family_name,
      lastName:  data.given_name
    };
    const login = { getPayload: () => data };
    expect(responseFormatter(login)).toEqual(response);
  });

  it("errorFormatter should work", () => {
    const error = { message: "weeee" };
    expect(errorFormatter(error)).toEqual(error);
  });
});
