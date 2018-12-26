<template>
  <v-card style="height:100%">
    <v-layout align-center justify-center column fill-height>
      <drop
        class="drop"
        @drop="handleDrop"
        style="border-radius:0;border-style:dashed;box-shadow: none;border-color:indigo;background-color:#fff;color:indigo"
      >Drop file here
        <v-icon>add</v-icon>
      </drop>
      <v-card-text>
        <p class="text-xs-center">Select file to upload</p>
      </v-card-text>
      <div class="text-xs-center">
        <v-btn style="width:400px" outline color="indigo" @click="downloadFile">Upload file
          <v-icon right dark>cloud_upload</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn style="width:400px" block color="indigo" dark @click="pushFile">Push data</v-btn>
      </div>
    </v-layout>
  </v-card>
</template>

<script>
import { Drag, Drop } from "vue-drag-drop";
export default {
  components: { Drag, Drop },
  methods: {
    handleDrop(data, event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      var reader = new FileReader();

      reader.onload = e => {
        var obj = {
          file:files,
          base64:e.target.result
        };
        window.ansF = e.target.result;
        this.$store.commit("putFiles",obj);
      };
      reader.readAsDataURL(files[0]);
    },
    downloadFile() {
      var element = document.createElement("input"),
      vm = this.$store;
      element.setAttribute("type", "file");
      element.setAttribute("id", "fileUp");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();
      var control = document.getElementById("fileUp");
      control.addEventListener(
        "change",
        function(event) {
          // Когда происходит изменение элементов управления, значит появились новые файлы
          var i = 0,
            files = control.files,
            len = files.length,
            reader = new FileReader();
          
          reader.onload = e => {
            var obj = {
              file:files, 
              base64:e.target.result
            };
            vm.commit("putFiles", obj);
          };
          reader.readAsDataURL(files[0]);
          document.body.removeChild(element);
        },
        false
      );
    },
    pushFile() {
      this.$store.dispatch('pushData');
    }
  }
};
</script>