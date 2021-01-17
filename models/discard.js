class Defausse
{
    constructor(c_pioche)
    {
        this.pioche = c_pioche;
        this.cards = [];
    }
    add_to_pile(pioche, card)
    {
        pioche.remove_card(card);
        card.inpioche = false;
        card.indefausse = true;
        this.cards.push(card);
        let src = document.getElementById("defausse");
        let img = document.createElement("img");
        img.setAttribute("id", "d+"+card.number+"+"+card.color);
        img.style.position = "absolute";
        img.style.height = "150px";
        img.style.zIndex = this.cards.length;
        img.src = card.img_src;
        src.appendChild(img);
    }
}