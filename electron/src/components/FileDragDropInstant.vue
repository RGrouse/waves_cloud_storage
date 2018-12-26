<template>
  <v-layout align-center justify-space-around wrap>
    <v-form v-model="valid">
      <v-text-field v-model="transactionID" :rules="nameRules" label="ID" required></v-text-field>
    </v-form>
    <!-- <v-avatar>
      <img v-bind:src="avatar" alt="John">
    </v-avatar> -->
    <v-textarea
          name="input-7-1"
          label="Default style"
          v-bind:value="avatar"
          hint="Hint text"
        ></v-textarea>
    <v-btn color="success" @click="submitFiles">GET</v-btn>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      avatar: "",
      valid: false,
      transactionID:'',
      nameRules: [
        v => !!v || "ID is required",
        // v => v.length <= 10 || "Name must be less than 10 characters"
      ]
    };
  },
  methods: {
    submitFiles() {
      axios
        .get(`https://testnode1.wavesnodes.com/transactions/info/${this.transactionID}`)
        .then(response => {
          var img = response.data.data[0].value.slice(7);
          
          this.avatar = response.data.data[0].value;
        })
        .catch(function(err) {
          window.err = err;
        });
    }
  }
};
</script>