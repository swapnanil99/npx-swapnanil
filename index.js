#!/usr/bin/env node

const chalk = require('chalk');         // Chalk v4
const boxen = require('boxen').default; // Boxen v6 — add .default
const inquirer = require('inquirer');
const open = require('open');
const readline = require('readline');

// ----- About Card -----
const card = `
                  ${chalk.bold('Swapnanil Maity')}

Computer Science & Engineering Student at NSEC

${chalk.blue('GitHub:')} https://github.com/swapnanil99
${chalk.blue('Email:')} swapnanilmaity99@gmail.com
${chalk.blue('Portfolio:')} https://swapnanil99.github.io/

I'm always excited to connect!
Feel free to reach out if you
have a question or just want to chat.
`;

console.log(boxen(card, { padding: 1, borderStyle: 'round', borderColor: 'cyan' }));

// ----- Main Menu -----
async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        'Send me an email',
        'Open GitHub',
        'Open Portfolio',
        'Play Game',
        'Just quit'
      ]
    }
  ]);

  switch(action) {
    case 'Send me an email':
      open('mailto:swapnanilmaity99@gmail.com');
      break;
    case 'Open GitHub':
      open('https://github.com/swapnanil99');
      break;
    case 'Open Portfolio':
      open('https://swapnanil99.github.io/');
      break;
    case 'Play Game':
      return gameMenu();
    case 'Just quit':
      console.log(chalk.yellow('Bye! 👋'));
      process.exit();
  }

  mainMenu();
}

// ----- Game Menu -----
async function gameMenu() {
  const { game } = await inquirer.prompt([
    {
      type: 'list',
      name: 'game',
      message: 'Choose a game to play:',
      choices: [
        'Tic-Tac-Toe',
        'Snake',
        'Rock, Paper, Scissors',
        'Number Guessing',
        'Quiz / Trivia',
        'Hangman',
        'Dice / Coin Flip',
        'Back'
      ]
    }
  ]);

  switch(game) {
    case 'Tic-Tac-Toe':
      return playTicTacToe();
    case 'Snake':
      return playSnake();
    case 'Rock, Paper, Scissors':
      return playRPS();
    case 'Number Guessing':
      return numberGuess();
    case 'Quiz / Trivia':
      return quizGame();
    case 'Hangman':
      return hangmanGame();
    case 'Dice / Coin Flip':
      return diceCoinGame();
    case 'Back':
      return mainMenu();
  }
}

// ----- Tic-Tac-Toe -----
let tttBoard;
function playTicTacToe() {
  tttBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

  const printBoard = () => {
    console.clear();
    console.log(`
 ${tttBoard[0]} | ${tttBoard[1]} | ${tttBoard[2]}
---+---+---
 ${tttBoard[3]} | ${tttBoard[4]} | ${tttBoard[5]}
---+---+---
 ${tttBoard[6]} | ${tttBoard[7]} | ${tttBoard[8]}
`);
  };

  const checkWinner = (b, player) => {
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winCombos.some(combo => combo.every(i => b[i] === player));
  };

  const makeMove = async (player) => {
    printBoard();
    const empty = tttBoard.map((v,i) => v === ' ' ? i+1 : null).filter(v => v);
    if(empty.length === 0) { console.log(chalk.yellow("It's a draw!")); return gameMenu(); }

    const { move } = await inquirer.prompt([
      { type: 'list', name: 'move', message: `${player}, choose position:`, choices: empty }
    ]);

    tttBoard[move-1] = player;

    if(checkWinner(tttBoard, player)) {
      printBoard();
      console.log(chalk.green(`${player} wins! 🎉`));
      return gameMenu();
    }

    const nextPlayer = player === 'X' ? 'O' : 'X';
    makeMove(nextPlayer);
  };

  console.log(chalk.blue("Welcome to Tic-Tac-Toe! X starts."));
  makeMove('X');
}

