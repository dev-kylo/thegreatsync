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
    data?: Record<string, any>;
}
export interface Zone {
  id: string;
  name: string;
  position: {
      x: number;
      y: number;
      width: number;
      height: number;
  };
  zoom: number;
}