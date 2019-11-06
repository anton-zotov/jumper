import Victor from 'victor';
import Canvas from "./canvas";

export default abstract class Shape {

	private positionHistory = [];

	constructor(
		protected canvas: Canvas,
		public x: number,
		public y: number,
		public color?: string
	) { }

	public abstract draw();

	public move(dx: number, dy: number) {
		this.positionHistory.push({ x: this.x, y: this.y });
		this.x += dx;
		this.y += dy;
	}

	public place(x: number, y: number) {
		this.positionHistory.push({ x: this.x, y: this.y });
		this.x = x;
		this.y = y;
	}

	public moveBack() {
		const { x, y } = this.positionHistory.pop();
		this.x = x;
		this.y = y;
	}

	public findPosition(isFine: (x: number, y: number) => boolean) {
		const epsilon = 1;
		let [{ x: startX, y: startY }] = this.positionHistory.slice(-1);
		let endX = this.x;
		let endY = this.y;
		const dist = () => new Victor(startX - endX, startY - endY).length();
		while (dist() > epsilon) {
			let cx = (startX + endX) / 2;
			let cy = (startY + endY) / 2;
			if (isFine(cx, cy)) {
				startX = cx;
				startY = cy;
			} else {
				endX = cx;
				endY = cy;
			}
		}
		return [startX, startY];
	}
}