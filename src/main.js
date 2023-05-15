import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import FixtureMatches from "./components/FixtureMatches.vue";
import UserPage from "./components/UserPage.vue";
import RegisterLogin from "./components/RegisterLogin.vue";
import LoginPage from "./components/LoginPage.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { initializeApp } from "firebase/app";
import axios from 'axios';

axios.defaults.baseURL = "https://fixture-register-default-rtdb.europe-west1.firebasedatabase.app";

const firebaseConfig = {
  apiKey: ,
  authDomain: ,
  databaseURL: ,
  projectId: ,
  storageBucket: ,
  messagingSenderId: ,
  appId: 
};

initializeApp(firebaseConfig)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: FixtureMatches, meta: { requiresAuth: true } },
    { path: "/register", component: RegisterLogin },
    { path: "/login", component: LoginPage },
    { path: "/userpage", component: UserPage, meta: { requiresAuth: true } },
  ],
});

router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

createApp(App).use(router).mount("#app");
