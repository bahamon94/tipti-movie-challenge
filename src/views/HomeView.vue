<script lang="ts">
import { ref, type Ref } from 'vue'
import CardSeries from '../components/CardSeries.vue'
import { mapActions, mapState } from 'pinia'
import { useGlobalStore } from '../stores/store'
import LoaderComponent from '@/components/LoaderComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
const baseUrlApi = import.meta.env.VITE_API_BASE_URL
const apiKey = import.meta.env.VITE_MARVEL_API_KEY
export default {
  components: {
    CardSeries,
    LoaderComponent,
    ErrorComponent
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    ...mapState(useGlobalStore, ['getViewSeries'])
  },
  setup() {
    const series: Ref<any[]> = ref([])
    const seriesLimit: Ref<number> = ref(0)
    const seriesSize: Ref<number> = ref(20)
    const currentPage: Ref<number> = ref(0)
    const isLoading: Ref<boolean> = ref(false)
    const isError: Ref<boolean> = ref(false)
    const isNoData: Ref<boolean> = ref(false)
    return {
      series,
      seriesLimit,
      seriesSize,
      currentPage,
      isLoading,
      isError,
      isNoData
    }
  },

  mounted() {
    this.getSeriesWithPagination(this.currentPage, this.seriesSize)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    ...mapActions(useGlobalStore, ['addViewSerie']),
    getSeriesWithPagination(currentPage: number, size: number): void {
      this.isLoading = true
      fetch(`${baseUrlApi}/series?limit=${size}&offset=${currentPage}&apikey=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200 && data.data.results?.length) {
            this.series = this.series.concat(data.data.results)
          } else {
            this.series = []
            this.isNoData = true
          }
          this.isLoading = false
        })
        .catch((error) => {
          this.isLoading = false
          this.isError = true
        })
    },
    getResourcesRelatedNumber(data: any): string {
      let stringToReturn = ''
      if (data.characters?.available) {
        stringToReturn = stringToReturn + `${data.characters?.available} Characters, `
      }
      if (data.creators?.available) {
        stringToReturn = stringToReturn + `${data.creators?.available} Creators, `
      }
      if (data.events?.available) {
        stringToReturn = stringToReturn + `${data.events?.available} Events, `
      }
      if (data.stories?.available) {
        stringToReturn = stringToReturn + `${data.stories?.available} Stories, `
      }
      if (data.comics?.available) {
        stringToReturn = stringToReturn + `${data.comics?.available} Comics`
      }
      return stringToReturn
    },
    handleScroll(): void {
      const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight
      if (endOfPage && !this.isLoading) {
        this.currentPage = this.currentPage + 1
        this.getSeriesWithPagination(this.currentPage, this.seriesSize)
      }
    },
    goToDetail(serie: any) {
      const findSerie = this.getViewSeries.find((saveSerie) => saveSerie.id === serie.id)
      if (!findSerie) {
        this.addViewSerie(serie)
      }
      this.$router.push(`/detail/${serie.id}`)
    }
  }
}
</script>

<template>
  <h1 v-if="!isLoading" style="text-align: center">Home View</h1>
  <div class="row">
    <div v-for="serie in series" :key="serie.id" class="column" style="">
      <CardSeries
        :title="serie.title"
        :type="serie.type"
        :ages="serie.endYear - serie.startYear"
        :img="`${serie.thumbnail?.path}.${serie.thumbnail?.extension}`"
        :resourcesRelatedNumber="getResourcesRelatedNumber(serie)"
        @click="goToDetail(serie)"
        style="cursor: pointer"
      ></CardSeries>
    </div>
  </div>
  <div v-if="isLoading">
    <LoaderComponent></LoaderComponent>
  </div>
  <ErrorComponent
    v-if="isError"
    type="Danger"
    message="Ups! Have one error with the call service, reload the app"
  ></ErrorComponent>
  <ErrorComponent v-if="isNoData" type="Alert" message="Info! Dont have data"></ErrorComponent>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

.column {
  min-height: 55vh;
  width: calc((100% / 3) - 16px);
  margin: 8px;
  transition: all 200ms ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}
.row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.row:after {
  content: '';
  display: table;
  clear: both;
}

@media screen and (max-width: 700px) {
  .column {
    width: 100%;
  }
}
</style>
