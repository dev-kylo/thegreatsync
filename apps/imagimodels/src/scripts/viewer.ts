// src/scripts/viewer.ts
import type { Layer, Zone } from '../types';


class DragController {
    private isDragging = false;
    private lastMouseX = 0;
    private lastMouseY = 0;
    private dragStartX = 0;
    private dragStartY = 0;
    private readonly DRAG_THRESHOLD = 5; // pixels
    private isPotentialDrag = false;

    constructor(
        private canvas: HTMLCanvasElement,
        private transform: { x: number; y: number; scale: number },
        private onTransformChange: () => void
    ) {
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Start potential drag
        this.canvas.addEventListener('mousedown', (e) => {
            console.log('mousedown');
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            this.isPotentialDrag = true;
            // Don't set isDragging yet - wait to see if it's a drag or click
            this.canvas.style.cursor = 'grabbing';
            // Add move and up listeners only when needed
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('mouseup', this.handleMouseUp);
        });
    }

    private handleMouseMove = (e: MouseEvent) => {
        console.log('mousemove');
        console.log('Initial transform', this.transform);
        if (this.isDragging) {
            console.log('We are Dragging');
            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;

            // Adjust movement by current scale
            this.transform.x += deltaX / this.transform.scale;
            this.transform.y += deltaY / this.transform.scale;

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;

            console.log('Transform after dragging', this.transform);

            this.onTransformChange();
        } else if (this.isPotentialDrag) {
            console.log('We are potential dragging');
            const deltaX = e.clientX - this.dragStartX;
            const deltaY = e.clientY - this.dragStartY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > this.DRAG_THRESHOLD) {
                this.isDragging = true;
            }
        }
    }

    private handleMouseUp = () => {
        console.log('mouseup');
        this.isDragging = false;
        this.isPotentialDrag = false;
        this.canvas.style.cursor = 'default';
        
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    public isDraggingActive() {
        return this.isDragging || this.isPotentialDrag;
    }
}



