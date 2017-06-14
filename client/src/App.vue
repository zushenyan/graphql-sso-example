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
    </div>
    <div>
      <h1>Sign Out</h1>
      <br>
      <button v-on:click="signOut">sign out</button>
    </div>
    <div>
      <h1>Set Message</h1>
      <label for="message">message</label>
      <input type="text" name="" v-model="message">
      <br>
      <button v-on:click="setMessage">set message</button>
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
  email: "guest",
  signInEmail: "foobar@test.com",
  signInPassword: "1234",
  signUpEmail: "meow@test.com",
  signUpPassword: "1111",
  signUpConfirmPassword: "1111",
  message: "foobar lala",
  result: ""
};

export default {
  name: 'app',
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
    signUp(){
      const query = `
        mutation qqq($email: String!, $password: String!, $confirmPassword: String!){
          signUp(email: $email, password: $password, confirmPassword: $confirmPassword){
            id
            email
            message
            token
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
          }
        }
      `;
      fetchQL(query, { email: "foobar@test.com", password: "1234" })
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
