import type { MarvelSeries } from "@/types/MarvelSeries.types"

const baseUrlApi = import.meta.env.VITE_API_BASE_URL
const apiKey = import.meta.env.VITE_MARVEL_API_KEY

export async function fetchMarvelSeries(limit: number, currentPage: number): Promise<MarvelSeries[]> {
  const url = `${baseUrlApi}/series?limit=${limit}&offset=${currentPage}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (data.code !== 200 || !data.data.results?.length) {
      throw new Error('No se encontraron resultados válidos en la respuesta de la API');
    }

    return data.data.results;
  } catch (error) {
    console.error('Error al obtener datos de series:', error);
    throw error; // Lanzar el error para que pueda ser manejado más arriba en el código
  }
}

export async function fetchSerieDataById(idSerie: number): Promise<MarvelSeries> {
  try {
    const response = await fetch(`${baseUrlApi}/series/${idSerie}?apikey=${apiKey}`);

    if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);

    const data = await response.json();
    return data.data.results[0];

  } catch (error) {
    console.error('Error al obtener datos de la serie:', error);
    throw error;
  }
}

export async function fetchResourceData(serieId: number, resourceName: string) {
  try {
    const response = await fetch(`${baseUrlApi}/series/${serieId}/${resourceName.toLowerCase()}?apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.results;
  } catch (error) {
    console.error('Error al obtener datos del recurso:', error);
    throw error;
  }
}
