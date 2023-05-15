<template>

  <div class="container text-center">
   
   

<fixture-matches></fixture-matches>


</div>
</template>

<script>

import FixtureMatches from '../components/FixtureMatches.vue'






export default {
 
  components: {
  
  FixtureMatches,

     },


  


};
</script>




<style >
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: clamp(0.625rem, 0.4844rem + 0.75vw, 1rem);
}
nav{
  width:100vw
}


.container {
  display: grid;
  place-content: center;
  font-family: "poppins", sans-serif;
  margin: auto;

  box-sizing: border-box;
 
  min-width: 50vw;
 
}


.team input {
  padding: 10px;
  border: 1px solid #ccc;
  
}



/* Form element styles */
button, select {
  width: 100%;

}







</style>
