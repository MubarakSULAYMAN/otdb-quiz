<template>
  <div class="flex-col">
    <p class="welcome">
      Hello and welcome! <br />
      How will you like to have your quiz?
    </p>

    <div class="question-category flex-row flex-wrap">
      <p>How many questions do you want?</p>
      <input
        type="number"
        name="otdb_quiz_amount"
        min="1"
        max="50"
        v-model="amount"
        @click="updateAmount(amount)"
      />
    </div>

    <div class="question-category flex-row flex-wrap">
      <p>Which category will you like to pick from?</p>
      <select name="otdb_quiz_category" class="form-control">
        <option
          v-for="category in questionCategory"
          :key="category.value"
          :value="category.value"
          @click="updateCategory(category.value)"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="question-difficulty flex-row">
      <p>What difficulty do you prefer?</p>
      <select name="otdb_quiz_difficulty" class="form-control">
        <option
          v-for="difficulty in questionDifficulty"
          :key="difficulty.value"
          :value="difficulty.value"
          @click="updateDifficulty(difficulty.value)"
        >
          {{ difficulty.name }}
        </option>
      </select>
    </div>

    <div class="question-type flex-row">
      <p>What type of options do you prefer?</p>
      <select name="otdb_quiz_type" class="form-control">
        &gt;
        <option
          v-for="type in questionType"
          :key="type.value"
          :value="type.value"
          @click="updateOptionsType(type.value)"
        >
          {{ type.name }}
        </option>
      </select>
    </div>
    <button @click="generateQuestions">Generate Questions</button>
  </div>
</template>

<script>
import questionCategory from "@/utils/quizHelpers/CategoryHelper.js";
import questionDifficulty from "@/utils/quizHelpers/DifficultyHelper.js";
import questionType from "@/utils/quizHelpers/TypeHelper.js";

export default {
  data() {
    return {
      questionCategory,
      questionDifficulty,
      questionType,
      amount: 10,
      category: "",
      difficulty: "",
      options_type: "",
    };
  },

  methods: {
    updateAmount(val) {
      this.amount = val;
    },

    updateCategory(val) {
      // if (val.normalize() === "any".normalize()) {
      //   this.amount = "";
      // } else 

      this.category = val;
    },

    updateDifficulty(val) {
      // if (val.normalize() === "any".normalize()) {
      //   this.amount = "";
      // } else 

      this.difficulty = val;
    },

    updateOptionsType(val) {
      // if (val.normalize() === "any".normalize()) {
      //   this.amount = "";
      // } else 

      this.options_type = val;
    },

    generateQuestions() {
      this.$emit(
        "modalVals",
        this.amount,
        this.category,
        this.difficulty,
        this.options_type
      );
    },
  },
};
</script>

<style scoped>
.welcome {
  font-size: 30px;
  font-weight: 900;
  color: #000000;
}

p:not(.welcome) {
  margin-right: 10px;
}

div:not(.flex-col) {
  padding: 10px 0;
}

input,
select {
  max-width: 100%;
  padding: 0 5px;
  border: none;
  background-color: #ffffff;
  -moz-appearance: none;
  -webkit-appearance: none;
  text-indent: 0.01px;
  text-overflow: "";
}

input,
select::-ms-expand {
  display: none;
}

input:hover,
select:hover,
input:focus,
select:focus {
  border: 1px solid var(--github-purple);
  border-radius: 5px;
}

button {
  padding: 10px 0;
  color: #ffffff;
  background-color: var(--github-purple);
  border: 2px solid transparent;
  border-radius: 5px;
  outline: none;
}

button:hover button:focus {
  color: var(--github-purple);
  background-color: #ffffff;
  border-color: var(--github-purple);
}

@media only screen and (max-width: 425px) {
  .welcome {
    font-size: 20px;
  }
}
</style>
