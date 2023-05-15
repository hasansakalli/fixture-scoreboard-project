<template>
  <select
    class="form-select form-control"
    v-model="selectValue"
    @change="createInput(selectValue)"
    :disabled="isDisabled"
  >
    <option value="" selected>Choose Number of Teams!</option>
    <option v-for="num in 20" :key="num" :value="num + 2">
      {{ num + 2 }}
    </option></select
  ><br />

  <form @submit.prevent="submitForm" class="team">
    <!-- form content goes here -->
  </form>
</template>

<script>
export default {
  props: ["isDisabled"],
  data() {
    return {
      selectValue: "",
    };
  },

  methods: {
    createInput() {
      const team = document.querySelector(".team");
      team.innerHTML = "";
      let j = 0;
      for (let i = 0; i < this.selectValue; i++) {
        j++;

        const newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.value = "Team-" + j;
        newInput.placeholder = j + ". Takım";
        newInput.setAttribute("v-model", "team" + j);
        newInput.id = "teamName" + j;
        newInput.setAttribute("maxlength", "20");
        newInput.setAttribute("minlength", "2");
        newInput.setAttribute("required", true);
        newInput.className = "teamName form-control";

        team.appendChild(newInput);

        document.querySelector(".btn-success").disabled = false;
      }
    },
    resetArray() {
      this.selectValue = "";
      this.fixtureName;
    },
  },
};
</script>

<style>
form,
select {
  max-width: 100vw;
  display: grid;
  grid-column: auto;
  gap: 10px;
}
@media (max-width: 800px) {
  form,
  select {
    min-width: 80vw;
  }
}
</style>
