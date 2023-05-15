<template>
  <table class="table table-striped">
    <thead>
      <tr class="table-primary text-center">
        <th scope="col">Fixture Num</th>
        <th scope="col">Fixture Name</th>
        <th scope="col">Creation Date</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="table-row"
        v-for="(item, index) in allFixtures"
        :key="index"
        :class="{ 'table-active': index === activeIndex }"
        @click="changeActiveIndex(index, item.myFixturname)"
      >
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ item.myFixturname }}</td>
        <td>{{ item.date }}</td>
        <td @click="openPopup()"><i class="fas fa-trash-alt"></i></td>
        <div id="app">
          <div v-if="showPopup" class="modal-overlay">
            <div v-if="showPopup" class="popup">
              <h2>Are you sure you want to delete?</h2>
              <div class="btnPopup d-flex gap-1">
                <button id="btnNo" @click="closePopup">No</button>
                <button @click="deleteFun(activeIndex, item.myFixturname)">
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </tr>
    </tbody>
  </table>

  <div
    class="matches"
    v-for="(weeks, index) in this.newName[fixtureIndex]"
    :key="index"
  >
    <div
      class="card"
      v-for="(week, index) in weeks.match"
      :key="index"
      :style="{ display: index === weeksIndex ? 'flex' : 'none' }"
    >
      <ul class="list-group list-group-flush">
        <div class="week d-flex">
          <button class="lastBtn" @click="last()">Last Week</button>
          <p class="weekNum">{{ index + 1 }}. Week</p>
          <button class="nextBtn" @click="next()">Next Week</button>
        </div>
        <li class="list-group-item" v-for="team in week" :key="team">
          <div class="teamList">
            <span class="team1">{{ team.home }}</span>
            <div class="inputs d-flex">
              <input
                class="score score1"
                v-model="team.scoreA"
                :name="team.home"
                min="0"
                max="100"
                type="number"
                @input="bayFunction()"
              />

              <input
                class="score score2"
                v-model="team.scoreB"
                :name="team.away"
                min="0"
                max="100"
                type="number"
                @input="bayFunction()"
              />
            </div>
            <span class="team2">{{ team.away }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <fixture-scorboard
    :fixtureName="fixtureName"
    :datamyId="dataId"
    :weeks="weeks"
    ref="child3"
  ></fixture-scorboard>
</template>

<script>
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import "firebase/auth";
import FixtureScorboard from "../components/FixtureScorboard.vue";
import axios from "axios";

export default {
  components: {
    FixtureScorboard,
  },

  data() {
    return {
      showPopup: false,
      tableFixture: [],
      activeIndex: null,
      inputDisabled: false,
      weeks: [],
      selectedTeams: [],
      weeksIndex: 0,
      isActive: true,
      hideshow: "Hide Teams",
      userLogin: [],
      userIdLogin: [],
      userDataId: "",
      eslesmeler: [],
      userEmail: "",
      macclar: [],
      matchesResults: [],
      results: {},
      allMatches: [],
      allMatchesUpdate: [],
      dataId: "",
      fixtureName: "",
      newName: [],
      polk: [],
      newMatches: {},
      competitions: [],
      fixtureIndex: 0,
      scorboard: "Create League Table",
      aScor: "",
      bScor: "",
      actuellDb: [],
      allFixtures: [],
      indexFixture: 0,
      inputValue: [],
      nameFixture: "",

      changeTabelle: false,
      isHidden: true,
    };
  },

  mounted() {
    this.getpostDetails();
    setInterval(this.bayFunction, 100);
    console.log(this.allFixtures);
  },

  methods: {
    openPopup() {
      this.showPopup = true;
    },

    deleteFun(index, fixName) {
      console.log(index);
      axios
        .delete(`/posts/${this.userIdLogin}/${fixName}.json`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });

      this.allFixtures.splice(index, 1);
      if (this.allFixtures.length === 0) {
        this.newName = [];
      }
      this.showPopup = false;
    },

    closePopup() {
      this.showPopup = false;
    },

    changeActiveIndex(index, imyFixturname) {
      this.$refs.child3.tabelleScores();
      this.activeIndex = index;
      this.fixtureName = imyFixturname;
      this.fixtureIndex = index;
      this.weeks = this.newName[this.fixtureIndex][1].match;
      this.allMatches = this.newMatches[1].scores;
      console.log(this.weeks);
      console.log(index);
      this.weeksIndex = 0;
    },

    getpostDetails() {
      axios
        .get(
          `https://fixture-register-default-rtdb.europe-west1.firebasedatabase.app/posts/${this.userIdLogin}.json`
        )
        .then((response) => {
          console.log(response.data);
          this.formatPostDetails(response.data);
        });
    },

    formatPostDetails(posts) {
      for (let key in posts) {
        this.polk.push({ ...posts[key], id: key });
      }
      console.log(this.polk);
      for (let i = 0; i < this.polk.length; i++) {
        if (this.userIdLogin == this.polk[i].id) this.actuellDb = this.polk[i];
      }

      const matches = Object.values(this.actuellDb);
      this.newName = Object.entries(matches);

      for (let i = 0; i < this.newName.length - 1; i++) {
        this.allFixtures.push(this.newName[i][1]);
      }

      this.newMatches = this.newName[this.fixtureIndex];

      this.weeks = this.newName[this.fixtureIndex][1].match;

      this.fixtureName = this.newMatches[1].myFixturname;
      console.log(this.allFixtures.length);
    },

    bayFunction() {
      const score1 = document.querySelectorAll(".score1");
      const score2 = document.querySelectorAll(".score2");
      for (let i = 0; i < score1.length; ++i) {
        if (score1[i].name == "BAY" || score2[i].name == "BAY") {
          score1[i].readonly = true;
          score2[i].readonly = true;
          score1[i].value = "";
          score2[i].value = "";

          score1[i].disabled = true;
          score2[i].disabled = true;

          // score1[i].disabled = true;
          // score2[i].disabled = true;
        }
        if ((!score2[i].value == "") & (!score1[i].value == "")) {
          document.getElementById("scorboard").disabled = false;
        }
        if (score2[i].value < 0 || score1[i].value < 0) {
          score1[i].value = "";
          score2[i].value = "";
        }
        if (score2[i].value > 99 || score1[i].value > 99) {
          score1[i].value = "";
          score2[i].value = "";
        }
      }
    },

    next() {
      this.weeksIndex++;
      if (this.weeksIndex >= this.newName[this.fixtureIndex][1].match.length) {
        this.weeksIndex = 0;
      }
    },
    last() {
      this.weeksIndex--;
      if (this.weeksIndex < 0) {
        this.weeksIndex = this.newName[this.fixtureIndex][1].match.length - 1;
      }
    },
  },

  created() {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userIdLogin = user.uid;
        this.email = user.email;
      }

      console.log(this.userIdLogin);
    });
  },
};
</script>

