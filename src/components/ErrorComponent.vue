<script lang="ts">
import type { PropType } from 'vue'

export default {
  props: {
    type: String as PropType<string>,
    message: String as PropType<string>
  },
  computed: {
    getAlertColor(): string {
      if (this.type === 'Danger') return '#f44336'
      if (this.type === 'Success') return '#04AA6D'
      if (this.type === 'Alert') return '#ff9800'
      return 'red'
    }
  }
}
</script>
<template>
  <div :style="{ backgroundColor: getAlertColor }" class="alert">
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    <strong>{{ type }}!</strong> {{ message }}
  </div>
</template>
<style scoped lang="scss">
.alert {
  padding: 20px;
  color: white;
}

.closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.closebtn:hover {
  color: black;
}
</style>
