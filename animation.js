// consts
const BALLW = 100;


const Animation = {
	screen: null,
	gradient: null,
	balls: [],

	init() {
		// create screen
		this.screen = document.querySelector('#screen');
		// create screen background gradient
		const ctx = this.screen.getContext('2d');
		this.gradient = ctx.createLinearGradient(0, 0, 0, this.screen.height);
		this.gradient.addColorStop(0, "white");
		this.gradient.addColorStop(1, "slategray");
		// create lottery balls
		for (let i = 0; i < LOTTERY_PICK_COUNT; i++) {
			let c = document.createElement('canvas');
			c.width = c.height = BALLW;
			this.balls.push(c);
		}
		// first paint
		this.draw();
	},

	draw() {
		const ctx = this.screen.getContext('2d');
		// ctx.fillRect(0, 0, 120, 120);

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, this.screen.width, this.screen.height);

		// outer ball
		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.arc(BALLW / 2, BALLW / 2, BALLW / 2, 0, Math.PI * 2);
		ctx.fill();
		// inner spot
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(BALLW / 2, BALLW / 2, BALLW / 3.5, 0, Math.PI * 2);
		ctx.fill();
		// text
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = `bold ${(BALLW / 3) | 0}px serif`;
		ctx.fillText('12', BALLW / 2, BALLW / 2);
	},

	drawBall() {
		
	}
};