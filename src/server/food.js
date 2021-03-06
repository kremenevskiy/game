const Object = require('./object');
const Constants = require('../shared/constants')


function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = "#";
    for (let i = 0; i < 6; ++i) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class Food extends Object {
    constructor(id, x, y) {
        super(id, x, y);
        this.r = Constants.FOOD_RADIUS;
        this.color = getRandomColor();
    }


    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            color: this.color,
            r: this.r
        }

    }
}

module.exports = Food;