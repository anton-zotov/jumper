import Canvas from "./canvas";
import Shape from "./shape";

export default class Rect extends Shape {
	constructor(
		canvas: Canvas,
		x: number,
		y: number,
		public width: number,
		public height: number,
		public angle: number = 0,
		color?: string
	) {
		super(canvas, x, y, color);
	}

	public draw() {
		if (this.color) this.canvas.context.fillStyle = this.color;
		this.canvas.context.translate(this.x, this.y);
		this.canvas.context.rotate(this.angle);
		this.canvas.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		this.canvas.context.rotate(-this.angle);
		this.canvas.context.translate(-this.x, -this.y);
	}
}