// ----- Snake -----
function playSnake() {
  console.clear();
  const width = 20;
  const height = 10;
  let snake = [[5,5]];
  let dir = 'RIGHT';
  let food = [2,2];

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if(key.name==='up') dir='UP';
    if(key.name==='down') dir='DOWN';
    if(key.name==='left') dir='LEFT';
    if(key.name==='right') dir='RIGHT';
    if(key.ctrl && key.name==='c') process.exit();
  });

  const draw = () => {
    console.clear();
    for(let y=0;y<height;y++){
      let row='';
      for(let x=0;x<width;x++){
        if(snake.some(s => s[0]===x && s[1]===y)) row+='O';
        else if(food[0]===x && food[1]===y) row+='X';
        else row+='.';
      }
      console.log(row);
    }
  };

  const move = () => {
    let head = [...snake[0]];
    if(dir==='UP') head[1]-=1;
    if(dir==='DOWN') head[1]+=1;
    if(dir==='LEFT') head[0]-=1;
    if(dir==='RIGHT') head[0]+=1;

    if(head[0]<0||head[1]<0||head[0]>=width||head[1]>=height || snake.some(s=>s[0]===head[0] && s[1]===head[1])){
      console.log(chalk.red("Game Over!"));
      process.stdin.setRawMode(false);
      return gameMenu();
    }

    snake.unshift(head);
    if(head[0]===food[0] && head[1]===food[1]){
      food = [Math.floor(Math.random()*width), Math.floor(Math.random()*height)];
    } else {
      snake.pop();
    }

    draw();
  };

  draw();
  setInterval(move, 300);
}

// ----- Rock Paper Scissors -----
async function playRPS() {
  const choices = ['Rock','Paper','Scissors'];
  const { player } = await inquirer.prompt([{ type:'list', name:'player', message:'Choose your move:', choices }]);
  const computer = choices[Math.floor(Math.random()*3)];
  console.log(`Computer chose: ${computer}`);
  if(player === computer) console.log(chalk.yellow("It's a draw!"));
  else if((player==='Rock'&&computer==='Scissors')||(player==='Paper'&&computer==='Rock')||(player==='Scissors'&&computer==='Paper'))
    console.log(chalk.green("You win! 🎉"));
  else console.log(chalk.red("You lose! 😢"));
  gameMenu();
}

// ----- Number Guessing -----
async function numberGuess() {
  const target = Math.floor(Math.random()*100)+1;
  let guessed = false;
  while(!guessed) {
    const { num } = await inquirer.prompt([{ type:'number', name:'num', message:'Guess a number 1-100:' }]);
    if(num === target){ console.log(chalk.green('Correct! 🎉')); guessed=true; }
    else if(num < target) console.log(chalk.yellow('Higher!'));
    else console.log(chalk.yellow('Lower!'));
  }
  gameMenu();
}

// ----- Quiz / Trivia -----
async function quizGame() {
  const questions = [
    { q:"What does HTML stand for?", a:"Hyper Text Markup Language" },
    { q:"What does CSS stand for?", a:"Cascading Style Sheets" },
    { q:"What does JS stand for?", a:"JavaScript" }
  ];
  for(const item of questions){
    const { ans } = await inquirer.prompt([{ type:'input', name:'ans', message:item.q }]);
    if(ans.toLowerCase() === item.a.toLowerCase()) console.log(chalk.green('Correct!'));
    else console.log(chalk.red(`Wrong! Answer: ${item.a}`));
  }
  gameMenu();
}

// ----- Hangman -----
async function hangmanGame() {
  const words = ["node","javascript","swapnanil","github"];
  const word = words[Math.floor(Math.random()*words.length)];
  let display = Array(word.length).fill('_');
  let attempts = 6;

  while(attempts>0 && display.includes('_')){
    console.log(display.join(' '));
    const { letter } = await inquirer.prompt([{ type:'input', name:'letter', message:'Guess a letter:' }]);
    if(letter.length!==1) { console.log(chalk.red('Enter one letter at a time!')); continue; }
    let correct = false;
    for(let i=0;i<word.length;i++){
      if(word[i]===letter) { display[i]=letter; correct=true; }
    }
    if(!correct){ attempts--; console.log(chalk.red(`Wrong! Attempts left: ${attempts}`)); }
  }

  if(!display.includes('_')) console.log(chalk.green(`You guessed it! ${word}`));
  else console.log(chalk.red(`Out of attempts! Word was: ${word}`));
  gameMenu();
}

// ----- Dice / Coin Flip -----
async function diceCoinGame() {
  const { choice } = await inquirer.prompt([
    { type:'list', name:'choice', message:'Dice or Coin?', choices:['Dice','Coin'] }
  ]);

  if(choice==='Dice'){
    const roll = Math.floor(Math.random()*6)+1;
    console.log(chalk.blue(`You rolled a ${roll}! 🎲`));
  } else {
    const flip = Math.random()<0.5 ? 'Heads':'Tails';
    console.log(chalk.blue(`It's ${flip}! 🪙`));
  }

  gameMenu();
}

// ----- Start App -----
mainMenu();
