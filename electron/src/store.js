import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    seed: '',
    files: [],
    currentUser:''
  },
  mutations: {
    putSeed,
    putFiles
  },
  actions: {
    checkUserBySeed,
    pushData
  }
})

function putSeed(state, seed) {
  state.seed = seed;
}
function putFiles(state, obj) {
  var file = obj.file,
    base64 = obj.base64;
  var fileUp = {
    icon: 'folder',
    iconClass: 'grey lighten-1 white--text',
    title: file[0].name,
    subtitle: file[0].lastModifiedDate.toDateString(),
    base64: base64
  }
  state.files.push(fileUp);
  window.fileB64 = state.files;
}

function checkUserBySeed({ commit, state }, seed) {
  var
    url = 'http://192.168.43.145:5000/setSeed',
    myHeaders = new Headers({
      "Content-Type": "application/json"
    }),
    myInit = {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({ "seed": seed })
    },
    myRequest = new Request(url, myInit);
    
  fetch(myRequest).then(function (response) {
    return response.json()
  })
  .then(function(response){
    state.currentUser = response.address;
    window.ans = response;
  })

}
function pushData({ commit, state }) {
  var
    url = 'http://192.168.43.145:5000/pushFile',
    myHeaders = new Headers({
      "Content-Type": "application/json"
    }),
    myInit = {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(state.files)
    },
    myRequest = new Request(url, myInit),
    st = state;
    
  fetch(myRequest).then(function (response) {
    return response.json()
  })
  .then(function(response){
    if (response.success){
      st.files = [];
    }
  })
  // axios.post(url, params, headers)
  //   .then(function (response) {
  //     if (response.accepted) {
  //       commit('putSeed',seed);
  //       next();
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
}



//{ icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' }