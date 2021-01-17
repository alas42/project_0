class Deck
{
    constructor()
    {
        this.nbcard = 108;
        this.cards = [];

        for (let i = 0; i < 15; i++)
        {
            let j = 0;
            if (i == 0)
            {
                while (j < 4)
                {
                    this.cards.push(new Card(j ,i));
                    j++;
                }
            }
            else if (i > 0 && i <= 9)
            {
                while (j < 4)
                {
                    this.cards.push(new Card(j ,i));
                    this.cards.push(new Card(j ,i));
                    j++;
                }
            }
            else if (i == 10 || i == 12)
            {
                while (j < 4)
                {
                    this.cards.push(new Card(4 ,i));
                    j++;
                }
            }
            else if (i == 11 || i == 13 || i == 14)
            {
                while (j < 4)
                {
                    this.cards.push(new Card(j ,i));
                    this.cards.push(new Card(j ,i));
                    j++;
                }
            }
        }
    }
    fill_deck() //visible part anyway
    {
        let src = document.getElementById("deck");
        for (let i = 0; i < 108; i++)
        {
            let img = document.createElement("img");
            img.setAttribute("id", "p+"+this.cards[i].number+"+"+this.cards[i].color);
            img.style.position = "absolute";
            img.style.height = "150px";
            img.style.left = ""+2*i+"px";
            img.style.zIndex = i;
            img.src = this.cards[i].background_card;
            src.appendChild(img);
        }
    }
    shuffle(array) //knuth-shuffle github
    {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex)
        {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        this.fill_deck();
    }
    get_first_card()
    {
        return (this.cards[this.cards.length - 1]);
    }
    remove_card(card)
    {
        this.cards.splice(-1, 1);
    }
}