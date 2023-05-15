<template>
  <div class="container">
    <menu-fixture></menu-fixture>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { useRouter } from "vue-router";
import "firebase/auth";
import MenuFixture from "./components/MenuFixture.vue";

export default {
  components: {
    MenuFixture,
  },
  data() {
    return {
      isLogin: true,
      isRegister: true,
      userMail: "",
      router: useRouter(),
      isLoggedIn: false,
      auth: "",
      loginId: "",
    };
  },
  created() {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loginId = user.uid;
        this.isLoggedIn = true;
        user?.email;
        this.userMail = "Welcome " + user?.email;
        this.isLogin = !this.isLogin;
        this.isRegister = !this.isRegister;
      } else {
        this.isLoggedIn = false;
        this.userMail = "";
      }
    });
  },

  methods: {
    signOutUser() {
      this.isLogin = !this.isLogin;
      this.isRegister = !this.isRegister;
      signOut(this.auth).then(() => {
        this.router.push("/register");
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

#app {
  font-size: clamp(0.625rem, 0.2344rem + 1.25vw, 0.9375rem);
  font-family: "poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0;
  margin: auto;
  box-sizing: border-box;
  display: grid;
  place-items: center;
}

h1 {
  padding: 15px;
}
</style>
