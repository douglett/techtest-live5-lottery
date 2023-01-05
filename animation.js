// consts
const BALLW = 100;


const Animation = {
	screen: null,
	gradient: null,
	wintext: null,
	balls: [],

	init() {
		// create screen
		this.screen = document.querySelector('#screen');
		// create screen background gradient
		let ctx = this.screen.getContext('2d');
		this.gradient = ctx.createLinearGradient(0, 0, 0, this.screen.height);
		this.gradient.addColorStop(0, "white");
		this.gradient.addColorStop(1, "slategray");
		// create win text
		this.wintext = document.createElement('canvas');
		this.wintext.width = 120;
		this.wintext.height = 40;
		ctx = this.wintext.getContext('2d');
		ctx.fillStyle = 'red';
		ctx.strokeStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = `italic bold 35px serif`;
		ctx.fillText('Match!', this.wintext.width/2, this.wintext.height/2);
		ctx.strokeText('Match!', this.wintext.width/2, this.wintext.height/2);
		// create lottery balls
		for (let i = 0; i < LOTTERY_PICK_COUNT; i++) {
			let c = document.createElement('canvas');
			c.width = c.height = BALLW;
			this.balls.push({
				canvas: c,
				x: i * (BALLW + 10),
				y: 0,
				win: false
			});
			this.drawBall(i, i); // initial value
		}
		// first paint
		this.draw();
	},

	draw() {
		const ctx = this.screen.getContext('2d');
		// cls
		ctx.fillStyle = this.gradient;
		ctx.fillRect(0, 0, this.screen.width, this.screen.height);
		// draw balls
		ctx.translate(24, 10);  // align screen
		this.balls.forEach(ball => {
			ctx.drawImage(ball.canvas, ball.x, ball.y);
			if (ball.win) ctx.drawImage(this.wintext, (ball.x + (ball.canvas.width - this.wintext.width) / 2), 100);
		});
		ctx.resetTransform();  // reset align
	},

	setResults(results) {
		const ctx = this.screen.getContext('2d');
		results.forEach((res, index) => {
			this.drawBall(index, res.value);
			this.balls[index].win = res.win;
		});
		this.draw();
		// return new Promise(resolve => setTimeout(resolve, 1000));
	},

	drawBall(index, value) {
		const ctx = this.balls[index].canvas.getContext('2d');
		ctx.clearRect(0, 0, BALLW, BALLW);
		// outer ball
		let color;
		if      (value < 10) color = 'blue';
		else if (value < 20) color = 'green';
		else if (value < 30) color = 'red';
		else if (value < 40) color = 'gold';
		else if (value < 50) color = 'purple';
		else    color = 'turquoise';
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(BALLW/2, BALLW/2, BALLW/2, 0, Math.PI * 2);
		ctx.fill();
		// inner spot
		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(BALLW/2, BALLW/2, BALLW/3.5, 0, Math.PI * 2);
		ctx.fill();
		// text
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = `bold ${(BALLW / 3) | 0}px serif`;
		ctx.font = `bold 40px serif`;
		ctx.fillText(value, BALLW/2, BALLW/2);
	}
};