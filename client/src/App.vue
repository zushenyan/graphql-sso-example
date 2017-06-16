<template>
  <div id="app">
    <h1>hello {{ email }}</h1>
    <div>
      <h1>Result</h1>
      <button v-on:click="getUsers">get users</button>
      <button v-on:click="getCurrentUser">get current user</button>
      <pre>{{ result }}</pre>
    </div>
    <div>
      <h1>Sign Up</h1>
      <br>
      <label for="email">email</label>
      <input type="text" name="email" v-model="signUpEmail" />
      <br>
      <label for="password">password</label>
      <input type="password" name="password" v-model="signUpPassword" />
      <br>
      <label for="confirm-password">password</label>
      <input type="password" name="confirm-password" v-model="signUpConfirmPassword" />
      <br>
      <button v-on:click="signUp">sign up</button>
    </div>
    <div>
      <h1>Sign In</h1>
      <br>
      <label for="email">email</label>
      <input type="text" name="email" v-model="signInEmail" />
      <br>
      <label for="password">password</label>
      <input type="password" name="password" v-model="signInPassword" />
      <br>
      <button v-on:click="signIn">sign in</button>
      <br>
      <button v-on:click="signInWithFacebook">sign in with facebook</button>
      <br>
      <button v-on:click="signInWithGoogle">sign in with google</button>
    </div>
    <div>
      <h1>Sign Out</h1>
      <br>
      <button v-on:click="signOut">sign out</button>
    </div>
    <div>
      <h1>Set Message</h1>
      <label for="message">message</label>
      <input type="text" name="message" v-model="message">
      <br>
      <button v-on:click="setMessage">set message</button>
    </div>
    <div>
      <h1>Set Email</h1>
      <label for="new-email">email</label>
      <input type="text" name="new-email" v-model="newEmail">
      <br>
      <button v-on:click="setEmail">set email</button>
    </div>
  </div>
</template>

<script>
const fetchQL = (query, variables) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  const init = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  };
  return fetch("/graphql", init)
    .then((res) => res.json())
    .then((res) => res.errors ? Promise.reject(res) : res);
};

let data = {
  email:                 "guest",
  signInEmail:           "foobar@test.com",
  signInPassword:        "1234",
  signUpEmail:           "meow@test.com",
  signUpPassword:        "1111",
  signUpConfirmPassword: "1111",
  message:               "foobar lala",
  newEmail:              "poop@test.com",
  result:                ""
};

export default {
  name: 'app',
  created(){
    document.addEventListener("fbInit", () => {
      console.log(`Facebook SDK is now available`);
    });
    document.addEventListener("googleInit", () => {
      console.log(`Google SDK is now available`);
    })
  },
  data() { return data; },
  methods: {
    getUsers(){
      const query = `
        {
          getUsers{
            id
            email
            message
            token
            facebookId
            googleId
          }
        }
      `;
      fetchQL(query)
        .then((data) => {
          this.result = data;
        })
        .catch((err) => {
          this.result = err;
        });
    },
    getCurrentUser(){
      const query = `
        {
          getCurrentUser {
            id
            email
            message
            token
            facebookId
            googleId
          }
        }
      `;
      fetchQL(query)
        .then((data) => {
          this.result = data;
        })
        .catch((err) => {
          this.result = err;
        })
    },
    signInWithGoogle(){
      gapi.auth2.getAuthInstance()
        .signIn()
        .then((user) => {
          const { id_token: token } = user.getAuthResponse();
          const query = `
            mutation jjj($token: String!){
              signInWithGoogle(token: $token){
                id
                email
                message
                token
                facebookId
                googleId
              }
            }
          `;
          fetchQL(query, { token })
            .then((data) => {
              this.email = data.data.signInWithGoogle.email;
              this.result = data;
            })
            .catch((data) => {
              this.result = data;
            });
        });
    },
    signInWithFacebook(){
      FB.login((res) => {
        const {
          authResponse: {
            userID: userId,
            accessToken
          }
        } = res;
        const query = `
          mutation kkk($userId: String!, $accessToken: String!){
            signInWithFacebook(userId: $userId, accessToken: $accessToken){
              id
              email
              message
              token
              facebookId
              googleId
            }
          }
        `;
        fetchQL(query, { userId, accessToken })
          .then((data) => {
            this.email  = data.data.signInWithFacebook.email;
            this.result = data;
          })
          .catch((err) => {
            this.result = err;
          })
      });
    },
    signUp(){
      const query = `
        mutation qqq($email: String!, $password: String!, $confirmPassword: String!){
          signUp(email: $email, password: $password, confirmPassword: $confirmPassword){
            id
            email
            message
            token
            facebookId
            googleId
          }
        }
      `;
      const { signUpEmail: email, signUpPassword: password, signUpConfirmPassword: confirmPassword } = this;
      fetchQL(query, { email, password, confirmPassword })
        .then((data) => {
          this.email = data.data.signUp.email;
          this.result = data;
        })
        .catch((data) => {
          this.result = data;
        });
    },
    signIn(){
      const query = `
        mutation blah($email: String!, $password: String!){
          signIn(email: $email, password: $password){
            id
            email
            message
            token
            facebookId
            googleId
          }
        }
      `;
      const { signInEmail: email, signInPassword: password } = this;
      fetchQL(query, { email, password })
        .then((data) => {
          this.email = data.data.signIn.email;
          this.result = data;
        })
        .catch((data) => {
          this.result = data;
        });
    },
    signOut(){
      const query = `
        mutation {
          signOut
        }
      `;
      fetchQL(query)
        .then((data) => {
          this.email = "guest";
          this.result = data;
        })
        .catch((data) => {
          this.result = data;
        });
    },
    setMessage(){
      const query = `
        mutation weee($message: String!){
          setMessage(message: $message){
            id
            email
            message
            token
            facebookId
            googleId
          }
        }
      `;
      fetchQL(query, { message: this.message })
        .then((data) => {
          this.result = data;
        })
        .catch((data) => {
          this.result = data;
        });
    },
    setEmail(){
      const query = `
        mutation kkkkkk($newEmail: String!){
          setEmail(newEmail: $newEmail){
            id
            email
            message
            token
            facebookId
            googleId
          }
        }
      `;
      fetchQL(query, { newEmail: this.newEmail })
        .then((data) => {
          this.email = data.data.setEmail.email;
          this.result = data;
        })
        .catch((err) => {
          this.result = err;
        });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

pre {
  text-align: left;
}
</style>
