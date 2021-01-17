class Game
{
    constructor(nbplayer)
    {
        this.nbplayer = nbplayer;
        this.players = [];
        this.pioche = new Pioche();
        this.defausse = new Defausse(pioche);
    }
    add_player(player)
    {
        this.players.push(player);
    }
    begin_game()
    {
        this.pioche.shuffle(this.pioche.cards);
        this.defausse.add_to_pile(this.pioche, this.pioche.get_first_card());
        
        for (let i = 0; i < this.players.length; i++)
        {
            for (let j = 0; j < 7; j++)
            {
                let card = this.pioche.get_first_card();
                this.pioche.remove_card(card);
                this.players[i].add_card(card);
            }
        }
        console.log("card in pioche "+this.pioche.cards.length);
        console.log("card in defausse "+this.defausse.cards.length);
    }
}