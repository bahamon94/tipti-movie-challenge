import type { MarvelSeries } from '@/types/MarvelSeries.types'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', {
  state: () => {
    return {
      viewSeries: [] as MarvelSeries[],
      savedSeries: [] as MarvelSeries[]
    }
  },
  getters: {
    getViewSeries(state): MarvelSeries[] {
      return state.viewSeries
    },
    getSavedSeries(state): MarvelSeries[] {
      return state.savedSeries
    }
  },
  actions: {
    addViewSerie(serie: MarvelSeries) {
      this.viewSeries = [ ...this.viewSeries, serie ]
    },
    addSavedSerie(serie: MarvelSeries) {
      this.savedSeries = [ ...this.savedSeries, serie ]
    },
    removeSavedSerie(serieId: string) {
      const findSerie = this.savedSeries.find((serie) => serie.id === Number(serieId))
      if (!findSerie) {
        return
      }
      const index = this.savedSeries.indexOf(findSerie)
      if (index > -1) this.savedSeries.splice(index, 1)
    }
  }
})
