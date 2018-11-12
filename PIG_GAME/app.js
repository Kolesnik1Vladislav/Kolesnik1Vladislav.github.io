/*
GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

var scores, roundScore, activePlayer,gamePlay;

init();

document.getElementById('score-0').textContent = '0';
document.getElementById('score-1').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('current-1').textContent = '0';

document.querySelector('.btn-roll').addEventListener('click', function () {
   if (gamePlay === true) {
       // Random number
       var dice = Math.round(Math.random() * 5 + 1);

       // Display result
       var diceDom = document.querySelector('.dice');
       diceDom.style.display = 'block';
       diceDom.src = 'dice-' + dice + '.png';

       // Controlling players
       if (dice > 1) {
           // Add score
           roundScore = roundScore + dice;
           document.querySelector('#current-' + activePlayer).textContent = roundScore;
       } else {
           nextPlayer();
       }
   }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
  if (gamePlay === true) {
      // Add current score into global score
      scores[activePlayer] = scores[activePlayer] + roundScore;
      // Updating UI
      document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
      // Player's won
      if (scores[activePlayer] >= 100) {
          document.getElementById('name-' + activePlayer).textContent = 'Winner!';
          gamePlay = false;
          document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
          // document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
      }
      // Next player
      nextPlayer();
  }
});


function nextPlayer () {
    if (activePlayer === 0) {
        activePlayer = 1;
        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-1-panel').classList.add('active');

    }  else {
        activePlayer = 0;
        document.querySelector('.player-1-panel').classList.remove('active');
        document.querySelector('.player-0-panel').classList.add('active');
    }
    roundScore = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
}

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    activePlayer = 0;
    scores = [0,0];
    roundScore = 0;
    gamePlay = true;
    document.querySelector('#score-0').textContent = '0';
    document.querySelector('#score-1').textContent = '0';
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
}






















