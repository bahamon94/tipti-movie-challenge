import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', {
  state: () => {
    return {
      viewSeries: [] as any[],
      savedSeries: [] as any[]
    }
  },
  getters: {
    getViewSeries(state): any[] {
      return state.viewSeries
    },
    getSavedSeries(state): any[] {
      return state.savedSeries
    }
  },
  actions: {
    addViewSerie(serie: any) {
      this.viewSeries.push(serie)
    },
    addSavedSerie(serie: any) {
      this.savedSeries.push(serie)
    },
    removeSavedSerie(serieId: string) {
      const findSerie = this.savedSeries.find((serie) => serie.id === serieId)
      if (!findSerie) {
        return
      }
      const index = this.savedSeries.indexOf(findSerie)
      if (index > -1) this.savedSeries.splice(index, 1)
    }
  }
})
