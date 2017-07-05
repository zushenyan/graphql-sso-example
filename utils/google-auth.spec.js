const { googleAuthVerify } = require("./google-auth.js");

const testAccount = {
  idToken:
  `eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc4ZDk3ODk0MTc1ZjRlMTY3MTc2OTAyNmE1ODAyYTAwNGVmZDhhMzkifQ.eyJhenAiOiIyNTE3MDU0MzA2NTgtOHNydmwyYzRsaXNzY2hmbGs1cG1kNHRnZ21qY2Zra3AuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTE3MDU0MzA2NTgtOHNydmwyYzRsaXNzY2hmbGs1cG1kNHRnZ21qY2Zra3AuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDY0OTM2OTM1MDA0ODY4MTgxNjQiLCJlbWFpbCI6ImZvb2JhcnJvYm90QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiVnVNUjhVeHNIcWRvdm5HRkpyZG5NZyIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTkyNzEzMDQsImV4cCI6MTQ5OTI3NDkwNCwibmFtZSI6ImZvbyBiYXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy05QmtGUGJqc1pkNC9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBYy9IN2xKTXVLUWlMUS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiZm9vIiwiZmFtaWx5X25hbWUiOiJiYXIiLCJsb2NhbGUiOiJlbiJ9.Os2B9SAxZmSXf8CUlnSCFABEM5OTnn-oQaE6IK1XJ3JM8DlQQGAOq453zgdxPELwPHlDLGV9i58JG7LBEdNNAk6fu8lsEQrBcfwj38EAGjbWnPc-4VKYHltoKRjO7byhWt1pxSsifSXQ4qJB-D0-wpvqUkui-yhLjO6mtm_4SBZiap2ydTp0WgLMLJQprkkK3Y50A2lyktPmquwd1mtD1nB8l9lsJWd5HFPbdudqv4n_k0wC0gscKUZRKTtrANYJzDgfV8wbizLC2V7XP6YeqmqhEQasCsT1MmdlB0TT6qrYk9K8WGNpgbAnfeMEMkm8U7KxPUm-BSSG0OPdWe9YBA`
};

describe("utils/google-auth.js", () => {
  it("should successfully verify", async () => {
    const result = await googleAuthVerify(testAccount.idToken);
    expect(result).toBeDefined();
  });

  it("should fail", async () => {
    expect(googleAuthVerify("no such token")).rejects.toBeDefined();
  });
});
