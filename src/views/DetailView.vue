<script lang="ts">
import { type Ref, ref } from 'vue'
import TabComponent from '../components/TabComponent.vue'
import ToggleComponent from '../components/ToggleComponent.vue'
import { mapActions, mapState } from 'pinia'
import { useGlobalStore } from '../stores/store'
const baseUrlApi = import.meta.env.VITE_API_BASE_URL
const apiKey = import.meta.env.VITE_MARVEL_API_KEY
export default {
  components: {
    TabComponent,
    ToggleComponent
  },

  computed: {
    ...mapState(useGlobalStore, ['getSavedSeries'])
  },
  setup() {
    const serie: Ref<any> = ref(null)
    const detailResourcesList: Ref<any[]> = ref([])
    const isLoading: Ref<boolean> = ref(false)
    const activeResource: Ref<string> = ref('')

    return {
      serie,
      detailResourcesList,
      isLoading,
      activeResource
    }
  },
  mounted() {
    this.getSerieByid(this.$route.params.id)
  },

  methods: {
    ...mapActions(useGlobalStore, ['addSavedSerie', 'removeSavedSerie']),
    getSerieByid(idSerie: any): void {
      this.isLoading = true
      fetch(`${baseUrlApi}/series/${idSerie}?apikey=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          const result = data.data.results[0]
          this.serie = {
            ...result,
            ages: result.endYear - result.startYear,
            img: `${result.thumbnail.path}.${result.thumbnail.extension}`,
            isSaved: this.getIsSaveSerie(result.id)
          }
          this.isLoading = false
        })
    },
    getIsSaveSerie(serieId: string) {
      if (this.getSavedSeries.length) {
        return this.getSavedSeries.some((serie) => serie.id === serieId)
      }
      return false
    },
    buildDataToTabs(serie: any): any[] {
      let arrayToReturn = []
      if (serie.characters?.available) {
        arrayToReturn.push({ ...serie.characters, name: 'Characters' })
      }
      if (serie.comics?.available) {
        arrayToReturn.push({ ...serie.comics, name: 'Comics' })
      }
      if (serie.creators?.available) {
        arrayToReturn.push({ ...serie.creators, name: 'Creators' })
      }
      if (serie.events?.available) {
        arrayToReturn.push({ ...serie.events, name: 'Events' })
      }
      if (serie.stories?.available) {
        arrayToReturn.push({ ...serie.stories, name: 'Stories' })
      }
      return arrayToReturn
    },
    getResourcesBySerieIdAndResourceName(serieId: string, resourceName: string) {
      this.activeResource = resourceName
      fetch(
        `${baseUrlApi}/series/${serieId}/${resourceName.toLowerCase()}?apikey=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.detailResourcesList = data.data.results
        })
    },
    saveSerie(event: boolean) {
      if (event) {
        if (this.getSavedSeries.length < 10) {
          this.addSavedSerie(this.serie)
        } else {
          this.serie.isSaved = null
          setTimeout(() => {
            this.serie.isSaved = false
          }, 0)
          alert('Ya tiene 10 guardados')
        }
      } else this.removeSavedSerie(this.serie.id)
    }
  }
}
</script>
<template>
  <div v-if="serie" class="detail-container">
    <div class="detail-top">
      <img height="300" :src="serie.img" alt="" />
      <div style="margin-left: 5rem; flex-basis: 100%">
        <h4>Title: {{ serie.title }}</h4>
        <p>Description: {{ serie.description || 'n/a' }}</p>
        <p>Type: {{ serie.type || 'n/a' }}</p>
        <p>Start year: {{ serie.startYear || 'n/a' }}</p>
        <p>End year: {{ serie.endYear || 'n/a' }}</p>
        <p>Rating: {{ serie.rating || 'n/a' }}</p>
        <p>Modified: {{ serie.modified || 'n/a' }}</p>
      </div>
      <div style="margin-top: 1rem; margin-right: 1rem">
        <h3>Saved</h3>
        <ToggleComponent
          v-if="serie.isSaved !== null"
          @changeValue="saveSerie"
          :active-value="serie.isSaved"
        ></ToggleComponent>
      </div>
    </div>
    <div class="tabs">
      <TabComponent
        v-if="buildDataToTabs(serie).length"
        @changeTab="getResourcesBySerieIdAndResourceName(serie.id, $event)"
        :data-to-tabs="buildDataToTabs(serie)"
      >
        <div>
          <div
            style="display: flex; margin-top: 1rem"
            v-for="resource of detailResourcesList"
            :key="resource.id"
          >
            <img
              v-if="resource.thumbnail"
              width="200"
              height="200"
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
              <p v-if="activeResource === 'Stories'">Type: {{ resource.type }}</p>
            </div>
          </div>
        </div></TabComponent
      >
      <div v-else>Not found resources</div>
    </div>
  </div>
  <div v-else>Loading ...</div>
</template>

<style scoped lang="scss">
.detail-container {
  .detail-top {
    display: flex;
  }
}
</style>
