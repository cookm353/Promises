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
class Pokemon {
    baseURL = 'https://pokeapi.co/api/v2/pokemon/';
    speciesURL = 'https://pokeapi.co/api/v2/pokemon-species/';
    allPokemon = [];
    constructor() {
        this.catchEmAll;
    }
    catch(id) {
        /* Make an API call for an individual Pokemon */
        return new Promise((resolve, reject) => {
            const resp = axios.get(`${this.baseURL}${id}`);
            resolve(resp);
            reject('Rejected!');
        });
    }
    catchEmAll() {
        /* Populate array with info on every Pokemon */
        const pokemonPromises = [];
        for (let id = 1; id <= 905; id++) {
            pokemonPromises.push(this.catch(id));
        }
        Promise.all(pokemonPromises)
            .then(resps => {
            resps.forEach(resp => {
                const info = {
                    pokemonName: resp.data.name,
                    pokemonURL: `${this.baseURL}${resp.data.name}`
                };
                this.allPokemon.push(info);
            });
        })
            .catch(err => console.log(err));
    }
    getRandomIndex() {
        /* Generate a random index to pick a Pokemon */
        const min = 0;
        const max = this.allPokemon.length - 1;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    pick3() {
        /* Randomly select 3 Pokemon and display details */
        const pokemonDetails = [];
        const pokemon1 = this.allPokemon[this.getRandomIndex()];
        const pokemon2 = this.allPokemon[this.getRandomIndex()];
        const pokemon3 = this.allPokemon[this.getRandomIndex()];
        const pokemonList = [
            axios.get(`${this.speciesURL}${pokemon1.pokemonName}`),
            axios.get(`${this.speciesURL}${pokemon2.pokemonName}`),
            axios.get(`${this.speciesURL}${pokemon3.pokemonName}`)
        ];
        axios.get(`${this.speciesURL}${pokemon1.pokemonName}`)
            .then(resp => {
            const flavor_text = resp.data.flavor_text_entries[0].flavor_text;
            console.log(pokemon1.pokemonName);
            console.log(flavor_text);
            return axios.get(`${this.speciesURL}${pokemon2.pokemonName}`);
        })
            .then(resp => {
            const flavor_text = resp.data.flavor_text_entries[0].flavor_text;
            console.log(pokemon2.pokemonName);
            console.log(flavor_text);
            return axios.get(`${this.speciesURL}${pokemon3.pokemonName}`);
        })
            .then(resp => {
            console.log(pokemon3.pokemonName);
            const flavor_text = resp.data.flavor_text_entries[0].flavor_text;
            console.log(flavor_text);
        });
        // return [pokemon1, pokemon2, pokemon3]
    }
}
