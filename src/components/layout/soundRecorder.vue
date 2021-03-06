<template>
  <div class="recorder">
    <icon
      v-if="!isRecording"
      title="record voice"
      class="recordBtn start"
      ic="./sym/ic_mic_white.svg"
      @click.native="startRecording()"
      ref="startRecord"
    />
    <div v-else class="voiceMeterContainer">
      <div class="voiceMeter" ref="voiceMeter"></div>
      <icon
        title="record voice"
        class="recordBtn stop"
        ic="./sym/ic_mic_white.svg"
        @click.native="stopRecording()"
        ref="stopRecord"
      />
    </div>
  </div>
</template>

<script>
import icon from '@/components/layout/icon';
const audioContext =  new (window.AudioContext || window.webkitAudioContext)();

export default {
  name: 'soundRecorder',
  components: {
    icon
  },
  props: {
    onStart: {
      type: Function,
      default: ()=>{}
    },
    onStop: {
      type: Function,
      default: ()=>{}
    }
  },
  methods: {
    startRecording(){
      this.onStart();
      navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
        this.isRecording = true;
        this.createAudioMeter(stream).onData(this.setVoiceMeter);
        this.recorder = new MediaRecorder(stream);
        this.recorder.start();
        this.recorder.ondataavailable = ev => this.data.push(ev.data);
        this.recorder.onstop = () => {
          let blob = new Blob(this.data, {'type': 'audio/mp3'});
          this.data = [];
          blob.name = `Recording-${new Date().toISOString()}.${blob.type.split('/')[1]}`;
          this.onStop({blob});
          this.isRecording = false;
        };
      }).catch(err => console.log('unable to get stream', err));
    },
    stopRecording(){
      this.recorder.stop();
    },
    setVoiceMeter(value){
      if (!this.$refs.stopRecord) return;
      this.$refs.voiceMeter.style.height = `calc(3rem + ${value/4}px)`;
      this.$refs.voiceMeter.style.width = `calc(3rem + ${value/4}px)`;
    },
    createAudioMeter(stream){
      let onDataCallbacks = [];
      let processor = audioContext.createScriptProcessor(512, 1 , 1);
      processor.onaudioprocess = event => {
        let sum = 0;
        event.inputBuffer.getChannelData(0).forEach(val => sum += val * val);
        onDataCallbacks.map(callback => callback(Math.sqrt(sum)*100));
      };
      processor.connect(audioContext.destination);
      processor.shutdown = () => {
        processor.disconnect();
        processor.onaudioprocess = null;
      }
      audioContext.createMediaStreamSource(stream).connect(processor);
      return {onData: callback => onDataCallbacks.push(callback)};
    }
  },
  data(){
    return{
      recorder: null,
      data: [],
      isRecording: false
    }
  }
}
</script>

<style scoped lang="scss">
.recordBtn{
  position: absolute;
  right: 1rem;
  bottom: 0.25rem;
  background-color: #1d1d1d;
  border-radius: 50%;
}
.recordBtn.stop{
  right: 0;
  bottom: 0;
  background-color: #c63e3e;
  box-shadow: none;
}
.voiceMeter{
  position: absolute;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 50%;
  box-shadow: 3px 3px 10px #111;
}
.voiceMeterContainer{
  position: absolute;
  height: 3rem;
  width: 3rem;
  bottom: 0.25rem;
  right: 1rem;
}
.recorder{
  height: 100%;
  width: 8rem;
  overflow: hidden;
}
</style>