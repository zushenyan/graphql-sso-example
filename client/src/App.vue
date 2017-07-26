<template>
  <div id="app">
    <h1 v-if="error">{{ error }}</h1>
    <h1>Hello {{ currentUser.email || "Guest" }}</h1>
    <div v-if="!currentUser.email">
      <div>
        <h2>Sign Up</h2>
        <div>
          <label for="sign-up-email">email</label>
          <input type="text" name="sign-up-email" v-model="signUp.email">
        </div>
        <div>
          <label for="sign-up-password">password</label>
          <input type="password" name="sign-up-password" v-model="signUp.password">
        </div>
        <div>
          <label for="sign-up-confirm-password">confirm password</label>
          <input type="password" name="sign-up-confirm-password" v-model="signUp.confirmPassword">
        </div>
        <button v-on:click="signUpMethod">sign up</button>
      </div>
      <div>
        <h2>Sign In</h2>
        <div>
          <label for="sign-in-email">email</label>
          <input type="text" name="sign-in-email" v-model="signIn.email">
        </div>
        <div>
          <label for="sign-in-password">password</label>
          <input type="password" name="sign-in-password" v-model="signIn.password">
        </div>
        <div><button v-on:click="signInMethod">sign in</button></div>
        <div><button v-on:click="">sign in with facebook</button></div>
        <div><button v-on:click="">sign in with google</button></div>
      </div>
    </div>
    <div v-if="currentUser.email">
      <div>
        <h2>Update Profile</h2>
        <div>
          <label for="update-email">email</label>
          <input type="text" name="update-email" v-model="updateProfile.email">
        </div>
        <div>
          <label for="update-about">about</label>
          <textarea name="update-about" rows="8" cols="80" v-model="updateProfile.about" />
        </div>
        <button v-on:click="updateProfileMethod">update profile</button>
      </div>
      <div>
        <h2>Update Password</h2>
        <div>
          <label for="update-password">password</label>
          <input type="password" name="update-password" v-model="updateProfile.password">
        </div>
        <div>
          <label for="update-confirm-password">confirm password</label>
          <input type="password" name="update-confirm-password" v-model="updateProfile.confirmPassword">
        </div>
        <button v-on:click="updatePasswordMethod">update password</button>
      </div>
      <div>
        <h2>Sign Out</h2>
        <button v-on:click="signOutMethod">sign out</button>
      </div>
    </div>
    <div v-for="user in users" class="user">
      <br>
      <h2>{{ user.email }}</h2>
      <h6>created at: {{ user.created_at }}</h6>
      <h6>updated at: {{ user.updated_at }}</h6>
      <q>{{ user.about }}</q>
    </div>
  </div>
</template>

<script>
import {
  getAllUsers,
  getCurrentUser,
  signIn,
  signInWithFacebook,
  signInWithGoogle,
  signUp,
  updateUser,
  signOut
} from "@/utils/api";

export default {
  name: 'app',
  created(){
    document.addEventListener("fbInit", () => {
      console.log(`Facebook SDK is now available`);
    });
    document.addEventListener("googleInit", () => {
      console.log(`Google SDK is now available`);
    });
    this.getAllUsersMethod();
    this.getCurrentUserMethod();
  },
  data() {
    return {
      error:       "",
      currentUser: {},
      users:       [],
      signUp: {
        email:           "",
        password:        "",
        confirmPassword: ""
      },
      signIn: {
        email:    "",
        password: ""
      },
      updateProfile: {
        email: "",
        about: ""
      }
    };
  },
  methods: {
    checkErrorMethod(data){
      this.error = data.status[0] === "4" ? data.message : null;
    },
    updateCurrentUser(data){
      this.currentUser = data;
      this.updateProfile.email = this.currentUser.email || "";
      this.updateProfile.about = this.currentUser.about || "";
    },

    getAllUsersMethod(){
      return getAllUsers()
        .then((data) => {
          this.checkErrorMethod(data);
          this.users = data.users.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        })
        .catch((err) => {
          this.error = err;
        });
    },
    getCurrentUserMethod(){
      return getCurrentUser()
        .then((data) => {
          this.updateCurrentUser(data);
        })
        .catch((err) => {
          this.error = err;
        });
    },
    signInMethod(){
      const { email, password } = this.signIn;
      return signIn(email, password)
        .then((data) => {
          this.checkErrorMethod(data);
          this.updateCurrentUser(data);
        })
        .catch((err) => {
          this.error = err;
        });
    },
    signOutMethod(){
      return signOut()
        .then((data) => {
          this.checkErrorMethod(data);
          this.updateCurrentUser({});
        })
        .catch((err) => {
          this.error = err;
        });
    },
    signUpMethod(){
      const { email, password, confirmPassword } = this.signUp;
      return signUp(email, password, confirmPassword)
        .then((data) => {
          this.checkErrorMethod(data);
          this.updateCurrentUser(data);
        })
        .catch((err) => {
          this.error = err;
        })
        .then(this.getAllUsersMethod);
    },
    updateProfileMethod(){
      const { email, about } = this.updateProfile;
      return updateUser({ email, about })
        .then((data) => {
          this.checkErrorMethod(data);
          this.updateCurrentUser(data);
        })
        .catch((err) => {
          this.error = err;
        })
        .then(this.getAllUsersMethod);
    },
    updatePasswordMethod(){
      const { password, confirmPassword } = this.updateProfile;
      if(password.trim() !== confirmPassword.trim()){
        this.error = "passwords not match!";
        return;
      }
      return updateUser({ password })
        .then((data) => {
          this.checkErrorMethod(data);
          this.updateCurrentUser(data.status === "200" ? data : this.currentUser);
        })
        .catch((err) => {
          this.error = err;
        });
    }
    // signInWithGoogle(){
    //   gapi.auth2.getAuthInstance()
    //     .signInMethod()
    //     .then((user) => {
    //       const { id_token: token } = user.getAuthResponse();
    //       const query = `
    //         mutation jjj($token: String!){
    //           signInWithGoogle(token: $token){
    //             id
    //             email
    //             message
    //             token
    //             facebookId
    //             googleId
    //           }
    //         }
    //       `;
    //       fetchQL(query, { token })
    //         .then((data) => {
    //           this.email = data.data.signInWithGoogle.email;
    //           this.result = data;
    //         })
    //         .catch((data) => {
    //           this.result = data;
    //         });
    //     });
    // },
    // signInWithFacebook(){
    //   FB.login((res) => {
    //     const {
    //       authResponse: {
    //         userID: userId,
    //         accessToken
    //       }
    //     } = res;
    //     const query = `
    //       mutation kkk($userId: String!, $accessToken: String!){
    //         signInWithFacebook(userId: $userId, accessToken: $accessToken){
    //           id
    //           email
    //           message
    //           token
    //           facebookId
    //           googleId
    //         }
    //       }
    //     `;
    //     fetchQL(query, { userId, accessToken })
    //       .then((data) => {
    //         this.email  = data.data.signInWithFacebook.email;
    //         this.result = data;
    //       })
    //       .catch((err) => {
    //         this.result = err;
    //       })
    //   });
    // },
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

br {
  content: " ";
  display: block;
  width: 50%;
  height: 1px;
  margin: 10px auto 10px auto;
  border-top: 1px solid black;
}
</style>
