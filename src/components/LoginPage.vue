<template>
    
    <div class="container-fluid">
                <h3 class="text-center text-success">Login</h3>
                    <form @submit.prevent="onSubmit">
                    
                  
                    
                        <input v-model="email" type="email" class="form-control"
                               placeholder="Enter your E-Mail Address">
                   
                    <div class="form-group ">
                    
                        <input v-model="password" type="password" class="form-control" placeholder="Enter Your Password">
                    </div>
                    <p id="alarm" v-if="errMsg">{{ errMsg }}</p>
                    <div class="button-container d-grid">
                        <button type="submit" class="btn btn-success" @click="login">Login</button>

                    </div>
                </form>
            </div>


</template>

<script>

import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import { useRouter } from "vue-router"

export default {
 
  data() {
    
   return {
       email: "",
       password:"",
       errMsg:"",
       router: useRouter(),
       
   }
},
  
  
  
  methods: {

    login(){
    signInWithEmailAndPassword(getAuth(), this.email, this.password)
.then((data) =>{
    console.log("Successfully signed in");
    console.log(data.user.uid);
  
   this.router.push('/')
})
.catch((error)=> {
    console.log(error.code);
    switch (error.code){
        case "auth/invalid-email":
        this.errMsg="Invalid Email";
        break;
        case "auth/user-not-found":
        this.errMsg="No account with that email was found";
        break;
        case "auth/wrong-password":
        this.errMsg="Incorrect Password";
        break;

    }
  
})
}
      }
    }


</script>

<style scoped>
.container-fluid {
    max-width: 50%;

    border: 1px solid #ccc;
    padding: 2rem;
    border-radius: 10px;

}



@media (max-width: 800px) {
    .container-fluid {
        min-width: 80vw;

    }

    input {
        max-width: 70vw;

    }

    button {
        max-width: 70vw;
        text-align: center;
    }

}
</style>