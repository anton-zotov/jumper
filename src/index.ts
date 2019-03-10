import '../main.css';

import Canvas from './canvas';
import Jumper from './jumper';
import Ground from './ground';

const canvas = new Canvas();
const ground = new Ground(canvas);
const player = new Jumper(canvas, {
	checkCollision: ground.isCollision.bind(ground)
});

let prevTimestamp = 0;
let keyPressed = {};
let keyReleased = {};

function drawAll(timestamp: number) {
	let manual = false;
	let dt = getDt(timestamp);
	if (manual) dt = 0.1;
	canvas.clear();
	player.userDa = 0;
	if (keyPressed['ArrowRight']) player.userDa = 1;
	if (keyPressed['ArrowLeft']) player.userDa = -1;
	if (keyPressed['ArrowDown']) player.squeezeSpring(dt);
	if (keyReleased['ArrowDown']) player.releaseSpring();
	keyReleased = {};
	player.move(dt);
	ground.draw();
	player.draw();
	drawFPS(timestamp);
	if (!manual) setTimeout(() => window.requestAnimationFrame(drawAll), 1000 / 60);
}

function drawFPS(timestamp: number) {
	let fps = Math.round(1 / (getDt(timestamp)));
	canvas.drawFPS(fps);
	prevTimestamp = timestamp;
}

const getDt = (t: number) => (t - prevTimestamp) / 1000;

window.requestAnimationFrame(drawAll);

document.addEventListener('keydown', (e) => {
	if (e.code == 'Space') window.requestAnimationFrame(drawAll);
	keyPressed[e.code] = true;
});

document.addEventListener('keyup', (e) => {
	keyPressed[e.code] = false;
	keyReleased[e.code] = true;
});