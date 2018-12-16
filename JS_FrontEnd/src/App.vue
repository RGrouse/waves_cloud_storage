<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title v-if="!auth" class="headline text-uppercase">
        <span>Crypt</span>
        <span class="font-weight-light">Ex</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <p style="margin:0; padding-right:10px">{{user}}</p>
      <!-- <v-avatar size="40">
        <img src="https://vk.com/images/deactivated_200.gif" alt="John">
      </v-avatar> -->
      <v-btn icon @click="taggle">
        <v-icon>get_app</v-icon>
      </v-btn>
      <v-btn icon href="https://vk.me/id161882512" target="_blank">
        <v-icon>help</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <!-- <setting></setting> -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Download file</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-btn style="width:400px" outline color="indigo" @click="downloadFile">Key file
                  <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="downloadFile">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
  </v-app>
</template>

<script>
// import HelloWorld from "./components/File";

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  data() {
    return {
      dialog: false,
      auth: false,
      fileName: ""
      //
    };
  },
  computed: {
    fileB64: function() {
      return this.$store.state.files[0].base64;
    },
    user: function() {
      return this.$store.state.currentUser;
    }
  },
  methods: {
    taggle: function() {
      this.dialog = !this.dialog;
    },
    downloadFile: function() {
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
    }
  }
};

function download(filename, base64) {
  var element = document.createElement("a");
  element.setAttribute("href", base64);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
</script>

<style>
html {
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 0px; /* remove scrollbar space */
  background: transparent; /* optional: just make scrollbar invisible */
}
/* optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #ff0000;
}
.section {
  margin-top: 30px;
  margin-bottom: 50px;
}
.drag,
.drop {
  box-sizing: border-box;
  display: inline-block;
  border-radius: 10px;
  width: 100px;
  height: 100px;
  background: #ccc;
  vertical-align: middle;
  margin-right: 20px;
  position: relative;
  padding: 5px;
  padding-top: 35px;
  text-align: center;
  margin: 3px;
}
.drag {
  color: #fff;
  cursor: move;
  background: #777;
  border-right: 2px solid #666;
  border-bottom: 2px solid #666;
}
.drop {
  background: #eee;
  border-top: 2px solid #ccc;
  border-left: 2px solid #ddd;
}
</style>