import Canvas from "./canvas";

export default class Ground {
	private height = 100;
	constructor(private canvas: Canvas) { }

	public draw() {
		this.canvas.context.fillStyle = '#000';
		this.canvas.context.fillRect(0, this.canvas.height - this.height, 9999, this.height);
	}

	public isCollision(x: number, y: number) {
		return y > this.canvas.height - this.height;
	}
}