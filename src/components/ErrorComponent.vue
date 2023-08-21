<script lang="ts">
import type { PropType } from 'vue'

export default {
  props: {
    type: String as PropType<string>,
    message: String as PropType<string>
  },
  computed: {
    getAlertColor(): string {
      const alertColors: Record<string, string> = {
        Danger: '#f44336',
        Success: '#04AA6D',
        Alert: '#ff9800'
      }
      return alertColors[`${this.type}`] || 'red'
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
