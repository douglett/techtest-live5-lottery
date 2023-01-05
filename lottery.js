// consts
const LOTTERY_MAX = 59;
// const LOTTERY_MAX = 19;
const LOTTERY_PICK_COUNT = 6;


// main game
const Lottery = {
	selected: [],
	results: [],

	cash: 0,
	games: 0,
	wins: 0,

	init() {
		const ticket = document.querySelector('#lotteryTicket');
		for (let i = 1; i <= LOTTERY_MAX; i++) {
			const box = document.createElement('div');
			box.className = 'lotteryBox';
			box.innerHTML = i;
			box.setAttribute('value', i);
			box.onmousedown = (e) => e.preventDefault();
			box.onclick = () => this.clickBox(i);
			ticket.appendChild(box);
		}
		// init UI
		this.updateUI();
		document.querySelector('#button-lucky').onclick = () => this.luckyDip();
		document.querySelector('#button-start').onclick = () => this.startGame();
		document.querySelector('#button-reset').onclick = () => this.reset();
	},

	reset() {
		// clear selected ticket boxes
		this.selected.splice(0, this.selected.length);
		this.results.splice(0, this.results.length);
		// set ui state
		this.updateUI();
	},

	updateUI() {
		// update user stats
		document.querySelector('#stat-cash').innerHTML = this.cash;
		document.querySelector('#stat-games').innerHTML = this.games;
		document.querySelector('#stat-wins').innerHTML = this.wins;
		// reflect state of selected numbers in the lottery ticker
		document.querySelectorAll('#lotteryTicket .lotteryBox').forEach(box => {
			box.classList.remove('highlight');
			const num = parseInt(box.getAttribute('value'), 10);
			if (this.selected.indexOf(num) > -1) box.classList.add('highlight');
		});
		// allow spins if 6 numbers selected
		document.querySelector('#button-start').disabled = this.selected.length < LOTTERY_PICK_COUNT;
	},

	clickBox(i) {
		// console.log(i);
		// handle selected boxes
		let numpos;
		if ((numpos = this.selected.indexOf(i)) > -1)
			this.selected.splice(numpos, 1);
		else if (this.selected.length >= LOTTERY_PICK_COUNT) 
			return;
		else 
			this.selected.push(i), this.selected.sort((a, b) => a - b);
		// set ui state
		this.updateUI();
	},

	luckyDip() {
		// clear any selections already made
		this.reset();
		// select 6 unique numbers at random
		while (this.selected.length < LOTTERY_PICK_COUNT) {
			const num = (Math.random() * LOTTERY_MAX + 1) | 0;
			if (this.selected.indexOf(num) === -1) this.selected.push(num);
		}
		this.selected.sort((a, b) => a - b);
		console.log('lucky-dip', this.selected);
		// reflect in UI
		this.updateUI();
	},

	getWinAmount(matchCount) {
		switch (matchCount) {
		case 3:   return 50;
		case 4:   return 100;
		case 5:   return 200;
		case 6:   return 500;
		default:  return 0;
		}
	},

	startGame() {
		// clear last game
		this.results.splice(0, this.results.length);
		// select 6 unique numbers at random
		while (this.results.length < LOTTERY_PICK_COUNT) {
			const num = (Math.random() * LOTTERY_MAX + 1) | 0;
			if (this.results.indexOf(num) === -1) this.results.push(num);
		}
		this.results.sort((a, b) => a - b);
		console.log('results', this.results);
		// check for matches
		let matches = this.results.filter(i => this.selected.indexOf(i) > -1);
		console.log('matches', matches);
		console.log(`You matched ${matches.length} numbers.`);
		// animate results
		Animation.setResults(this.results, matches);
		// update stats
		this.games++;
		if (this.getWinAmount(matches.length) > 0) this.wins++;
		this.cash += this.getWinAmount(matches.length);
		this.updateUI();
	}

};