<template>
  <div>
    <drop class="drop" @drop="handleDrop">drop files</drop>
  </div>
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
      const filenames = [];
    //   window.ans = files;
      for (let i = 0; i < files.length; i++) {
        filenames.push(files.item(i).name);
      }
      reader.onload = (e) => {
        window.ans = e.target.result;
      };
      reader.readAsDataURL(files[0]);
      alert(`You dropped files: ${JSON.stringify(filenames)}`);
    }
  }
};
</script>