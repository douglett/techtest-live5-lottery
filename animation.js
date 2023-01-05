// consts
// import LOTTERY_MAX;
// import LOTTERY_PICK_COUNT;
const BALLW = 100;
const FALL_SPEED = 24;
const SHOW_WIN_ANIMATION = false;


// animation namespace
const Animation = {
	screen: null,
	gradient: null,
	wintext: null,
	balls: [],
	winAmount: 0,

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
		}
		// set up initial ball values and do first paint
		this.reset();
	},

	reset() {
		// reset animation vars
		this.winAmount = 0;
		// reset balls
		this.balls.forEach((ball, index) => {
			ball.win = false;
			ball.y = 0;
			this.drawBall(index, 0);  // clear balls from screen
		});
		// repaint
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
		// show win value
		if (SHOW_WIN_ANIMATION && this.winAmount > 0) {
			ctx.fillStyle = 'gold';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 3;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			const txt = `You win ${this.winAmount}$!`
			// big text
			ctx.font = `italic bold 80px serif`;
			ctx.fillText(txt, this.screen.width/2, this.screen.height/2);
			ctx.strokeText(txt, this.screen.width/2, this.screen.height/2);
			// top text
			// ctx.font = `italic bold 50px serif`;
			// ctx.fillText(txt, this.screen.width/2, 30);
			// ctx.strokeText(txt, this.screen.width/2, 30);
		}
	},

	drawBall(index, value) {
		const ctx = this.balls[index].canvas.getContext('2d');
		ctx.clearRect(0, 0, BALLW, BALLW);
		// don't draw anything if the ball value is 0 (initial and reset state)
		if (value === 0) return;
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
		// ctx.font = `bold ${(BALLW / 3) | 0}px serif`;
		ctx.font = `bold 40px serif`;
		ctx.fillText(value, BALLW/2, BALLW/2);
	},

	setResults(results, winAmount) {
		const ctx = this.screen.getContext('2d');
		results.forEach((res, index) => {
			this.drawBall(index, res.value);
			this.balls[index].win = res.win;
		});
		// this.draw();
		return this.animateBalls(winAmount);
	},

	animateBalls(winAmount) {
		// hide all balls and win amount
		this.balls.forEach(ball => ball.y = -130);
		this.winAmount = 0;
		// animate
		return new Promise(resolve => {
			const anim = () => {
				// drop each ball in turn
				let animating = this.balls.some(ball => {
					if (ball.y >= 0) { 
						ball.y = 0; 
						return false;  // don't stop the loop - animate next ball
					}
					else { 
						ball.y += FALL_SPEED; 
						return true;  // break animation loop
					}
				});
				this.draw();
				// if still animating, continue
				if (animating) requestAnimationFrame(anim);
				// do a little pause and end animation
				else setTimeout(() => {
						this.winAmount = winAmount;
						this.draw();
						resolve();
					});
			}
			anim();
		});
	},
};