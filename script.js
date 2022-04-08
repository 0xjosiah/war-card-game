const newDeckBtn = document.querySelector('#new-deck-btn')
const drawBtn = document.querySelector('#draw-btn')
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
    if(!deckInfo.id) drawBtn.disabled = true
    if(deckInfo.remaining < 2) {
        drawBtn.disabled = true
        matchCheck()
    }
}

deckCheck()

const matchCheck = () => {
    if(scoreBoard.player > scoreBoard.comp) titleMsg.innerHTML = 'You Win!'
    if(scoreBoard.player < scoreBoard.comp) titleMsg.innerHTML = 'The Computer Wins!'
    if(scoreBoard.player == scoreBoard.comp) titleMsg.innerHTML = "It's a Draw!"
    newDeckBtn.disabled = false
}

const gameReset = () => {
    titleMsg.innerHTML = 'Game of War'
    scoreBoard = {
        player: 0,
        comp: 0,
        turnResult: null,
        matchResult: null
    }
    playerCardDiv.innerHTML = ''
    compCardDiv.innerHTML = ''
}

const getDeck = async () => {
    gameReset()
    const res = await fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/')
    const data = await res.json()
    deckInfo.id = data.deck_id
    deckInfo.remaining = data.remaining
    drawBtn.disabled = false
    remainingCards.innerHTML = deckInfo.remaining
    renderScore()
    newDeckBtn.disabled = true
}
    
    
const getCards = async () => {
    const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckInfo.id}/draw/?count=2`)
    const data = await res.json()
    Object.assign(playerCard, data.cards[0])
    Object.assign(compCard, data.cards[1])
    deckInfo.remaining = data.remaining
    renderCards()
}

const renderCards = () => {
    createCardImg(playerCard, playerCardDiv)
    createCardImg(compCard, compCardDiv)
    scoreCheck(playerCard.value, compCard.value)
    renderScore()
    setTimeout(turnMsg, 250)
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
    }, 2000)
}

newDeckBtn.addEventListener('click', getDeck)
drawBtn.addEventListener('click', getCards)