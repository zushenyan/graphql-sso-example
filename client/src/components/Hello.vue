<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <button v-on:click="getUsers">get users</button>
    <button v-on:click="signIn">sign in as foobar@test.com</button>
    <button v-on:click="setMessage('foobar lalala')">setMessage to 'foobar lalala'</button>
  </div>
</template>

<script>
const fetchQL = (query, variables) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open("POST", "/graphql");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onload = function () {
    console.log('data returned:', xhr.response);
  }
  xhr.send(JSON.stringify({ query, variables }));
  return xhr;
};

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getUsers(e){
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
      fetchQL(query);
    },
    signIn(e){
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
      fetchQL(query, { email: "foobar@test.com", password: "1234" });
    },
    setMessage(message){
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
      fetchQL(query, { message });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
