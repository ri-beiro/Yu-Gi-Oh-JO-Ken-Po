const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        box: document.querySelector(".card_details"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides:{
        player1: "player-cards",
        player1BOX : document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },
    actions: {
        button:document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1, 4],
        LoseOf:[2, 3],
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2, 3],
        LoseOf:[0, 5],
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0, 5],
        LoseOf:[1, 4],
    },
    {
        id:3,
        name:"Red Eyes Black Dragon ",
        type:"Scissors",
        img: `${pathImages}blackdragon.png`,
        WinOf: [0, 5],
        LoseOf:[1, 4],
    },
    {
        id:4,
        name:"The Winged Dragon of Ra",
        type:"Rock",
        img: `${pathImages}ra.png`,
        WinOf: [2],
        LoseOf:[0],
    },
    {
        id:5,
        name:"Blue-Eyes Ultimate Dragon",
        type:"Paper",
        img: `${pathImages}triplebluedragon.png`,
        WinOf: [1, 4],
        LoseOf:[2, 3],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    

    cardImage.classList.add("card", "card-image"); 

    if(fieldSide === state.playerSides.player1) { 
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener("mouseover", ()=> {
            drawSelectCard(IdCard);
        });
      
        cardImage.addEventListener("mouseout", () => {
             hiddenCardDetails();
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {
   
    state.cardSprites.avatar.src = ""; 

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}


async function drawCardsInfield(cardId, computerCardId) {
    // Player
    state.fieldCards.player.className = ""; 
    state.fieldCards.player.classList.add("card-image");
    state.fieldCards.player.src = cardData[cardId].img;

    // Computer
    state.fieldCards.computer.className = "";
    state.fieldCards.computer.classList.add("card-image");
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
    
    if(value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    }

    if(value === false) {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    }
}


async function hiddenCardDetails() {
    state.cardSprites.box.style.display = "flex"; 
    state.cardSprites.avatar.src = ""; 
    state.cardSprites.name.innerText = "Selecione"; 
    state.cardSprites.type.innerText = "uma carta";
}


async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "WIN";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "LOSE";
        state.score.computerScore++;
    }
    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}


async function drawSelectCard(index) {
    state.cardSprites.box.style.display = "flex"; 
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    } 
}
async function resetDuel() {
   
    hiddenCardDetails();

   
    state.actions.button.style.display = "none";

  
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try {
        audio.play();
    } catch {}
    audio.play()
}

function init(){

    showHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}


init();