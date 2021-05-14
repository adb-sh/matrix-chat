<template>
  <div class="fileUpload">
    <icon
      title="upload media"
      class="leftBtn attachFile"
      ic="./sym/ic_attach_file_white.svg"
      @click.native="$refs.fileInput.click()"
    />
    <input
      type="file" id="fileInput" ref="fileInput"
      @change="setFile({file: $refs.fileInput.files[0]})"
    >
  </div>
</template>

<script>
import icon from '@/components/icon';
import {readFileBlob} from '@/lib/readFileBlob';

export default {
  name: 'soundRecorder',
  components: {
    icon
  },
  props:{
    onChange: Function
  },
  methods: {
    setFile({file}){
      readFileBlob(file).then(blob => {
        blob.name = file.name;
        this.onChange({blob})
      });
    }
  }
}
</script>

<style scoped>
.fileUpload{
  display: inline-block;
  position: relative;
}
.leftBtn{
  background-color: unset;
  height: 2.5rem;
  width: 2.5rem;
  box-shadow: none;
}
#fileInput{
  display: none;
}
</style>