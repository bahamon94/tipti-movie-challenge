<script lang="ts">
import type { PropType } from 'vue'
import type { TabData } from '@/types/TabData.types'

export default {
  emits: ['changeTab'],
  props: {
    dataToTabs: Array as PropType<TabData[]>
  },
  mounted() {
    if (this.dataToTabs?.length) {
      const tabContentElementInit = document.getElementById(this.dataToTabs[0].name)
      if (tabContentElementInit) {
        tabContentElementInit.style.display = 'block'
        this.$emit('changeTab', this.dataToTabs[0].name)
        const tablinks = document.getElementsByClassName('tablinks')
        tablinks[0].className = tablinks[0].className + ' active'
      }
    }
  },
  methods: {
    openTab(evt: any, tabName: any) {
      let i, tabcontent: any, tablinks

      tabcontent = document.getElementsByClassName('tabcontent')
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none'
      }

      tablinks = document.getElementsByClassName('tablinks')
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '')
      }

      const tabContentElement = document.getElementById(tabName)
      if (tabContentElement) {
        tabContentElement.style.display = 'block'
        evt.currentTarget.className += ' active'
      }
      this.$emit('changeTab', tabName)
    }
  }
}
</script>
<template>
  <div class="tab">
    <button
      v-for="(tabItem, index) of dataToTabs"
      :key="index"
      class="tablinks"
      @click="openTab($event, tabItem.name)"
    >
      {{ tabItem.name }}
    </button>
  </div>

  <div
    v-for="(tabItemContent, index) of dataToTabs"
    :key="index"
    :id="tabItemContent.name"
    class="tabcontent"
  >
    <slot></slot>
  </div>
</template>
<style scoped lang="scss">
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

.tab button:hover {
  background-color: #ddd;
}

.tab button.active {
  background-color: #ccc;
}

.tabcontent {
  display: none;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}
</style>
