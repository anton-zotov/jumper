export default class Canvas {
	get context(): CanvasRenderingContext2D {
		return this._context;
	}

	get width(): number {
		return this.canvas.width;
	}

	get height(): number {
		return this.canvas.height;
	}

	private canvas: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;

	constructor() {
		this.create();
		window.addEventListener('resize', this.resizeCanvas.bind(this), false);
	}

	public clear() {
		this.context.clearRect(0, 0, this.width, this.height);
	}

	public drawFPS(fps: number): void {
		this.context.fillStyle = '#888';
		this.context.font = "24px Arial";
		this.context.fillText(`FPS: ${fps}`, this.width - 150, 40);
	}
	
	public drawHint(): void {
		this.context.fillStyle = '#ccc';
		this.context.font = "40px Arial";
		this.context.fillText(`Use arrows to control the jumper`, this.width / 2 - 300, this.height / 2 - 60);
	}

	private create(config = { width: 1600, height: 900 }): void {
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.resizeCanvas();
		this._context = this.canvas.getContext('2d');
	}

    private resizeCanvas() {
		this.canvas.width = window.innerWidth;
        this.canvas.height = document.body.scrollHeight;
    }
}