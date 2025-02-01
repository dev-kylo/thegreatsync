// src/types/index.ts


export interface ImageData {
  id: number;
  attributes: ImageAttributes;
}

export interface ImageAttributes {
  width: number;
  height: number;
  url: string;
  title: string;
  placeholder: string;
  size: number;
  hash: string;
}
export interface Layer {
    id: string;
    name: string;
    imageElement?: HTMLImageElement;
    enabled: boolean;
    image: {
      image: {
        data: ImageData[];
      };
    };
    position: {
      id: number;
      x: number;
      y: number;
      width: number;
      height: number;
    };
    zIndex?: number;  
    data?: Record<string, any>;
}
export interface Zone {
  id: string;
  name: string;
  centerPosition: number;  // percentage from top (0-100)
  focusPoint: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
  zoom: number;
}

export interface ImagiModel {
  id: string;
  width: number;
  height: number;
  layers: Layer[];
  zones: Zone[];
}

export type FetchImagimodelResponse = {
  data: {
    id: number,
    attributes: {
      layers: Layer[];
      zones: Zone[];
      width: number;
      height: number;
      containerHeightPercent: number;
      alignment: 'left' | 'center' | 'right';
    }
  }
};
