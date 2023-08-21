<script lang="ts">
import { type Ref, ref } from 'vue'
import { mapActions, mapState } from 'pinia'

import { fetchSerieDataById, fetchResourceData } from '@/services/movies'
import type { TabData } from '@/types/TabData.types'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'

import TabComponent from '../components/TabComponent.vue'
import ToggleComponent from '../components/ToggleComponent.vue'
import { useGlobalStore } from '../stores/store'

export default {
  components: {
    TabComponent,
    ToggleComponent
  },

  computed: {
    ...mapState(useGlobalStore, [ 'getSavedSeries' ])
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
    this.getSerieByid(Number(this.$route.params.id))
  },

  methods: {
    ...mapActions(useGlobalStore, [ 'addSavedSerie', 'removeSavedSerie' ]),
    async getSerieByid(idSerie: number) {
      this.isLoading = true

      try {
        const serieData = await fetchSerieDataById(idSerie)
        this.serie = {
          ...serieData,
          ages: serieData.endYear - serieData.startYear,
          img: `${serieData.thumbnail.path}.${serieData.thumbnail.extension}`,
          isSaved: this.getIsSaveSerie(serieData.id.toString())
        }
      } catch (error) {
        console.error('Error al obtener datos de la serie:', error)
      } finally {
        this.isLoading = false
      }
    },
    getIsSaveSerie(serieId: string) {
      if (this.getSavedSeries.length) {
        return this.getSavedSeries.some((serie) => serie.id === serieId)
      }
      return false
    },
    buildDataToTabs(serie: any): TabData[] {
      const tabFields = [ 'characters', 'comics', 'creators', 'events', 'stories' ]

      return tabFields.reduce((tabs: TabData[], field: string) => {
        if (serie[ field ]?.available) {
          tabs.push({ name: capitalizeFirstLetter(field), available: serie[ field ].available })
        }
        return tabs
      }, [])
    },

  async getResourcesBySerieIdAndResourceName(serieId: string, resourceName: string) {
      this.activeResource = resourceName
      try {
        const serieIdParse = Number(serieId);
        this.detailResourcesList = await fetchResourceData(serieIdParse, resourceName)
      } catch (error) {
        console.error('Error al obtener datos del recurso:', error)
      }
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
        <ToggleComponent v-if="serie.isSaved !== null" @changeValue="saveSerie" :active-value="serie.isSaved">
        </ToggleComponent>
      </div>
    </div>
    <div class="tabs">
      <TabComponent v-if="buildDataToTabs(serie).length"
        @changeTab="getResourcesBySerieIdAndResourceName(serie.id, $event)" :data-to-tabs="buildDataToTabs(serie)">
        <div>
          <div style="display: flex; margin-top: 1rem" v-for="resource of detailResourcesList" :key="resource.id">
            <img v-if="resource.thumbnail" width="200" height="200" style="min-width: 200px"
              :src="resource.thumbnail?.path + '.' + resource.thumbnail?.extension" alt="" />
            <div style="margin-left: 4rem">
              <h4 v-if="resource.fullName || resource.name">
                Name: {{ resource.fullName || resource.name }}
              </h4>
              <h4 v-if="resource.title">Title: {{ resource.title }}</h4>
              <p>Modified: {{ resource.modified }}</p>
              <p v-if="resource.textObjects?.length">
                Description: {{ resource.textObjects[ 0 ].text }}
              </p>
              <p v-if="activeResource === 'Stories'">Type: {{ resource.type }}</p>
            </div>
          </div>
        </div>
      </TabComponent>
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
