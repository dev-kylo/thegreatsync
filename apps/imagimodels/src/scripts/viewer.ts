// src/scripts/viewer.ts
import type { Layer, Zone } from '../types';


class DragController {
    private isDragging = false;
    private lastMouseX = 0;
    private lastMouseY = 0;
    private dragStartX = 0;
    private dragStartY = 0;
    private readonly DRAG_THRESHOLD = 5; // pixels
    private readonly DRAG_SPEED = 3.5; // Increase this to make dragging faster
    private isPotentialDrag = false;
    private hadDragActivity = false; 

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
        if (this.isDragging) {
            this.hadDragActivity = true;
            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;

            // Apply speed multiplier to the movement
            this.transform.x += (deltaX * this.DRAG_SPEED) / this.transform.scale;
            this.transform.y += (deltaY * this.DRAG_SPEED) / this.transform.scale;

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;

            this.onTransformChange();
        } else if (this.isPotentialDrag) {
            const deltaX = e.clientX - this.dragStartX;
            const deltaY = e.clientY - this.dragStartY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > this.DRAG_THRESHOLD) {
                this.isDragging = true;
                this.hadDragActivity = true;
            }
        }
    }

    private handleMouseUp = () => {
        console.log('mouseup');
        this.isDragging = false;
        this.isPotentialDrag = false;
        this.canvas.style.cursor = 'default';

        // Clear the flag after a short delay to ensure click event processes it
        setTimeout(() => {
            this.hadDragActivity = false;
        }, 0);
        
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    public isDraggingActive() {
        return this.isDragging || this.isPotentialDrag || this.hadDragActivity;;
    }
}


