<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Log in</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout column>
            <v-flex>
              <v-text-field name="seed" label="Seed" v-model="seed" :rules="seedRules" required></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="indigo" dark @click="submit" :disabled="!valid" >sign in</v-btn>
              <v-btn @click="clear" outline color="indigo">clear</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data: () => ({
    valid: true,
    seed: "",
    seedRules: [
      v => !!v || "Seed is required &#x1F614;"
      // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ]
  }),

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("checkUserBySeed", this.seed);
        this.$router.push("/explorer");
      }
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>