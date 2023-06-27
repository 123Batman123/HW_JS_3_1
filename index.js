class Good {
    constructor(id, name, description, sizes, price, available=true) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }

    setAvailable() {
        this.available = !this.available;
    }
}


class GoodsList {
    #goods = [];
    constructor(goods, filter=false, sortPrice=false, sortDir=false) {
        this.#goods = goods;
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }

    get list() {
        let finalList = this.#goods;
        if (this.filter) {
            finalList = this.#goods.filter(el => this.filter.test(el.name));
        }
        if (this.sortPrice) {
            if (this.sortDir) {
                finalList.sort((el, el1) => el.price - el1.price);
            } else {
                finalList.sort((el, el1) => el1.price - el.price);
            }
        }
        return finalList;
    }


    add(good) {
        this.#goods.push(good);
    }

    remove(id) {
        this.#goods.splice(this.#goods.findIndex(el => el.id === id), 1);
    }
}


class BasketGood extends Good{
    constructor(Good, amount) {
        super(Good.id, Good.name, Good.description, Good.sizes, Good.price, Good.available);
        this.amount = amount;
    }
}


class Basket {
    #goods = [];
    constructor(goods) {
        this.#goods = goods;
    }

    get totalAmount() {
        return this.#goods.reduce((sum, current) => {
            return sum + current.price * current.amount
        },0);
    }

    get totalSum() {
        return this.#goods.reduce((sum, current) => {
            return sum + current.amount
        }, 0);
    }

    get list() {
        return this.#goods;
    }

    add(good, amount) {
        if (this.#goods.some(el => el.name == good.name)) {
            let findIn = this.#goods.findIndex(el => el.name == good.name);
            this.#goods[findIn].amount += amount;
        } else {
            this.#goods.push(new BasketGood(good, amount));
        }
    }
    
    remove(good, amount) {
        if (this.#goods.some(el => el.name == good.name)) {
            let findIn = this.#goods.findIndex(el => el.name == good.name);
            this.#goods[findIn].amount -= amount;
            if (this.#goods[findIn].amount <= 0 ) {
                this.#goods.splice(findIn, 1);
            }
        } else{console.log('Такого тавара в корзине нет!')}
    }

    clear() {
        this.#goods = [];
        
    }

    removeUnavailable() {
        this.#goods = this.#goods.filter(el => el.available === true);
        console.log(this.#goods);
    }
}

let [a, b, c , d, f] = [
    new Good(1, 'Яблоко', 'Красное', [1], 70),
    new Good(2, 'Виноград', 'Красный', [1], 150),
    new Good(3, 'Апельсины', 'Красные', [1], 100),
    new Good(4, 'Апельсиновый сок', '100%', [1], 200),
    new Good(5, 'Апельсиновый мармелад', 'Желтый', [0.1], 75, false),
]

let productList = new GoodsList([], /апельсин/i, true, true);
productList.add(a);
productList.add(b);
productList.add(c);
productList.add(d);
productList.add(f);
productList.remove(1);
// console.log(productList.list);

let card = new Basket([]);
card.add(a, 10);
card.add(a, 10);
card.add(c, 20);
card.add(f, 50);
card.remove(a, 10);
card.removeUnavailable();
// card.clear();
// console.log(card.list);
console.log('Стоимость', card.totalAmount, 'Всего в корзине', card.totalSum);
