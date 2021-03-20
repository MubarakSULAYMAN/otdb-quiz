<template>
  <div>
    Modal

    <!-- <select name="trivia_category" class="form-control">
      <option value="any">Any Category</option>
    </select> -->
    <!-- <select name="trivia_difficulty" class="form-control">
			<option value="any">Any Difficulty</option>
		</select> -->
    <!-- <select name="trivia_type" class="form-control">&gt;
			<option value="any">Any Type</option>
		</select> -->
  </div>
</template>

<script>
export default {
  methods: {
    isAnswer() {
      return this.extractRepos().filter((repo) => {
        return `${repo.full_name}`
          .toLowerCase()
          .includes(this.filter_term.toLowerCase());
      });
    },
  },
};
</script>

<style></style>
