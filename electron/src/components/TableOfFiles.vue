<template>
  <!-- <v-layout row>
    <v-flex xs12 sm6 offset-sm3> -->
      <v-card style="height:100%">
        <v-list two-line subheader>
          <v-subheader inset>New file</v-subheader>

          <v-list-tile v-for="item in items" :key="item.title" avatar >
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-subheader inset>Added files</v-subheader>

          <v-list-tile v-for="item in items2" :key="item.title" avatar>
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple v-bind:href="'https://wavesexplorer.com/tx/'+item.title" target="_blank">
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    <!-- </v-flex>
  </v-layout> -->
</template>

<script>
  export default {
    data () {
      return {
        // items: [
        //   { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' },
        //   { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Recipes', subtitle: 'Jan 17, 2014' },
        //   { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' }
        // ],
        items2: [
          { icon: 'check', iconClass: 'green white--text', title: '84UNjCEz1245vUnp5JRHuzHcyQv8nhiLDkbeM4wdAx6E', subtitle: 'Dec 15, 2018' },
          ]
      }
    },
    computed: {
        items: function(){
            return this.$store.state.files;
        }
    }
  }
</script>