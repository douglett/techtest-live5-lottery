// consts
const LOTTERY_MAX = 59;  // real value
// const LOTTERY_MAX = 14;  // cheat value (for testing)
const LOTTERY_PICK_COUNT = 6;


// main game
const Lottery = {
	selected: [],
	results: null,
	loading: false,

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
		this.selected = [];
		this.results = null;
		// clear visual animation
		Animation.reset();
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
		document.querySelector('#button-start').disabled = this.loading || this.selected.length < LOTTERY_PICK_COUNT;
		// disable if loading
		document.querySelector('#button-lucky').disabled = this.loading;
		document.querySelector('#button-reset').disabled = this.loading;
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

	startGame() {
		// clear last game
		this.results = null;
		// get results - do a fake API call of sorts
		Promise.resolve()
			// begin
			.then(() => {
				this.loading = true;
				this.updateUI();
			})
			// API call 
			.then(() => this.getResults(this.selected))
			// save results
			.then(results => {
				this.results = results;
				console.log('results', results);
			})
			// show results animation
			.then(() => Animation.setResults(this.results.results, this.results.winAmount))
			// end
			.then(() => {
				// update stats
				this.games++;
				if (this.results.winAmount > 0) this.wins++;
				this.cash += this.results.winAmount;
				// enable UI
				this.loading = false;
				this.updateUI();
			});
	},

	getResults(picks) {
		picks = picks.map(p => p);  // clone array
		const results = [];
		// select 6 unique numbers at random
		while (results.length < LOTTERY_PICK_COUNT) {
			const num = (Math.random() * LOTTERY_MAX + 1) | 0;
			if (!results.find(res => res.value === num))
				results.push({ value: num, win: false });
		}
		results.sort((a, b) => a.value - b.value);
		// check for matches
		// results.forEach(result => result.win = picks.indexOf(result.value) > -1);
		let matchCount = 0;
		results.forEach(result => {
			if (picks.indexOf(result.value) > -1)
				result.win = true, matchCount++;
		});
		const winAmount = this.getWinAmount(matchCount);
		// return fake API result
		return { picks, results, matchCount, winAmount };
	},

	getWinAmount(matchCount) {
		switch (matchCount) {
		case 3:   return 50;
		case 4:   return 100;
		case 5:   return 200;
		case 6:   return 500;
		default:  return 0;
		}
	}
};