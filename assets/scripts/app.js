const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const MODE_HEAL = "HEAL";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Maximum life for you and the monster.", "100");

let chosenMaxLife = parseInt(enteredValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let logEntries = [];
let monsterHealth = chosenMaxLife;
let playerHealth = chosenMaxLife;
let hasBonusLife = true;
adjustHealthBars(chosenMaxLife);

logBtn.addEventListener("click", logHandler);
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);

function writeToLog(event, value, finalPlayerHealth, finalMonsterHealth) {
  let entry = {
    event: event,
    value: value,
    playerHealth: finalPlayerHealth,
    monsterHealth: finalMonsterHealth,
  };

  if (event === LOG_EVENT_PLAYER_ATTACK) {
    entry.target = "MONSTER";
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    entry.target = "MONSTER";
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    entry.target = "PLAYER";
  }
  logEntries.push(entry);
}
function logHandler() {
  console.log(logEntries);
}
function healHandler() {
  let healValue = 0;
  if (playerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal more than your max initial health.");
    healValue = chosenMaxLife - playerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  playerHealth += healValue;
  writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, playerHealth, monsterHealth);
  attack(MODE_HEAL);
}

function strongAttackHandler() {
  attack(MODE_STRONG_ATTACK);
}

function attackHandler() {
  attack(MODE_ATTACK);
}
function reset() {
  monsterHealth = chosenMaxLife;
  playerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function attack(mode) {
  if (mode === MODE_HEAL) {
    const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    playerHealth -= monsterDamage;
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      monsterDamage,
      playerHealth,
      monsterHealth
    );
    return;
  }
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  const playerDamage = dealMonsterDamage(maxDamage);
  monsterHealth -= playerDamage;
  writeToLog(logEvent, playerDamage, playerHealth, monsterHealth);
  const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  playerHealth -= monsterDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    monsterDamage,
    playerHealth,
    monsterHealth
  );

  if (playerHealth <= 0 && hasBonusLife) {
    setPlayerHealth(playerHealth + monsterDamage);
    playerHealth = playerHealth + monsterDamage;
    hasBonusLife = false;
    removeBonusLife();
    return;
  }
  if (monsterHealth <= 0 && playerHealth > 0) {
    alert("You won!");
    writeToLog(LOG_EVENT_GAME_OVER, "Player Won", playerHealth, monsterHealth);
    reset();
  } else if (playerHealth <= 0 && monsterHealth > 0) {
    writeToLog(LOG_EVENT_GAME_OVER, "Monster Won", playerHealth, monsterHealth);
    alert("You lost!");
    reset();
  } else if (playerHealth <= 0 && monsterHealth <= 0) {
    alert("You have a draw!");
    writeToLog(LOG_EVENT_GAME_OVER, "It's a Draw", playerHealth, monsterHealth);
    reset();
  }
}
