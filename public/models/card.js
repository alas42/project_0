class Card
{
    constructor(color, number)
    {
        let colors = new Colors();
        this.color = colors.get_color(color);
        this.number = number;
        this.img_src = '/images/cards/'+number+'+'+this.color+'.png';
        this.visible = false;
        this.inDeck = true;
        this.inDiscard = false;
        this.background_card = '/images/cards/background.png';
        this.index_in_hand = -1;
    }
    get_img_url(color, number)
    {
        return (this.img_url);
    }
    set_index(index)
    {
        this.index_in_hand = index;
    }
}