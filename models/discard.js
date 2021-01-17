class Discard
{
    constructor(c_deck)
    {
        this.deck = c_deck;
        this.cards = [];
    }
    add_to_deck(deck, card)
    {
        deck.remove_card(card);
        card.inDeck = false;
        card.inDiscard = true;
        this.cards.push(card);
        let src = document.getElementById("discard");
        let img = document.createElement("img");
        img.setAttribute("id", "d+"+card.number+"+"+card.color);
        img.style.position = "absolute";
        img.style.height = "150px";
        img.style.zIndex = this.cards.length;
        img.src = card.img_src;
        src.appendChild(img);
    }
}