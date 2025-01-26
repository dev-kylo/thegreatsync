// src/types/index.ts
export interface Layer {
    id: string;
    name: string;
    image?: HTMLImageElement;
    imagePath: string;
    position: {
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