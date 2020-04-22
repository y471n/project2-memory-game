//generate array with randomly generated icons, each icon must be twice in the array, array length corresponding to number of cards
function cardsArray(numberOfCards) {
    let randomIconsArray = iconsArray.sort(() => 0.5 - Math.random()); //create randomly shuffled array of all font awesome icons
    var cardsArray = []; //array of randomly selected icons for new game

    //loop selects number of cards needed for the game from the beginning of randomly shuffled icons array
    for (var i = 0; i < numberOfCards / 2; i++) {
        //each card needs to be repeated twice in the array
        cardsArray.push(randomIconsArray[i]);
        cardsArray.push(randomIconsArray[i]);
    };
    //selected cards array needs to be randomly shuffled
    
    cardsArray.sort(() => 0.5 - Math.random()) //randomly suffles created array of icons for the game
    return cardsArray;
}


//create game-page
function createGamePage(numberOfCards) {

    grid.innerHTML = ""; //clear grid container

    scoreBoard.style.visibility = "visible";    //score board is visible on difficulty page
    homeButton.style.visibility = "visible";    //homebutton is visible on difficulty page

    Cards = cardsArray(numberOfCards); //generating cards for the game

    //Loop creates element for each of generated cards and assigns needed attributes
    for (let i = 0; i < Cards.length; i++) {
        var card = document.createElement('div'); //set card variable as 'div' element
        card.setAttribute('class', 'flipCardContainer card icon-size' + numberOfCards); //assign classes
        card.style.width = Math.floor((1 / Math.sqrt(Cards.length)) * 100) - 1 + '%' //define card width - calculated based on number of cards in the row
        card.style.height = Math.floor((1 / Math.sqrt(Cards.length)) * 100) - 1 + '%' //define card height - calculated based on number of cards in the column
        card.innerHTML = '<div class= "flipCard"><div class="frontSide">' + Cards[i] + '</div><div class="backSide"><i class="fab fa-font-awesome-flag"></i></div></div>'; //define inner html
        card.setAttribute('data-id', i); //create and define cards' 'data-id' attribute
        card.addEventListener('click', flipCard); //on click, launch function flipCard()
        grid.appendChild(card); 
    }
}

//flip your card
function flipCard() {

    //allow only two cards to be flipped
    if (cardsChosen.length === 2) {
        return;
    }

    //disable to flip already selected card
    if (cardsChosenId[0] === this.getAttribute('data-id')) {
        return;
    }

    //disable play if the time in challengend mode expired
    if (timeDisplay.textContent === "EXPIRED") {
        return;
    }

    //if it is the first move, start stopwatch; if challenged mode selected, start timer
    if (firstMove === 0) {
        firstMove = 1;
        stopWatch();
        if (challengeMode == 1) {
            timer();
        }
    }

    var cardId = this.getAttribute('data-id'); //saving card's 'data-id' attribute (Cards ID) to 'cardId' variable
    cardsChosen.push(Cards[cardId]); //pushing flipped card to cardsChosen array
    cardsChosenId.push(cardId); //pushing flipped card's ID to cardsChosenId array
    this.classList.add('flip'); //add 'flip' class - animated flip effect
    if (cardsChosen.length === 2) { //if two cards were chosen, wait for 1000 ms and lanch checkForMatch() function
        setTimeout(checkForMatch, 1000)
    };

}


//check for matches
function checkForMatch() {
    
    var cards = document.querySelectorAll('.flipCardContainer') //creating array of all distributed cards
    const optionOneId = cardsChosenId[0] //setting the ID of the first flipped card as constant
    const optionTwoId = cardsChosenId[1] //setting the ID of the second flipped card as constant
    
    if (cardsChosen[0] === cardsChosen[1]) { //Winning scenarion = icons on flipped cards match
        cards[optionOneId].style.visibility = "hidden" //make the first card hidden
        cards[optionTwoId].style.visibility = "hidden" //make the second card hidden
        cardsWon.push(cardsChosen) //update array of won cards
        attempts.push(cardsChosen) //update array of attempts
    } else { //Losing scenario = icons on flipped cards do not match
        cards[optionOneId].classList.remove('flip') //flip the first card back
        cards[optionTwoId].classList.remove('flip') //flip the second card back
        attempts.push(cardsChosen) //update array of attempts
    }

    cardsChosen = [] //clear cardsChosen array
    cardsChosenId = [] //clear cardsChosenId array
    wonDisplay.textContent = cardsWon.length //update score on won display in header
    failDisplay.textContent = attempts.length - cardsWon.length //update score on fail display in header
    
    //End of game scenario - number of won cards is equal to total number of cards
    if (cardsWon.length === Cards.length / 2) {
        
        if (challengeMode == 1) {
            clearTimeout(t); //stop timer if the game was in challenge mode
        }
        
        clearTimeout(sw); //stop stopwatch
        createGameOverPage('won') //open Game Over page with winning content
    }
}





