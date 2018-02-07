// delay execution by .5 seconds so that a refresh (cmd + r or ctrl + r)
// does not trigger the RPS game
window.setTimeout(function(){
	(function(){
		// this object is available if we need a quick reset of the scores
		// or to initialize the default objects
		let defaultScores = {
			computer: 0,
			player: 0
		};
		// if localstorage.scores is set, parse out the JSON data and use it
		// otherwise we'll start with our default
		let scores = localStorage.scores ? JSON.parse(localStorage.scores) : defaultScores;
		// an object containing the elements we'll be targeting for easy use later
		let elements = {
			computerScore: document.querySelector(".score-computer .s"),
			playerScore: document.querySelector(".score-player .s"),

			computerChoice: document.querySelector(".score-computer .last-choice"),
			playerChoice: document.querySelector(".score-player .last-choice")
		};
		// the options (r, p, s) as an object with a key showing what they beat
		// this lets us avoid a bunch of if/if else later by just checking
		// if they beat the key
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
		// writes out the data to the DOM
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
		// our main function that will handle the logic of the computer vs
		// human scoring
		let keypress = event => {
			// make sure the pressed key is either r, p or s before continuing
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
				// get the winner, increase their score, and then add the 
				// appropriate class to the CSS element to show them a win or loss
				// if a tie happens, nothing gets changed
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
		// bind our keypress function to the onkeyup event
		// this will run each time a key is pressed
		document.onkeyup = keypress;
		// This is a trick to iterate over a nodelist as if it were an array
		// the [].forEach.call() is the trick here, the first argument is the nodelist,
		// and the second is the function that we want to run for each element
		// where elem is the element we're currently acting upon
		[].forEach.call(document.querySelectorAll(".keys button"), elem => {
			// add an event listener for click to the individual key buttons
			elem.addEventListener("click", event => {
				// get the key from the element's dataset (data-key)
				let key = event.target.dataset.key;
				// create a mock event object that we can pass to our keypress function
				// to emulate pulling it from event.key
				let mockEvent = {
					key : key
				};
				// call the keypress function manually
				keypress(mockEvent);
			});
		});
		// when the .reset button is clicked, we want to reset the localstorage and
		// scores objects so that they're 0
		document.querySelector(".actions .reset").addEventListener("click", () => {
			localStorage.scores = JSON.stringify(defaultScores);
			scores = defaultScores;
			writeData( scores.player, scores.computer );
		});
		// if the localstorage exists, go ahead and write data to the screen
		if( localStorage.scores ) 
			writeData( scores.player, scores.computer );
	}())
}, 500);