export class LayerViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private layers: Layer[];
    private scale: number = 1;
    private enabledLayers: Set<string> = new Set();
    private activeLayer: string | null = null;
    private greyscaleCache = new Map<string, HTMLCanvasElement>();
    private zones: Zone[];
    private currentTransform = { //  transform that is applied to the canvas (zones)
        x: 0,
        y: 0,
        scale: 1
    };
    private readonly MIN_ZOOM = 0.1;
    private readonly MAX_ZOOM = 3;
    private ZOOM_SPEED: number = 0.001;
    private baseScale: number = 1;
    private dragController: DragController;
    private originalWidth: number;
    private originalHeight: number;
    private containerHeightPercent: number;
    private alignment: 'left' | 'center' | 'right';
    private hoveredLayer: Layer | null = null;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private readonly TILT_INTENSITY = 5; // Maximum tilt angle in degrees
    private readonly TILT_ANIMATION_SPEED = 0.5; // Animation speed
    private currentTiltX: number = 0;
    private currentTiltY: number = 0;
    private targetTiltX: number = 0;
    private targetTiltY: number = 0;
    private isAnimating: boolean = false;
    private readonly tiltEnabled: boolean;  // Global tilt control


    /**
     * Creates a new LayerViewer instance
     * @param canvasId - ID of the canvas element
     * @param layers - Array of initial layers
     * @param zones - Array of zones for zooming
     * @param width - Original width of the content
     * @param height - Original height of the content   
     * @param containerHeightPercent - Percentage of viewport height to use
     * @param alignment - Horizontal alignment ('left', 'center', 'right')
     * @param zoomSpeed - Zoom speed
     * @param tiltEnabled - Global tilt control
     */
    constructor(canvasId: string, layers: Layer[], zones: Zone[], width: number = 1080, height: number = 1920, containerHeightPercent: number = 100, alignment: 'left' | 'center' | 'right' = 'center', zoomSpeed: number = 0.001, tiltEnabled: boolean = true) {
        
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.layers = layers;
        this.enabledLayers = new Set(layers.filter(layer => layer.enabled).map(layer => layer.id));
        this.zones = zones;
        this.originalWidth = width;
        this.originalHeight = height;
        this.containerHeightPercent = containerHeightPercent;
        this.alignment = alignment;
        this.ZOOM_SPEED = zoomSpeed;
        this.dragController = new DragController(
            this.canvas,
            this.currentTransform,
            () => this.draw()
        );
        this.tiltEnabled = tiltEnabled;
        
        this.init();
        this.setupMessageListener();
        this.setupZoneButtons();
    }

    private async init() {
        await this.loadImages();
        this.setupCanvas();
        this.setupEventListeners();
        if (this.enabledLayers.size > 0) this.setEnabledLayers(Array.from(this.enabledLayers));
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
        const zone = this.zones.find(z => +z.id === +zoneId!);
        console.log("ZONE", zone);
        if (!zone) return;
        
        // Calculate container dimensions
        const containerWidth = this.canvas.width;
        const containerHeight = this.canvas.height;
        const scaledWidth = this.originalWidth * this.scale * zone.zoom;
        const scaledHeight = this.originalHeight * this.scale * zone.zoom;
        
        // Calculate the vertical center point based on percentage
        const centerY = (zone.centerPosition / 100) * this.originalHeight;

        // Set scale
        this.currentTransform.scale = zone.zoom;

        // Calculate base positions based on focus point
        let baseX: number;
        let baseY: number;
        
        switch (zone.focusPoint) {
            case 'left':
                baseX = 0;
                baseY = (containerHeight / 2) - (centerY * zone.zoom);
                break;
            case 'right':
                baseX = containerWidth - scaledWidth;
                baseY = (containerHeight / 2) - (centerY * zone.zoom);
                break;
            case 'top-left':
                baseX = 0;
                baseY = 0;
                break;
            case 'top-right':
                baseX = containerWidth - scaledWidth;
                baseY = 0;
                break;
            case 'bottom-left':
                baseX = 0;
                baseY = containerHeight - scaledHeight;
                break;
            case 'bottom-right':
                baseX = containerWidth - scaledWidth;
                baseY = containerHeight - scaledHeight;
                break;
            case 'center':
            default:
                baseX = (containerWidth - scaledWidth) / 2;
                baseY = (containerHeight / 2) - (centerY * zone.zoom);
                break;
        }

    // Apply alignment offset
    switch (this.alignment) {
        case 'left':
            this.currentTransform.x = baseX / this.scale;
            break;
        case 'right':
            this.currentTransform.x = baseX / this.scale;
            break;
        case 'center':
        default:
            this.currentTransform.x = baseX / this.scale;
            break;
    }

        // Always calculate Y based on centerPosition
        this.currentTransform.y = baseY / this.scale;

        this.draw();
    }

    private resetView() {    
        const containerWidth = this.canvas.width;
        const scaledContentWidth = this.originalWidth * this.scale;
        const emptySpace = containerWidth - scaledContentWidth;
    
        // Reset scale
        this.currentTransform.scale = 1;
        
        // Reset position based on alignment
        switch (this.alignment) {
            case 'left':
                this.currentTransform.x = 0;
                break;
            case 'right':
                this.currentTransform.x = emptySpace / this.scale;
                break;
            case 'center':
            default:
                this.currentTransform.x = emptySpace / (2 * this.scale);
                break;
        }
        this.currentTransform.y = 0;
        
        this.draw();
    }

    private async loadImages() {
        // Load all images before starting
        await Promise.all(
            this.layers.map(async (layer) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = layer.image.image.data[0].attributes.url;
                console.log("IMAGE");
                console.log(layer.image.image.data[0].attributes.url);
                await new Promise((resolve) => {
                    img.onload = resolve;
                });
                layer.imageElement = img;
            })
        );
    }

    private setupCanvas() {
        const resize = () => {
            const container = this.canvas.parentElement!;
            const containerWidth = container.clientWidth;
            // Calculate available height based on viewport and container percentage
            const availableHeight = (window.innerHeight * this.containerHeightPercent) / 100;
            
            // Set canvas to container width
            this.canvas.width = containerWidth;
            this.canvas.height = availableHeight;
            
            // Calculate scale based on original dimensions
            const scaleWidth = containerWidth / this.originalWidth;    
            const scaleHeight = availableHeight / this.originalHeight;   
            this.scale = Math.min(scaleWidth, scaleHeight);

            const scaledContentWidth = this.originalWidth * this.scale;
            const emptySpace = containerWidth - scaledContentWidth;

            // Set transform.x based on alignment
            switch (this.alignment) {
                case 'left':
                    this.currentTransform.x = 0;
                    break;
                case 'right':
                    this.currentTransform.x = emptySpace / this.scale;
                    break;
                case 'center':
                default:
                    this.currentTransform.x = emptySpace / (2 * this.scale);
                    break;
            }
            
            this.currentTransform.y = 0;
            
            this.ctx.scale(this.scale, this.scale);
            this.baseScale = this.scale;
            this.draw();
            console.log('Debug centering:', {
                containerWidth,
                originalWidth: this.originalWidth,
                scale: this.scale,
                transformX: this.currentTransform.x
            });
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
            const x = ((e.clientX - rect.left) / this.scale - this.currentTransform.x) / this.currentTransform.scale;
            const y = ((e.clientY - rect.top) / this.scale - this.currentTransform.y) / this.currentTransform.scale;
            
            const hoveredLayer = this.getLayerAtPoint(x, y);
            
            if (hoveredLayer) {
                // Calculate relative mouse position within the layer
                const relativeX = (x - hoveredLayer.position.x) / hoveredLayer.position.width;
                const relativeY = (y - hoveredLayer.position.y) / hoveredLayer.position.height;
                
                // Convert to tilt angles (-1 to 1, then scaled by TILT_INTENSITY)
                this.targetTiltX = (relativeY - 0.5) * 2 * this.TILT_INTENSITY;
                this.targetTiltY = (relativeX - 0.5) * -2 * this.TILT_INTENSITY;
            } else {
                this.targetTiltX = 0;
                this.targetTiltY = 0;
            }
            
            // Update hover state
            if (hoveredLayer !== this.hoveredLayer) {
                this.hoveredLayer = hoveredLayer;
                if (!hoveredLayer) {
                    this.targetTiltX = 0;
                    this.targetTiltY = 0;
                }
            }
            
            this.canvas.style.cursor = hoveredLayer ? 'pointer' : 'default';
            
            // Start animation if not already running
            if (!this.isAnimating) {
                this.animateTilt();
            }
        });

        // Add mouseout handler
        this.canvas.addEventListener('mouseout', () => {
            this.hoveredLayer = null;
            this.targetTiltX = 0;
            this.targetTiltY = 0;
            if (!this.isAnimating) {
                this.animateTilt();
            }
        });

        // Add wheel event listener for zooming
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent page scrolling

            // Get mouse position relative to canvas
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / this.scale;
            const mouseY = (e.clientY - rect.top) / this.scale;

            // Calculate zoom factor based on wheel delta
            const zoomFactor = 1 - e.deltaY * this.ZOOM_SPEED;
            const newScale = Math.min(
                Math.max(
                    this.currentTransform.scale * zoomFactor,
                    this.MIN_ZOOM
                ),
                this.MAX_ZOOM
            );

            // Calculate position adjustment to zoom towards mouse cursor
            const scaleDiff = newScale - this.currentTransform.scale;
            this.currentTransform.x -= (mouseX - this.currentTransform.x) * (scaleDiff / newScale);
            this.currentTransform.y -= (mouseY - this.currentTransform.y) * (scaleDiff / newScale);
            
            this.currentTransform.scale = newScale;
            this.draw();
        }, { passive: false });
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
            if (event.origin !== "https://learn.thegreatsync.com" && event.origin !== "http://localhost:3000" && event.origin !== "https://thegreatsync.com/") return;

            try {
                const { type, layerIds } = event.data;
                
                switch (type) {
                    case 'SET_ENABLED_LAYERS':
                        if (Array.isArray(layerIds)) {
                            this.setEnabledLayers(layerIds);
                        }
                        break;
                    case 'CLEAR_ACTIVE_LAYER':
                        this.activeLayer = null;
                        break;
                        
                    case 'TOGGLE_LAYERS':
                        if (Array.isArray(layerIds)) {
                            this.toggleLayers(layerIds);
                        }
                        break;
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });
    }

    private setEnabledLayers(layerIds: string[]) {
        // Clear current enabled layers and set new ones
        this.enabledLayers.clear();
        layerIds.forEach(id => {
            if (this.layers.some(layer => layer.id === id)) {
                this.enabledLayers.add(id);
            }
        });
        this.draw();
        this.updateLayerInfo();
    }

    private setActiveLayer(layerId: string) {
        // Clear current active layers and set new ones
        this.activeLayer = layerId;
        this.updateLayerInfo();
    }

    private toggleLayers(layerIds: string[]) {
        layerIds.forEach(id => {
            if (this.layers.some(layer => layer.id === id)) {
                if (this.enabledLayers.has(id)) {
                    this.enabledLayers.delete(id);
                } else {
                    this.enabledLayers.add(id);
                }
            }
        });
        this.draw();
        this.updateLayerInfo();
    }

    private handleLayerClick(layer: Layer) {
       
        if (this.enabledLayers.has(layer.id)) {
            this.setActiveLayer(layer.id);
        }
        // Notify parent of change
        window.parent.postMessage({
            type: 'ACTIVE_LAYER_UPDATE',
            layerId: this.activeLayer
        }, '*');
    }

    private updateLayerInfo() {
        const infoElement = document.getElementById('layerInfo')!;

        console.log('DO Nothing')
        
        // if (this.activeLayer) {
        //     infoElement.innerHTML = `
        //         <h2>Active Layers</h2>
        //         <pre>${this.activeLayer}</pre>
        //     `;
        //     infoElement.classList.add('active');
        // } else {
        //     infoElement.classList.remove('active');
        // }
    }

    private draw() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width / this.scale, this.canvas.height / this.scale);
        
        this.ctx.translate(this.currentTransform.x, this.currentTransform.y);
        this.ctx.scale(this.currentTransform.scale, this.currentTransform.scale);

        const sortedLayers = [...this.layers].sort((a, b) => {
            const zIndexA = a.zIndex ?? 0;
            const zIndexB = b.zIndex ?? 0;
            return zIndexA - zIndexB;
        });

        sortedLayers.forEach(layer => {
            this.ctx.save();
            
            // Check both global and layer-specific tilt settings
            const layerTiltEnabled = layer.tiltEnabled ?? true;
            const shouldTilt = this.tiltEnabled && layerTiltEnabled;
            
            // Apply 3D tilt effect if this is the hovered layer and tilt is enabled
            if (layer === this.hoveredLayer && shouldTilt) {
                const centerX = layer.position.x + layer.position.width / 2;
                const centerY = layer.position.y + layer.position.height / 2;
                
                // Move to center point
                this.ctx.translate(centerX, centerY);
                
                // Apply perspective transform
                const transform = new DOMMatrix()
                    .translate(0, 0, 0)
                    .rotate(this.currentTiltX, this.currentTiltY, 0)
                    .translate(0, 0, 50);
                
                // Convert the 3D matrix to a 2D context transform
                const { a, b, c, d, e, f } = transform;
                this.ctx.transform(a, b, c, d, e, f);
                
                // Move back to original position
                this.ctx.translate(-centerX, -centerY);
                
                // Add subtle shadow for depth
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowOffsetX = this.currentTiltY * 0.5;
                this.ctx.shadowOffsetY = this.currentTiltX * 0.5;
            }

            if (this.enabledLayers.has(layer.id)) {
                this.ctx.globalAlpha = 1;
                this.ctx.drawImage(
                    layer.imageElement as HTMLImageElement,
                    layer.position.x,
                    layer.position.y,
                    layer.position.width,
                    layer.position.height
                );
            } else {
                this.ctx.globalAlpha = 0.5;
                this.drawGreyscale(layer);
            }
            
            this.ctx.restore();
        });

        this.ctx.restore();
    }

    private drawGreyscale(layer: Layer) {

        if (!this.greyscaleCache.has(layer.id)) {
            // Create temporary canvas for greyscale conversion
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d')!;

            console.log("G LAYER");
            console.log(layer);
            
            tempCanvas.width = layer.position.width;
            tempCanvas.height = layer.position.height;

            
            tempCtx.drawImage(layer.imageElement as HTMLImageElement, 0, 0);
            
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

    private animateTilt() {
        this.isAnimating = true;

        // Smoothly interpolate current tilt towards target tilt
        this.currentTiltX += (this.targetTiltX - this.currentTiltX) * this.TILT_ANIMATION_SPEED;
        this.currentTiltY += (this.targetTiltY - this.currentTiltY) * this.TILT_ANIMATION_SPEED;

        // Draw the updated state
        this.draw();

        // Continue animation if there's still significant movement
        if (
            Math.abs(this.targetTiltX - this.currentTiltX) > 0.01 ||
            Math.abs(this.targetTiltY - this.currentTiltY) > 0.01
        ) {
            requestAnimationFrame(() => this.animateTilt());
        } else {
            this.isAnimating = false;
        }
    }
}