export class LayerViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private layers: Layer[];
    private scale: number = 1;
    private activeLayers: Set<string> = new Set(['reference', 'islands', 'execution', 'functionship']);
    private greyscaleCache = new Map<string, HTMLCanvasElement>();
    private zones: Zone[];
    private currentTransform = { //  transform that is applied to the canvas (zones)
        x: 0,
        y: 0,
        scale: 1
    };
    private baseScale: number = 1;
    private dragController: DragController;

    constructor(canvasId: string, initialLayers: Layer[], zones: Zone[]) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.layers = initialLayers;
        this.zones = zones;

        this.dragController = new DragController(
            this.canvas,
            this.currentTransform,
            () => this.draw()
        );
        
        this.init();
        this.setupMessageListener();
        this.setupZoneButtons();
    }

    private async init() {
        await this.loadImages();
        this.setupCanvas();
        this.setupEventListeners();
        if (this.activeLayers.size > 0) this.setActiveLayers(Array.from(this.activeLayers));
        else this.draw();
    }

    private setupZoneButtons() {
        document.querySelectorAll('.zone-button').forEach(button => {
            button.addEventListener('click', () => {
                const zoneId = (button as HTMLElement).dataset.zone;
                if (zoneId === 'reset') {
                    this.resetView();
                } else {
                    this.zoomToZone(zoneId!);
                }
            });
        });
    }

    private zoomToZone(zoneId: string) {
        const zone = this.zones.find(z => z.id === zoneId);
        if (!zone) return;

        // Calculate center of zone
        const centerX = zone.position.x + zone.position.width / 2;
        const centerY = zone.position.y + zone.position.height / 2;

        // Calculate canvas center
        const canvasWidth = this.canvas.width / this.baseScale;
        const canvasHeight = this.canvas.height / this.baseScale;

        // Update existing transform object
        this.currentTransform.x = (canvasWidth / 2) - (centerX * zone.zoom);
        this.currentTransform.y = (canvasHeight / 2) - (centerY * zone.zoom);
        this.currentTransform.scale = zone.zoom;

        this.draw();
    }

    private resetView() {
        this.currentTransform = {
            x: 0,
            y: 0,
            scale: 1
        };
        this.draw();
    }

    private async loadImages() {
        // Load all images before starting
        await Promise.all(
            this.layers.map(async (layer) => {
                const img = new Image();
                img.src = layer.imagePath;
                await new Promise((resolve) => {
                    img.onload = resolve;
                });
                layer.image = img;
            })
        );
    }

    private setupCanvas() {
        const resize = () => {
            const container = this.canvas.parentElement!;
            const containerWidth = container.clientWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate scales for both dimensions
            const scaleWidth = containerWidth / 1080;    // Original width is 1080
            const scaleHeight = viewportHeight / 1920;   // Original height is 1920
            
            // Use the smaller scale to ensure it fits both width and height
            this.scale = Math.min(scaleWidth, scaleHeight);
            
            // Set canvas dimensions
            this.canvas.width = 1080 * this.scale;      // Scale from 1080
            this.canvas.height = 1920 * this.scale;     // Scale from 1920
            
            // Set canvas style
            this.canvas.style.width = `${this.canvas.width}px`;
            this.canvas.style.height = `${this.canvas.height}px`;
            
            this.ctx.scale(this.scale, this.scale);
            this.baseScale = this.scale;
            this.draw();
        };

        window.addEventListener('resize', resize);
        resize();
    }

    private setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            if (this.dragController.isDraggingActive()) return;
            
            const rect = this.canvas.getBoundingClientRect();
            // Adjust for current transform
            const x = ((e.clientX - rect.left) / this.scale - this.currentTransform.x) / this.currentTransform.scale;
            const y = ((e.clientY - rect.top) / this.scale - this.currentTransform.y) / this.currentTransform.scale;
            
            const clickedLayer = this.getLayerAtPoint(x, y);
            if (clickedLayer) {
                this.handleLayerClick(clickedLayer);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.dragController.isDraggingActive()) return;
            
            const rect = this.canvas.getBoundingClientRect();
            // Apply same transform to hover detection
            const x = ((e.clientX - rect.left) / this.scale - this.currentTransform.x) / this.currentTransform.scale;
            const y = ((e.clientY - rect.top) / this.scale - this.currentTransform.y) / this.currentTransform.scale;
            
            const hoveredLayer = this.getLayerAtPoint(x, y);
            this.canvas.style.cursor = hoveredLayer ? 'pointer' : 'default';
        });
    }

    private getLayerAtPoint(x: number, y: number): Layer | null {
        for (const layer of [...this.layers].reverse()) {
            if (this.isPointInLayer(x, y, layer)) {
                return layer;
            }
        }
        return null;
    }

    private isPointInLayer(x: number, y: number, layer: Layer): boolean {
        return x >= layer.position.x &&
               x <= layer.position.x + layer.position.width &&
               y >= layer.position.y &&
               y <= layer.position.y + layer.position.height;
    }

    private setupMessageListener() {
        window.addEventListener('message', (event) => {
            // Optional: Add origin checking for security
            // if (event.origin !== "https://trusted-parent-site.com") return;

            try {
                const { type, layerIds } = event.data;
                
                switch (type) {
                    case 'SET_ACTIVE_LAYERS':
                        if (Array.isArray(layerIds)) {
                            this.setActiveLayers(layerIds);
                        }
                        break;
                        
                    case 'TOGGLE_LAYERS':
                        if (Array.isArray(layerIds)) {
                            this.toggleLayers(layerIds);
                        }
                        break;

                    case 'GET_ACTIVE_LAYERS':
                        // Send active layers back to parent
                        this.sendActiveLayersToParent(event.source as Window);
                        break;
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });
    }

    private setActiveLayers(layerIds: string[]) {
        // Clear current active layers and set new ones
        this.activeLayers.clear();
        layerIds.forEach(id => {
            if (this.layers.some(layer => layer.id === id)) {
                this.activeLayers.add(id);
            }
        });
        this.draw();
        this.updateLayerInfo();
    }

    private toggleLayers(layerIds: string[]) {
        layerIds.forEach(id => {
            if (this.layers.some(layer => layer.id === id)) {
                if (this.activeLayers.has(id)) {
                    this.activeLayers.delete(id);
                } else {
                    this.activeLayers.add(id);
                }
            }
        });
        this.draw();
        this.updateLayerInfo();
    }

    private sendActiveLayersToParent(source: Window) {
        source.postMessage({
            type: 'ACTIVE_LAYERS_UPDATE',
            layerIds: Array.from(this.activeLayers)
        }, '*');  // Consider restricting this to specific origin
    }

    private handleLayerClick(layer: Layer) {
        if (this.activeLayers.has(layer.id)) {
            this.activeLayers.delete(layer.id);
        } else {
            this.activeLayers.add(layer.id);
        }
        this.draw();
        this.updateLayerInfo();

        // Notify parent of change
        window.parent.postMessage({
            type: 'ACTIVE_LAYERS_UPDATE',
            layerIds: Array.from(this.activeLayers)
        }, '*');
    }

    private updateLayerInfo() {
        const infoElement = document.getElementById('layerInfo')!;
        
        if (this.activeLayers.size > 0) {
            infoElement.innerHTML = `
                <h2>Active Layers</h2>
                <pre>${JSON.stringify(Array.from(this.activeLayers), null, 2)}</pre>
            `;
            infoElement.classList.add('active');
        } else {
            infoElement.classList.remove('active');
        }
    }

    private draw() {
        this.ctx.save(); // Save the clean state
        this.ctx.clearRect(0, 0, this.canvas.width / this.scale, this.canvas.height / this.scale);
        
        // Apply current transform
        this.ctx.translate(this.currentTransform.x, this.currentTransform.y);
        this.ctx.scale(this.currentTransform.scale, this.currentTransform.scale);

        this.layers.forEach(layer => {
            if (this.activeLayers.has(layer.id)) {
                this.ctx.globalAlpha = 1;
                // Draw the original color image
                this.ctx.drawImage(
                    layer.image, 
                    layer.position.x, 
                    layer.position.y, 
                    layer.position.width, 
                    layer.position.height
                );
            } else {
                this.ctx.globalAlpha = 0.5;
                this.drawGreyscale(layer);
            }
        });

        this.ctx.restore(); // Reset for next draw, preventing accumulation
    }

    private drawGreyscale(layer: Layer) {

        if (!this.greyscaleCache.has(layer.id)) {
            // Create temporary canvas for greyscale conversion
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d')!;
            
            tempCanvas.width = layer.position.width;
            tempCanvas.height = layer.position.height;
            
            tempCtx.drawImage(layer.image, 0, 0);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
            
            tempCtx.putImageData(imageData, 0, 0);
            // Store in cache
            this.greyscaleCache.set(layer.id, tempCanvas);
        }
        
        
    // Use cached version
    const cachedCanvas = this.greyscaleCache.get(layer.id)!;
    this.ctx.drawImage(cachedCanvas, layer.position.x, layer.position.y);
    }
}


