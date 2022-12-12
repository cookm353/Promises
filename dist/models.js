class NumberFacts {
    numberRequest(number) {
        let url = "http://numbersapi.com";
        return new Promise(function (resolve, reject) {
            const resp = axios.get(`${url}/${number}/trivia?json`);
            resolve(resp);
            reject('Rejected!');
        });
    }
    sectionOne() {
        this.numberRequest(7)
            .then(resp => {
            console.log(1.1);
            console.log(resp.data.text);
        })
            .catch(err => console.log(err));
    }
    sectionTwo() {
        let numbers = [this.numberRequest(7), this.numberRequest(13), this.numberRequest(42)];
        Promise.all(numbers)
            .then(numberArray => {
            console.log(1.2);
            numberArray.forEach(number => console.log(number.data.text));
        })
            .catch(err => console.log(err));
    }
    sectionThree() {
        this.numberRequest(42)
            .then(resp => {
            console.log(1.3);
            console.log(resp.data.text);
            return this.numberRequest(42);
        })
            .then(resp => {
            console.log(resp.data.text);
            return this.numberRequest(42);
        })
            .then(resp => {
            console.log(resp.data.text);
            return this.numberRequest(42);
        })
            .then(resp => console.log(resp.data.text))
            .catch(err => console.log(err));
    }
}
class Deck {
    _cardURL = "https://deckofcardsapi.com/api/deck/new/draw/?count=";
    _deckURL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
    deckID;
    cardsLeft = 52;
    constructor() {
        axios.get(this._deckURL)
            .then(resp => {
            this.deckID = resp.data.deck_id;
        });
    }
    drawCard(numCards, deckID) {
        /*
        Draw a specified number of cards from either a brand new deck or a
        specified one
        */
        let cardURL;
        this.cardsLeft--;
        if (deckID) {
            cardURL = `https://deckofcardsapi.com/api/deck/${this.deckID}/draw/?count=`;
        }
        else {
            cardURL = "https://deckofcardsapi.com/api/deck/new/draw/?count=";
        }
        return new Promise((resolve, reject) => {
            const resp = axios.get(`${cardURL}${numCards}`);
            resolve(resp);
            reject('Rejected!');
        });
    }
    showCard(url) {
        const $cardDisplay = $('#card-display');
        const $newCard = $(`<img class="img-fluid" src=${url}>`);
        console.log($newCard);
        $cardDisplay.append($newCard);
    }
    sectionOne() {
        /*
        Draw a single card from a newly shuffled deck
        */
        this.drawCard(1)
            .then(resp => {
            const card = resp.data.cards[0];
            console.log(`${card.value} of ${card.suit}`);
        });
    }
    sectionTwo() {
        /*
        Draw a card from a newly shuffled deck,
        then draw another from the same deck
        */
        axios.get(this._deckURL)
            .then(resp => {
            const deck_id = resp.data.deck_id;
            return Promise.all([this.drawCard(1, deck_id), deck_id]);
        })
            .then(resp => {
            const [cardResp, deckId] = resp;
            const card = cardResp.data.cards[0];
            console.log(`${card.value} of ${card.suit}`);
            return this.drawCard(1, deckId);
        })
            .then(resp => {
            const card = resp.data.cards[0];
            console.log(`${card.value} of ${card.suit}`);
        });
    }
}
