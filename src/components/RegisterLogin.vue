<template>

    <div class="container-fluid">
      <h3 class="text-center  text-primary">Register</h3>
                <form @submit.prevent="onSubmit">
                 
                        
                    
                        <input v-model="email" type="email" class="form-control"
                               placeholder="Enter your E-Mail Address">
               
                    <div class="form-group d-grid">
                      
                        <input v-model="password" type="password" class="form-control" placeholder="Enter Your Password">
                    </div>
                    <p id="alarm" v-if="errMsg">{{ errMsg }}</p>
                    <div class="button-container d-grid">
                        <button type="submit" class="btn btn-primary" @click="register">Register</button>

                    </div>
                </form>
            </div>
  
</template>

<script>

// import axios from "axios"
import "firebase/firestore";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { useRouter } from "vue-router";

export default{
    data(){
        return{
   email: "",
  password:"",
  errMsg:"",
  router:useRouter()
        }
    },
    

methods:{
    
    register(){
        
createUserWithEmailAndPassword(getAuth(), this.email, this.password)
.then((data) =>{
console.log("Successfully registered");
alert("Successfully registered")
console.log(data);

this.router.push('/')
})
.catch((error)=> {
console.log(error.code);
this.errMsg=error.message
})
}}
}





</script>

<style scoped>

.container-fluid{
   max-width: 50%;
   
    border:1px solid #ccc;
    padding: 2rem;
    border-radius: 10px;
    
}



@media (max-width: 800px) {
.container-fluid{
   min-width: 80vw;
 
}
input{
    max-width: 70vw; 
   
}
button{
   max-width: 70vw; 
   text-align: center;
}

}
</style>