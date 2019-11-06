import Victor from 'victor';

import Canvas from "./canvas";
import { applyGravity, inverseGravity, G } from "./gravity";
import Rect from "./rect";
import Circle from './circle';
import Shape from './shape';

export interface IActions {
	checkCollision: (x: number, y: number) => boolean;
}

export default class Jumper {

	public userDa: number = 0;

	private x: number = 100;
	private y: number = 390;
	private bodyWidth: number = 20;
	private bodyHeight: number = 50;
	private dx: number = 0;
	private dy: number = 0;
	private da: number = 0;
	private springMaxLength = 50;
	private springRigidity = 200;
	private body: Rect;
	private foot: Circle;

	private footIsStanding = false;
	private lastAngle = 0;
	private userRotationSpeed = Math.PI;
	private userSpringForce = 0;
	private userSpringForceChange = 50;

	get parts(): Shape[] {
		return [this.body, this.foot];
	}

	get angle(): number {
		return new Victor(this.foot.x, this.foot.y).subtract(new Victor(this.body.x, this.body.y)).horizontalAngle();
	}

	get springConnectionPoint(): Victor {
		return new Victor(
			this.body.x + this.bodyHeight / 2 * Math.cos(this.angle),
			this.body.y + this.bodyHeight / 2 * Math.sin(this.angle)
		);
	}

	get currentSpringMaxLength(): number {
		return Math.max(10, this.springMaxLength - this.userSpringForce);
	}

	get springVector(): Victor {
		return new Victor(this.foot.x, this.foot.y).subtract(this.springConnectionPoint);
	}

	get springLength(): number {
		return this.springVector.length();
	}

	constructor(private canvas: Canvas, private actions: IActions) {
		this.body = new Rect(canvas, this.x, this.y, this.bodyWidth, this.bodyHeight, 0, '#3b80ef');
		let startAngle = Math.PI / 2 + Math.PI / 90;
		this.foot = new Circle(
			canvas,
			this.x + (this.bodyHeight / 2 + this.springMaxLength) * Math.cos(startAngle),
			this.y + (this.bodyHeight / 2 + this.springMaxLength) * Math.sin(startAngle),
			6, '#5ee4ff');
	}

	public draw() {
		this.parts.forEach(rect => rect.draw());
		this.drawSpring();
	}

	public squeezeSpring(dt: number) {
		this.userSpringForce += this.userSpringForceChange * dt;
	}

	public releaseSpring() {
		this.userSpringForce = 0;
		this.placeFoot(this.angle);
	}

	private drawSpring() {
		let springWidth = 16;
		let segmentAmount = 3;
		let segmentHeight = this.springLength / segmentAmount;

		const calcPoint = (x: number, y: number): number[] => {
			let angle = this.angle - Math.PI / 2;
			return [
				this.springConnectionPoint.x + x * Math.cos(angle) - y * Math.sin(angle),
				this.springConnectionPoint.y + y * Math.cos(angle) + x * Math.sin(angle)
			];
		}
		const drawLine = (x: number, y: number): void => {
			this.canvas.context.lineTo.apply(this.canvas.context, calcPoint(x, y));
		}

		this.canvas.context.strokeStyle = '#000';
		this.canvas.context.beginPath();
		this.canvas.context.moveTo(this.springConnectionPoint.x, this.springConnectionPoint.y);
		for (let i = 0; i < segmentAmount; i++) {
			drawLine(springWidth / 2, segmentHeight / 4 + segmentHeight * i);
			drawLine(-springWidth, segmentHeight * 3 / 4 + segmentHeight * i);
			drawLine(0, segmentHeight + segmentHeight * i);
		}
		this.canvas.context.stroke();
	}

	public rotate(da: number) {
		// this.angle += da;
		// this.parts.forEach(rect => rect.angle = this.angle - Math.PI / 2);
		// this.placeFoot();
	}

	public move(dt: number) {
		// let springLength = this.springLength;
		// let angle = this.angle;
		// this.body.move(this.dx * dt, this.dy * dt);
		// if (Math.abs(springLength - this.currentSpringMaxLength) < 0.001 ||
		// 	(springLength - this.currentSpringMaxLength > 0.001) ||
		// 	(this.springLength - this.currentSpringMaxLength > 0.001)) {
		// 	this.placeFoot(angle + (this.da + this.userDa * this.userRotationSpeed) * dt);
		// 	this.footIsStanding = false;
		// }

		this.dy += G * dt;

		if (this.footIsStanding || this.actions.checkCollision(this.foot.x, this.foot.y)) {
			if (!this.footIsStanding) {
				let [noColX, noColY] = this.foot.findPosition((x, y) => !this.actions.checkCollision(x, y));
				this.foot.place(noColX, noColY);
			}
			this.footIsStanding = true;
			let springForce = this.springVector.norm().multiplyScalar(this.springRigidity * (this.springLength - this.springMaxLength));
			this.dx += springForce.x * dt;
			this.dy += springForce.y * dt;
			this.dy -= G * dt;
			this.da = (this.angle - this.lastAngle) / dt;
		}
		this.lastAngle = this.angle;
		this.body.angle = this.angle - Math.PI / 2;

		let springLength = this.springLength;
		let angle = this.angle;
		this.body.move(this.dx * dt, this.dy * dt);
		if (Math.abs(springLength - this.currentSpringMaxLength) < 0.001 ||
			(springLength - this.currentSpringMaxLength > 0.001) ||
			(this.springLength - this.currentSpringMaxLength > 0.001)) {
			this.placeFoot(angle + (this.da + this.userDa * this.userRotationSpeed) * dt);
			this.footIsStanding = false;
		}
	}

	private placeFoot(angle: number) {
		this.foot.place(
			this.body.x + (this.bodyHeight / 2 + this.currentSpringMaxLength) * Math.cos(angle),
			this.body.y + (this.bodyHeight / 2 + this.currentSpringMaxLength) * Math.sin(angle)
		);
	}
}

function vectorProjection(v1: Victor, v2: Victor): Victor {
	let a1 = v1.horizontalAngle();
	let a2 = v2.horizontalAngle();
	let angle = a2 - a1;
	let resLength = v1.length() * Math.cos(angle);
	return v2.normalize().multiplyScalar(resLength);
}