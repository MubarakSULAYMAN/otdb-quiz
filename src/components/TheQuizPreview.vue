<template>
  <div>
    <p class="info">Here is a preview of your responses.</p>
    <div class="flex-col">
      <div class="quiz" v-for="n in questionCount" :key="n">
        <p class="question">{{ n }}. <span v-html="questions[n]"></span></p>
        <div class="flex-row flex-wrap">
          <p
            class="selected-answer"
            v-html="selectedAnswers[n] || '(Nothing was Selected)'"
          ></p>
          <p class="correct-answer" v-html="correctAnswers[n]"></p>
        </div>
      </div>
    </div>
    <button @click="showResults" @keydown.enter="showResults">
      View Results
    </button>
  </div>
</template>

<script>
export default {
  props: {
    correctAnswers: {
      type: [Array, Object],
      required: true,
    },

    questions: {
      type: [Array, Object],
      required: true,
    },

    questionCount: {
      type: Number,
      default: 0,
    },

    selectedAnswers: {
      type: [Array, Object],
      required: true,
    },
  },

  methods: {
    showResults() {
      this.$emit("newUpdate");
    },
  },
};
</script>

<style scoped>
* {
  font-size: 16px;
  text-align: left;
}

.info {
  color: #000000;
  font-size: 20px;
  font-weight: 900;
}

.flex-col {
  padding: 5px;
  border: 2px solid var(--github-blue);
  border-radius: 5px;
}

.question {
  /* position: relative; */
  color: blue;
  margin-bottom: 5px;
}

::after {
  /* position: absolute;
  top: 0;
  right: 0; */
  margin-left: 10px;
  font-size: 8px;
  font-weight: 700;
}

.question::after {
  content: "(QUESTION)";
}

.flex-row p {
  min-width: 50%;
}

.flex-row p:first-child {
  min-width: 48%;
  margin-right: 10px;
  border-right: 1px solid var(--github-black);
}

.quiz:not(:last-child) {
  margin-bottom: 10px;
  border-bottom: 1px solid var(--github-black);
}

.selected-answer {
  color: red;
}

.selected-answer::after {
  content: "(SELECTED ANSWER)";
}

.correct-answer {
  color: green;
}

.correct-answer::after {
  content: "(CORRECT ANSWER)";
}

button {
  margin-top: 20px;
  padding: 7px 15px;
  border-radius: 5px;
  color: var(--github-white);
  background-color: var(--github-blue);
  font-weight: 500;
  border: 2px solid transparent;
}

button:hover,
button:focus {
  color: var(--github-blue);
  background-color: var(--github-white);
  border-color: var(--github-blue);
}

@media only screen and (max-width: 425px) {
  .flex-row p:first-child {
    min-width: 50%;
    margin-right: 0;
    border-right: 1px solid transparent;
  }
}
</style>
