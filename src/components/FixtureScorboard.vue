<template>
  <div class="scorb">
  <button
     id="scorboard"
     @click="scores()"
     type="button"

     class="form-control btn btn-primary"
   >
   {{ scorboard }}
   </button>




 <div v-if="isActive" class="table-responsive">
   <table class="table table-hover">
     <thead class="thead-dark">
       <tr>
         <th scope="col"></th>
         <th scope="col">Teams</th>
         <th scope="col">P</th>
         <th scope="col">W</th>
         <th scope="col">D</th>
         <th scope="col">L</th>
         <th scope="col">GF</th>
         <th scope="col">GA</th>
         <th scope="col">GD</th>
         <th scope="col">PTS</th>
       </tr>
     </thead>
     <tbody>
       <tr id="tableScor" v-for="(result, index) in allMatches" :key="result">
         <th scope="row">{{ index + 1 }}</th>
         <td style="min-width: 50px;" >{{ result.name }}</td>
         <td>{{ result.p }}</td>
         <td>{{ result.w }}</td>
         <td>{{ result.d }}</td>
         <td>{{ result.l }}</td>
         <td>{{ result.gf }}</td>
         <td>{{ result.ga }}</td>
         <td>{{ result.gd }}</td>
         <td>{{ result.points }}</td>
       </tr>
     </tbody>
   </table>
 </div>
</div>


</template>



<script>
import axios from 'axios';
import { getAuth,onAuthStateChanged} from "@firebase/auth";
import 'firebase/auth';

export default {
props:["datamyId", "weeks",  "fixtureName", "changeTabelle"],
data() {
 return {
   isActive: false, 
   competitions: [],    
   allMatches:[],
   scorboard: "Save und Show Scorboard",
   userIdLogin:"",
   userEmail:"",
   newWeeks:[]
  
 
 
 };
},
created(){
  this.changeTabelle!= this.changeTabelle
this.auth=getAuth();
onAuthStateChanged(this.auth,(user)=>{
if(user){
 this.userIdLogin=user.uid;
 this.email=user.email
}
 


});

},
mounted(){

  setInterval(this.bayFunction, 100)
  
},


methods:{
  bayFunction() {
    const score1 = document.querySelectorAll(".score1");
    const score2 = document.querySelectorAll(".score2");
    for (let i = 0; i < score1.length; ++i) {
      if (score1[i].name == "BAY" || score2[i].name == "BAY" ) {
          score1[i].readonly = true;
          score2[i].readonly = true;
          score1[i].value="";
          score2[i].value="";
        
          score1[i].disabled = true;
          score2[i].disabled = true;
        
 
        
      }
      if ((!score2[i].value == "") & (!score1[i].value == "")) {
        document.getElementById("scorboard").disabled = false;
      }
      if ((score2[i].value < 0) || (score1[i].value <0)) {
        score1[i].value = "";
        score2[i].value= "";
      }
    }
    
  },


scores() {
let scoreTable = {};
this.competitions=[]
this.isActive = true;

const score1 = document.querySelectorAll(".score1");
const score2 = document.querySelectorAll(".score2");

for (let i = 0; i < score1.length; ++i) {
  if ((!score1[i].value == "") & (!score2[i].value == "")) {
    this.competitions.push({
      teamA: score1[i].name,
      teamB: score2[i].name,
      scoreA: score1[i].value,
      scoreB: score2[i].value,
    });


  }


}

this.competitions.forEach((result) => {
  const teamA = result.teamA;
  const teamB = result.teamB;
  const scoreA = parseInt(result.scoreA);
  const scoreB = parseInt(result.scoreB);

  if (!scoreTable[teamA]) {
    scoreTable[teamA] = {
      name: teamA,
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    };
  }
  if (!scoreTable[teamB]) {
    scoreTable[teamB] = {
      name: teamB,
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
    };
  }
 
  if (scoreA > scoreB) {
    scoreTable[teamA].points += 3;
    scoreTable[teamA].w += 1;

    scoreTable[teamB].d += 1;
  } else if (scoreA < scoreB) {
    scoreTable[teamB].points += 3;
    scoreTable[teamB].w += 1;

    scoreTable[teamA].d += 1;
  } else if (scoreA == scoreB) {
    scoreTable[teamA].points += 1;
    scoreTable[teamB].points += 1;
    scoreTable[teamA].l += 1;
    scoreTable[teamB].l += 1;
  }

  scoreTable[teamA].gf += scoreA;
  scoreTable[teamA].ga += scoreB;
  scoreTable[teamB].gf += scoreB;
  scoreTable[teamB].ga += scoreA;
  scoreTable[teamA].gd += scoreA - scoreB;
  scoreTable[teamB].gd += scoreB - scoreA;

  scoreTable[teamA].p = scoreTable[teamA].w + scoreTable[teamA].d + scoreTable[teamA].l;
  scoreTable[teamB].p = scoreTable[teamB].w + scoreTable[teamB].d + scoreTable[teamB].l;
  

  const propertyValues = Object.values(scoreTable);

  (this.allMatches = propertyValues)
});

console.log(this.allMatches);
this.scorboard=" Save the Scoreboard"
this.newWeeks=this.weeks


this.sortBy()
this.getundPost()
},
sortBy() {
 this.allMatches.sort((a, b) => (a.points > b.points ? -1 : 1));
 this.allMatches.sort((a, b) =>  (a.points == b.points & a.gd > b.gd ? -1 : 1));
 this.allMatches.sort((a, b) =>  (a.points == b.points & a.gd == b.gd  & a.gf > b.gf ? -1 : 1));

},


getundPost(){
  console.log(this.allMatches);
console.log(this.newWeeks);
axios.patch(`/posts/${this.userIdLogin}/${this.fixtureName}.json`, {myFixturname: this.fixtureName, match: this.newWeeks, scores: this.allMatches})
.then(response => {
console.log(response);

})
.catch(error => console.log(error))


},


resetScorboard() {
this.isActive= false, 
this.competitions=[]
this.allMatches=[],
this.scorboard= "Save und Show Scorboard"
},

tabelleScores(){
  this.allMatches=[]
  this.isActive= false
  this.scorboard= "Save und Show Scorboard"
}




},






}
</script>


<style scoped>
#tableScor{

align-items: baseline;
}

table {
  min-width:50vw;
  padding: 0;
  align-items: center;
 

}
td {
  word-wrap: break-word;
  white-space: normal;

 

  

}
.scorb{
  font-size: clamp(0.625rem, 0.4844rem + 0.75vw, 1rem);
 min-width: 50vw;

}

.table-responsive {
  border: 1px solid rgb(129, 36, 36);
  border-radius: 5px;

 
  min-width: 100%;
}

thead {
  background-color: rgba(185, 243, 171);

  text-align: center;
}

th, td {

text-align: center;
}


@media (max-width: 800px) {
  
.scorb{
  min-width: 80%;
}
.table-responsive {
 
  max-width:100%;
}


}
</style>