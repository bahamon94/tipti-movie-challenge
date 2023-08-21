export interface Thumbnail {
  path: string;
  extension: string;
}

export interface Url {
  type: string;
  url: string;
}

export interface Creator {
  resourceURI: string;
  name: string;
  role: string;
}

export interface Story {
  resourceURI: string;
  name: string;
  type: string;
}

export interface Comic {
  resourceURI: string;
  name: string;
}

export interface MarvelSeries {
  id: number;
  title: string;
  description: string | null;
  startYear: number;
  endYear: number;
  rating: string;
  type: string;
  modified: string;
  thumbnail: Thumbnail;
  creators: {
    available: number;
    collectionURI: string;
    items: Creator[];
    returned: number;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: any[];
    returned: number;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Story[];
    returned: number;
  };
  comics: {
    available: number;
    collectionURI: string;
    items: Comic[];
    returned: number;
  };
  events: {
    available: number;
    collectionURI: string;
    items: any[]; 
    returned: number;
  };
  next: null | any; 
  previous: null | any;
}
