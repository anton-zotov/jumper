import Canvas from "./canvas";
import Shape from "./shape";

export default class Circle extends Shape {
	constructor(
		canvas: Canvas,
		x: number,
		y: number,
		public radius: number,
		color?: string
	) {
		super(canvas, x, y, color);
	}

	public draw() {
		if (this.color) {
			this.canvas.context.strokeStyle = this.color;
			this.canvas.context.fillStyle = this.color;
		}
		this.canvas.context.beginPath();
		this.canvas.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.canvas.context.stroke();
		this.canvas.context.fill();
	}
}