function main(): void {
    const numbers = new NumberFacts
    numbers.sectionOne()
    numbers.sectionTwo()
    numbers.sectionThree()

    const cards = new Deck
    cards.sectionOne()
    cards.sectionTwo()
    cards.drawCard(1)
        .then(resp => {
            console.log(resp.data)
        })
}

// main()

const deck = new Deck
const $cardImg = $('img')

$('#hit-me').click(evt => {
    if (deck.cardsLeft >= 1) {
        deck.drawCard(1, deck.deckID)
            .then(resp => {
                const imgURL: string = resp.data.cards[0].images.svg
                $cardImg.attr('src', imgURL)
            })
    }
})
