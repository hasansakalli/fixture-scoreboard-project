<template>
  <div class="container">
    <div class="input-group mb-3 w-100">
      <input
        type="text"
        v-model="fixtureName"
        class="form-control"
        placeholder="Please enter Fixture name"
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
        maxlength="15"
      />
    </div>
    <fixture-select :isDisabled="isDisabled" ref="child"></fixture-select>
    <div class="btn-group w-100">
      <button
        @click="saveTeams()"
        type="button"
        disabled
        class="form-control btn btn-success"
      >
        Create Fixture
      </button>
    </div>
  </div>

  <fixture-scorboard
    v-show="isButton"
    :fixtureName="fixtureName"
    :datamyId="dataId"
    :weeks="weeks"
    ref="child2"
  ></fixture-scorboard>
</template>

<script>
import FixtureSelect from "../components/FixtureSelect.vue";
import FixtureScorboard from "../components/FixtureScorboard.vue";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import "firebase/auth";
import { useRouter } from "vue-router";

import axios from "axios";
export default {
  components: {
    FixtureScorboard,
    FixtureSelect,
  },

  data() {
    return {
      isButton: false,
      router: useRouter(),
      weeks: [],
      selectedTeams: [],
      isActive: true,
      hideshow: "Hide Teams",
      userIdLogin: [],
      allMatches: [{}],
      dataId: "",
      fixtureName: "",
    };
  },
  computed: {
    isDisabled() {
      return !this.fixtureName;
    },
  },

  methods: {
    fixturId(item) {
      console.log(item);
      console.log(this.fixtureName);
    },

    saveTeams() {
      const teamNames = document.querySelectorAll(".teamName");

      for (let i = 0; i < teamNames.length; i++) {
        let teamValue = teamNames[i].value;

        this.selectedTeams.push(teamValue);

        teamNames[i].setAttribute("disabled", " ");
      }

      if (this.selectedTeams.length % 2 == 0) {
        console.log(this.selectedTeams);
      } else {
        this.selectedTeams.push("BAY");
      }

      this.setMatches();
    },
    hideShowTeams() {
      const teamNames = document.querySelector(".team");
      const selectValues = document.getElementById("selectValue");
      teamNames.classList.toggle("mystyle");
      selectValues.classList.toggle("mystyle");
      this.isActive = !this.isActive;
    },

    createSchedule(teams) {
      const schedule = [];
      for (let week = 0; week < teams.length - 1; week++) {
        const games = [];
        for (let i = 0; i < teams.length / 2; i++) {
          let home = teams[i];
          let away = teams[teams.length - 1 - i];
          if (week % 2 === 1) {
            [home, away] = [away, home];
          }
          games.push({ home: home, away: away });
        }
        schedule.push(games);
        teams.splice(1, 0, teams.pop());
      }
      return schedule;
    },

    setMatches() {
      const list1 = this.createSchedule(this.selectedTeams);
      const list2 = this.createSchedule(this.selectedTeams.reverse());
      const list = list1.concat(list2);
      this.weeks = list;

      document.querySelector(".btn-success").disabled = true;
      this.getPostDetails();
    },

    getPostDetails() {
      axios
        .put(`/posts/${this.userIdLogin}/${this.fixtureName}.json`, {
          myFixturname: this.fixtureName,
          date: JSON.stringify(new Date().toLocaleDateString()),
          match: this.weeks,
          scores: this.allMatches,
        })
        .then((response) => {
          console.log(response);

          console.log(response.data);
          this.dataId = response.data.name;
          this.router.push("/userpage");
        })
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userIdLogin = user.uid;
        this.email = user.email;
      }
    });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: clamp(0.625rem, 0.4844rem + 0.75vw, 1rem);
}

.container {
  display: grid;
  place-content: center;
  font-family: "poppins", sans-serif;
  margin: auto;
  box-sizing: border-box;
  width: 100%;
}

.team input {
  padding: 10px;
  border: 1px solid #ccc;
}

button,
select {
  width: 100%;
}
.mystyle {
  display: none;
  min-width: 100vw;
  transform: all 800ms;
}

.card {
  display: flex;
  min-width: 50vw;
}
.matches {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  align-items: flex-start;
}
.matches .card {
  margin-bottom: 10px;
  width: 100%;
}
.btn-group {
  width: 100%;
  gap: 10px;
  margin-top: 10px;
  min-width: 50vw;
}

/* Score input styles */
.score::-webkit-inner-spin-button,
.score::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Week styles */
.weekNum {
  color: white;
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: center;
}

.week {
  background: linear-gradient(
    90deg,
    rgba(95, 158, 160, 1) 16%,
    rgba(9, 9, 121, 1) 49%,
    rgba(95, 158, 160, 1) 80%
  );
  height: 30px;
  width: 100%;
  align-items: center;
  justify-content: center;
}

/* Button styles */
.lastBtn,
.nextBtn {
  background-color: transparent;
  border: none;
  color: white;
  transition: 500ms;
}

.lastBtn:hover,
.nextBtn:hover {
  color: rgb(240, 205, 10);
  transition: 500ms;
}

.nextBtn:hover {
  transform: translateX(10px);
}

.lastBtn:hover {
  transform: translateX(-10px);
}

/* Table styles */

/* Score input styles */
.score,
.score::placeholder {
  text-align: center;
}

/* List group item styles */
.list-group-item {
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 0px;
  margin: 0px;
  align-items: center;
}

/* Score input styles */
.score {
  width: 25px;
  height: 25px;
}

/* Team list styles */
.teamList {
  display: flex;
  justify-content: center;
  gap: 20px;
  text-align: left;
  padding: 0px;
  margin: 0px;
  align-items: center;
  width: 100%;
}

/* Inputs styles */
.inputs > * {
  margin: 2px;
  align-items: center;
}

/* Team 1 and 2 styles */
.team2 {
  width: 100%;
  display: flex;
  justify-content: left;
}

.team1 {
  width: 100%;
  display: flex;
  justify-content: right;
}

/* Scoreboard styles */
#scorboard {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
