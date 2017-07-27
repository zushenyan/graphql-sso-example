<template>
  <div id="app">
    <transition name="fade">
      <h1 v-if="showError" class="error">{{ error }}</h1>
    </transition>
    <transition name="fade">
      <h1 v-if="showMessage" class="message">{{ message }}</h1>
    </transition>
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
        <div><button v-on:click="signInWithFacebookMethod">sign in with facebook</button></div>
        <div><button v-on:click="signInWithGoogleMethod">sign in with google</button></div>
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
      message:     "",
      showMessage: false,
      error:       "",
      showError:   false,
      currentUser: {},
      users:       [],
      signUp:      {
        email:           "",
        password:        "",
        confirmPassword: ""
      },
      signIn: {
        email:    "",
        password: ""
      },
      updateProfile: {
        email:           "",
        about:           "",
        password:        "",
        confirmPassword: ""
      }
    };
  },
  methods: {
    setMessageMethod(message, data){
      const shouldShowMessage = data.status[0] === "2";
      if(shouldShowMessage){
        this.showMessage = true;
        this.message     = this.showMessage ? message : this.message;
        setTimeout(() => this.showMessage = false, 2000);
      }
    },
    checkErrorMethod(data){
      const shouldShowError = data.status[0] === "4" || data.status[0] === "5";
      if(shouldShowError){
        this.showError = true;
        this.error     = this.showError ? data.message : this.error;
        setTimeout(() => this.showError = false, 2000);
      }
    },
    updateCurrentUserMethod(data){
      this.currentUser = data;
      const {
        email = "",
        about = "",
        password = "",
        confirmPassword = ""
      } = this.currentUser;
      this.updateProfile = { email, about, password, confirmPassword };
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
          this.updateCurrentUserMethod(data);
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
          this.updateCurrentUserMethod(data);
          this.setMessageMethod("sign in successfully!", data);
        })
        .catch((err) => {
          this.error = err;
        });
    },
    signOutMethod(){
      return signOut()
        .then((data) => {
          this.checkErrorMethod(data);
          this.updateCurrentUserMethod({});
          this.setMessageMethod("sign out successfully!", data);
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
          this.updateCurrentUserMethod(data);
          this.setMessageMethod("sign up successfully!", data);
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
          this.updateCurrentUserMethod(data);
          this.setMessageMethod("update profile successfully!", data);
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
          this.updateCurrentUserMethod(data.status === "200" ? data : this.currentUser);
          this.setMessageMethod("update password successfully!", data);
        })
        .catch((err) => {
          this.error = err;
        });
    },
    signInWithGoogleMethod(){
      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then((user) => {
          const { id_token: token } = user.getAuthResponse();
          signInWithGoogle(token)
            .then((data) => {
              this.checkErrorMethod(data);
              this.updateCurrentUserMethod(data);
              this.setMessageMethod("sign in successfully!", data);
            })
            .catch((err) => {
              this.error = err;
            })
            .then(this.getAllUsersMethod);
        });
    },
    signInWithFacebookMethod(){
      FB.login((res) => {
        const {
          authResponse: {
            userID: userId,
            accessToken
          }
        } = res;
        signInWithFacebook(userId, accessToken)
          .then((data) => {
            this.checkErrorMethod(data);
            this.updateCurrentUserMethod(data);
            this.setMessageMethod("sign in successfully!", data);
          })
          .catch((err) => {
            this.error = err;
          })
          .then(this.getAllUsersMethod);
      });
    },
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

.error {
  background-color: red;
  color: white;
}

.message {
  background-color: lightgreen;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
