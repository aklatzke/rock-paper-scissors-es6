// delay execution by .5 seconds so that a refresh (cmd + r or ctrl + r)
// does not trigger the RPS game
window.setTimeout(function(){
	(function(){

		let defaultScores = {
			computer: 0,
			player: 0
		};

		let scores = localStorage.scores ? JSON.parse(localStorage.scores) : defaultScores;

		let elements = {
			computerScore: document.querySelector(".score-computer .s"),
			playerScore: document.querySelector(".score-player .s"),

			computerChoice: document.querySelector(".score-computer .last-choice"),
			playerChoice: document.querySelector(".score-player .last-choice")
		};

		let rpsOptions = {
			"r" : {
				beats: "s"
			},
			"p" : {
				beats: "r"
			},
			"s" : {
				beats: "p"
			}
		}

		let writeData = ( playerScore, computerScore, computerChoice, playerChoice ) => {
			// post the scores
			elements.playerScore.innerHTML = playerScore;
			elements.computerScore.innerHTML = computerScore;
			// add the most recent choices to the elements if provided
			if( computerChoice && playerChoice ){
				elements.computerChoice.innerHTML = computerChoice;
				elements.playerChoice.innerHTML = playerChoice;				
			}
		}

		let keypress = event => {
			if( ["r", "p", "s"].indexOf(event.key) !== -1 ){
				// remove the keyup event while we're doing our calculations!
				document.onkeyup = () => {};
				// create a variable for the player choice (event.key)
				let playerChoice = event.key;
				let rps = Object.keys(rpsOptions);
				// get the random computer choice from our available options
				let computerChoice = rps[Math.floor(Math.random() * rps.length)];
				// remove all extraneous classes
				elements.computerScore.className = "s";
				elements.playerScore.className = "s";
				// get the winner!
				if( rpsOptions[computerChoice].beats === playerChoice ){
					scores.computer++;
					elements.computerScore.classList.add("win");
					elements.playerScore.classList.add("loss");
				}
				else if( rpsOptions[playerChoice].beats === computerChoice ){
					scores.player++
					elements.computerScore.classList.add("loss");
					elements.playerScore.classList.add("win");
				}
				// write the data to the DOM
				writeData( scores.player, scores.computer, computerChoice, playerChoice );
				// add the scores to localStorage
				localStorage.scores = JSON.stringify(scores);
				//rebind the keyup event after we've completed!
				document.onkeyup = keypress;
			}
		}

		document.onkeyup = keypress;

		[].forEach.call(document.querySelectorAll(".keys button"), elem => {
			elem.addEventListener("click", event => {
				let key = event.target.dataset.key;
				let mockEvent = {
					key : key
				};

				keypress(mockEvent);
			});
		});

		document.querySelector(".actions .reset").addEventListener("click", () => {
			localStorage.scores = JSON.stringify(defaultScores);
			scores = defaultScores;
			writeData( scores.player, scores.computer );
		});

		if( localStorage.scores ) 
			writeData( scores.player, scores.computer );
	}())
}, 500);

