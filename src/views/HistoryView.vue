<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useGlobalStore } from '../stores/store'
import TabComponent from '../components/TabComponent.vue'
import ToggleComponent from '../components/ToggleComponent.vue'
import { type Ref, ref } from 'vue'

export default {
  setup() {
    const activeResource: Ref<string> = ref('')
    const tabs: Ref<any[]> = ref([
      { id: 1, name: 'Viewed' },
      { id: 2, name: 'Saved' }
    ])
    const activeList: Ref<any[]> = ref([])
    return {
      activeResource,
      tabs,
      activeList
    }
  },
  components: {
    TabComponent,
    ToggleComponent
  },
  computed: {
    ...mapState(useGlobalStore, ['getViewSeries', 'getSavedSeries'])
  },
  mounted() {},
  methods: {
    ...mapActions(useGlobalStore, ['addSavedSerie', 'removeSavedSerie']),
    getResourcesSeriesToShow(activeTab: string) {
      this.activeResource = activeTab
      if (activeTab === 'Viewed') {
        this.activeList = this.getViewSeries.filter(
          (viewSerie) => !this.getSavedSeries.some((savedSerie) => savedSerie.id === viewSerie.id)
        )
        return
      }
      this.activeList = this.getSavedSeries
    },
    gotToDetail(serie: any) {
      if (this.activeResource !== 'Viewed') return
      this.$router.push(`/detail/${serie.id}`)
    },
    saveSerie(event: boolean, serie: any) {
      if (event) {
        if (this.getSavedSeries.length < 10) {
          this.addSavedSerie(serie)
        } else {
          serie.isSaved = null
          setTimeout(() => {
            serie.isSaved = false
          }, 0)
          alert('Ya tiene 10 guardados')
        }
        this.getResourcesSeriesToShow(this.activeResource)
      }
    }
  }
}
</script>
<template>
  <div class="tabs">
    <TabComponent @changeTab="getResourcesSeriesToShow" :data-to-tabs="tabs">
      <div>
        <div
          style="display: flex; margin-top: 1rem"
          v-for="resource of activeList"
          :key="resource.id"
        >
          <div
            @click="gotToDetail(resource)"
            style="display: flex"
            :style="{ cursor: activeResource === 'Viewed' ? 'pointer' : '' }"
          >
            <img
              v-if="resource.thumbnail"
              width="150"
              height="150"
              style="min-width: 200px"
              :src="resource.thumbnail?.path + '.' + resource.thumbnail?.extension"
              alt=""
            />
            <div style="margin-left: 4rem">
              <h4 v-if="resource.fullName || resource.name">
                Name: {{ resource.fullName || resource.name }}
              </h4>
              <h4 v-if="resource.title">Title: {{ resource.title }}</h4>
              <p>Modified: {{ resource.modified }}</p>
              <p v-if="resource.textObjects?.length">
                Description: {{ resource.textObjects[0].text }}
              </p>
            </div>
          </div>
          <div v-if="activeResource === 'Viewed'" style="margin-top: 1rem; margin-right: 1rem">
            <h3>Saved</h3>
            <ToggleComponent
              v-if="resource.isSaved !== null"
              @changeValue="saveSerie($event, resource)"
              :active-value="resource.isSaved"
            ></ToggleComponent>
          </div>
        </div>
      </div>
    </TabComponent>
  </div>
</template>

<style></style>
