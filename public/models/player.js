class Player
{
    constructor(userid)
    {
        this.userid = userid;
        this.cards = [];
    }
    add_card(card)
    {
        card.set_index(this.cards.length);
        this.cards.push(card);
        let src = document.getElementById("hand_player"+this.userid);
        let img = document.createElement("img");
        img.setAttribute("id", "h+"+this.userid+"+"+this.cards[this.cards.length - 1].number+"+"+this.cards[this.cards.length - 1].color);
        img.style.position = "absolute";
        img.style.height = "150px";
        img.style.left = ""+60*(this.cards.length - 1)+"px";
        img.style.zIndex = 1;
        img.src = this.cards[this.cards.length - 1].img_src;
        src.appendChild(img);
    }
    play_card(card)
    {
        this.cards.splice(card.index_in_hand, 1);
        card.set_index(-1);
    }
    get_plus(howmany, deck)
    {
        for (let i = 0; i < howmany; i++)
        {
            let card = deck.get_first_card();
            deck.remove_card(card);
            add_card(card);
        }
    }
}