<style>
body {
  font-size: clamp(0.625rem, 0.2344rem + 1.25vw, 0.9375rem);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(82, 71, 71, 0.247);
  z-index: 99;
}
.popup {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 200px;
  width: 350px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
  z-index: 998;
  text-align: center;
}

.popup h2 {
  font-size: 24px;
  margin-top: 30px;
}

.popup p {
  font-size: 18px;
  margin-top: 20px;
}

.popup button {
  padding: 10px;
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 20px;
}
#btnNo {
  background-color: green;
}

.table-striped {
  max-width: 50vw;
}
.table-none {
  display: none;
}
.table-row * {
  cursor: pointer;
}
.table-row:hover {
  background-color: rgb(185, 243, 171);
  transition: all 100ms;
}
.fa-trash-alt {
  cursor: pointer;
  transition: all 100ms;
}
.fa-trash-alt:hover {
  color: red;
  transition: all 100ms;
}
.table-active {
  background-color: rgb(185, 243, 171);
  transition: all 100ms;
}

#hideShowTeams {
  display: none;
}

.matches {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
  align-items: flex-start;
  max-width: 50vw;
}
.matches .card {
  display: flex;
  margin-bottom: 10px;
  max-width: 50vw;
}
.btn-group {
  width: 100%;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
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
  height: 35px;
  justify-content: left;
  align-items: center;
}

.team1 {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: right;
  align-items: center;
}

/* Scoreboard styles */
#scorboard {
  margin-bottom: 20px;
  margin-top: 20px;
}

@media (max-width: 800px) {
  .table-striped {
    max-width: 80%;
  }
  .matches,
  .card {
    min-width: 90%;
  }
}
</style>
