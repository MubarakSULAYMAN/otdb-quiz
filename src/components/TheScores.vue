<template>
  <div>
    <p class="score-remark" v-if="scorePercent < 25">
      So unfortunate this time!!! <br />
      You scored too low.
    </p>
    <p class="score-remark" v-if="scorePercent >= 25 && scorePercent < 50">
      So sad!!! <br />
      You couldn't make the top 50%.
    </p>
    <p class="score-remark" v-if="scorePercent >= 50 && scorePercent < 75">
      So good of you!!! <br />
      You scored above average.
    </p>
    <p class="score-remark" v-if="scorePercent >= 75 && scorePercent < 99">
      What a wonderful performance!!! <br />
      You are in the top 25 percentile.
    </p>
    <p class="score-remark" v-if="scorePercent > 98">
      Fantastic!!! <br />
      So great of you to be in the top 1%.
    </p>
    <div class="score-container">
      <p class="score">
        You answered: {{ answered }} / {{ totalQuestions }} <br />
        Scored: {{ score }} / {{ totalQuestions }} <br />
        (Score in percentage: {{ scorePercent }}%)
      </p>
    </div>

    <div class="score-container">
      <div class="progress">
        <div
          class="progress-value"
          :style="{ width: scorePercent + '%' }"
        ></div>
      </div>
    </div>
    <button
      class="play-again"
      @click="startAfresh"
      @keydown.enter="startAfresh"
    >
      Play Again
    </button>
  </div>
</template>

<script>
export default {
  props: {
    answered: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    scorePercent: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    startAfresh() {
      this.$emit("replay");
    },
  },
};
</script>

<style scoped>
.score-remark {
  font-size: 40px;
  font-weight: 700;
}

.score-container {
  display: flex;
  justify-content: center;
}

.progress {
  background: black;
  justify-content: flex-start;
  border-radius: 100px;
  align-items: center;
  position: relative;
  padding: 0 5px;
  display: flex;
  height: 40px;
  width: 500px;
}

.progress-value {
  /* animation: load 3s normal forwards; */
  box-shadow: 0 10px 40px -10px var(--github-yellow);
  border-radius: 100px;
  background: var(--github-yellow);
  height: 30px;
  width: 0;
}

button {
  padding: 7px 15px;
  border-radius: 15px;
  color: var(--github-white);
  background-color: var(--github-pink);
  font-weight: 500;
  border: none;
}

button:hover,
button:focus {
  background-color: var(--github-orange);
}

/* @keyframes load {
  0% {
    width: 0;
  }
  100% {
    width: 68%;
  }
} */

.play-again {
  margin-top: 20px;
}

@media only screen and (max-width: 768px) {
  .score-remark {
    font-size: 30px;
  }
}

@media only screen and (max-width: 425px) {
  .score-remark {
    font-size: 20px;
  }
}
</style>
