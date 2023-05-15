<template>
  <div class="wrapper">
    <nav class="navbar navbar-dark bg-primary">
      <div class="menu">
        <i class="fa-solid fa-bars myIcon" @click="toggle()"></i>
        <a href="#header" class="navbar-brand">LOGO</a>
      </div>
      <ul class="toggleClass">
        <li class="nav-item">
          <router-link class="nav-link" to="/" v-if="isLoggedIn"
            >Fixture Builder</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/userpage" v-if="isLoggedIn"
            >My Fixtures <span></span
          ></router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            to="/register"
            :style="{ display: isRegister ? 'flex' : 'none' }"
            >Register</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            to="/login"
            :style="{ display: isLogin ? 'flex' : 'none' }"
            >Login</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            @click="signOutUser"
            v-if="isLoggedIn"
            to="/login"
            >Sign Out</router-link
          >
        </li>
        <li class="nav-item p-2 text-light">
          <span><i v-if="isLoggedIn" class="fa-solid fa-user"></i></span>
          {{ userMail }}
        </li>
      </ul>
    </nav>

    <h1 class="mb-5 mt-5">Fixture and Scoreboard maker</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { useRouter } from "vue-router";
import "firebase/auth";

export default {
  data() {
    return {
      isLogin: true,
      isRegister: true,
      userMail: "",
      router: useRouter(),
      isLoggedIn: false,
      auth: "",
      loginId: "",
      userIdLogin: "",
      numFixtures: "",
    };
  },
  created() {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loginId = user.uid;
        this.isLoggedIn = true;

        this.userMail = user?.email;
        this.isLogin = !this.isLogin;
        this.isRegister = !this.isRegister;
      } else {
        this.isLoggedIn = false;
        this.userMail = "";
      }
    });
  },
  mounted() {},

  methods: {
    toggle() {
      const menubarIcon = document.querySelector(".toggleClass");
      menubarIcon.classList.toggle("active");
    },
    signOutUser() {
      this.isLogin = !this.isLogin;
      this.isRegister = !this.isRegister;
      signOut(this.auth).then(() => {
        this.router.push("/register");
      });
      localStorage.removeItem("user");
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: clamp(0.625rem, 0.4844rem + 0.75vw, 1rem);
}
nav {
  width: 100vw;
}

body {
  background-color: #b3b4b6;
  font-family: "poppins", sans-serif;
  color: white;
  font-size: clamp(0.625rem, 0.2344rem + 1.25vw, 0.9375rem);
}
h1 {
  font-size: 25px !important;
}
.wrapper {
  display: grid;
  place-items: center;
  max-width: 100vw;
}
.navClass {
  display: flex;
  justify-content: center;
  max-width: 100vw;
  top: 0px;
  position: fixed;
  z-index: 99;
  background-color: #15171c;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.toggleClass {
  list-style: none;
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  font-size: 20px;
  position: relative;
  padding: 1.3rem 1.3rem;
}

.navbar-brand {
  width: 200px;
  padding-left: 1rem;
}
nav a {
  color: #b3b4b6;
  text-decoration: none;
  position: relative;
  padding: 2px;
}

nav a:hover {
  color: white;
}
nav a::after {
  content: "";
  height: 2px;
  width: 0;
  background: #ffffff;
  position: absolute;
  left: 0;
  bottom: 0;
  transition: 150ms ease-in-out;
}
nav a:hover::after {
  width: 100%;
}
nav .myIcon {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  font-size: 35px;
  transition: all 150ms;
  color: #c3c3d6;
}

.person_text {
  padding: 0px 25px;
  margin-top: 20px;
  text-align: justify;
}

@media (max-width: 800px) {
  .navbar-brand {
    width: 100%;
  }

  .navbar {
    padding: 1.6rem;
  }
  .navClass {
    display: grid;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15px;
    width: 100%;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
  .toggleClass {
    position: fixed;
    right: -50%;
    top: 57px;
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
    width: 50%;
    transition: 0.6s;
    background-color: #0b3079ec;
    z-index: 999;
  }
  .menu {
    display: flex;
  }

  .toggleClass.active {
    right: 0px;
  }

  nav .myIcon {
    display: flex;
    width: 100px;
  }

  .fa-bars:hover {
    color: #fffffff5;
    cursor: pointer;
    transition: all 150ms;
  }
  .nav-link {
    font-size: 15px;
  }
}
</style>
