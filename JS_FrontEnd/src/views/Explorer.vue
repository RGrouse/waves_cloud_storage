<template>
  <v-container fluid style="padding:0" fill-height>
    <v-layout row>
      <v-flex xs8 order-lg2>
        <add-file></add-file>
      </v-flex>
      <v-flex xs4 order-lg2>
        <table-app></table-app>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import TableApp from "../components/TableOfFiles";
import AddFile from "../components/AddFile";

export default {
  components: {
    TableApp,
    AddFile
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
