const newDeck = document.querySelector('#new-deck-btn')
const draw = document.querySelector('#draw-btn')
const cardsContainer = document.querySelector('.cards-container')
const playerCardDiv = document.querySelector('#player-card')
const compCardDiv = document.querySelector('#comp-card')
const playerScoreSpan = document.querySelector('#player-score')
const compScoreSpan = document.querySelector('#comp-score')
const turnMessage = document.querySelector('.turn-message')
const remainingCards = document.querySelector('#remaining-cards')
const titleMsg = document.querySelector('#title-msg')
let deckInfo = {
    id: null,
    remaining: 52
};
let playerCard = {}
let compCard = {}
const scoreStandard = {
    JACK: 11,
    QUEEN: 12,
    KING: 13,
    ACE: 14
}
let scoreBoard = {
    player: 0,
    comp: 0,
    turnResult: null,
    matchResult: null
}

const deckCheck = () => {
    if(!deckInfo.id || deckInfo.remaining < 2) {
        draw.style.display = 'none'
        matchCheck()
    }
}

const matchCheck = () => {
    if(scoreBoard.player > scoreBoard.comp) titleMsg.innerHTML = 'You Win!'
    if(scoreBoard.player < scoreBoard.comp) titleMsg.innerHTML = 'The Computer Wins!'
    if(scoreBoard.player == scoreBoard.comp) titleMsg.innerHTML = "It's a Draw!"
}

deckCheck()

const getDeck = () => {
    fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/')
        .then(response => response.json())
        .then(data => {
            deckInfo.id = data.deck_id
            draw.style.display = 'block'
            remainingCards.innerHTML = deckInfo.remaining
        })
}
    
    
const getCards = () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckInfo.id}/draw/?count=2`)
        .then(response => response.json())
        .then(data => {
            Object.assign(playerCard, data.cards[0])
            Object.assign(compCard, data.cards[1])
            deckInfo.remaining = data.remaining
        })
        .then(renderCards)
}

const renderCards = () => {
    createCardImg(playerCard, playerCardDiv)
    createCardImg(compCard, compCardDiv)
    scoreCheck(playerCard.value, compCard.value)
    renderScore()
    setTimeout(turnMsg, 1000)
    deckCheck()
}

const createCardImg = (cardObj, cardDiv) => {
    cardDiv.innerHTML = ''
    let img = document.createElement('img')
    img.src = cardObj.image
    cardDiv.appendChild(img)
}

const scoreCheck = (playerScore, compScore) => {
    let plyScoreValue = Number(playerScore)
    let compScoreValue = Number(compScore)
    if(!plyScoreValue) plyScoreValue = scoreStandard[playerScore]
    if(!compScoreValue) compScoreValue = scoreStandard[compScore]
    adjScore(plyScoreValue, compScoreValue)
}

const adjScore = (score1, score2) => {
    if(score1 > score2) {
        scoreBoard.player += 1
        scoreBoard.turnResult = 'Your card wins!'
    }
    if(score1 < score2) {
        scoreBoard.comp += 1
        scoreBoard.turnResult = 'Your card lost!'
    }
    if(score1 == score2) {
        scoreBoard.turnResult = 'War!'
    }
}

const renderScore = () => {
    playerScoreSpan.innerHTML = scoreBoard.player
    compScoreSpan.innerHTML = scoreBoard.comp
    remainingCards.innerHTML = deckInfo.remaining
}

const turnMsg = () => {
    turnMessage.innerHTML = scoreBoard.turnResult
    turnMessage.style.display = 'block'
    setTimeout(() => {
        turnMessage.style.display = 'none'
    }, 3000)
}

newDeck.addEventListener('click', getDeck)
draw.addEventListener('click', getCards)