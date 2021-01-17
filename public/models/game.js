class Game
{
    constructor(nbplayer)
    {
        this.nbplayer = nbplayer;
        this.players = [];
        this.deck = new Deck();
        this.discard = new Discard(this.deck);
    }
    add_player(player)
    {
        this.players.push(player);
    }
    begin_game()
    {
        this.deck.shuffle(this.deck.cards);
        this.discard.add_to_deck(this.deck, this.deck.get_first_card());
        
        for (let i = 0; i < this.players.length; i++)
        {
            for (let j = 0; j < 7; j++)
            {
                let card = this.deck.get_first_card();
                this.deck.remove_card(card);
                this.players[i].add_card(card);
            }
        }
        console.log("card in deck "+this.deck.cards.length);
        console.log("card in discard "+this.discard.cards.length);
    }
}