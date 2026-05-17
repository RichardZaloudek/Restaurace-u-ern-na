abstract class MenuItem {
    protected name: string;
    protected basePrice: number;

    constructor(name: string, basePrice: number) {
        this.name = name;
        this.basePrice = basePrice;
    }

    abstract calculatePrice(): number;

    getName(): string {
        return this.name;
    }
}

class Food extends MenuItem {
    private portionSize: number; //v gramech

    constructor(name: string, basePrice: number, portionSize: number) {
        super(name, basePrice);
        this.portionSize = portionSize;
    }

    calculatePrice(): number {
        return this.basePrice;
    }
}

class Drink extends MenuItem {
    private volume: number; // litry

    constructor(name: string, basePrice: number, volume: number) {
        super(name, basePrice);
        this.volume = volume;
    }

    calculatePrice(): number {
        return this.basePrice * this.volume;
    }
}

class Order {
    private items: MenuItem[] = [];

    addItem(item: MenuItem): void {
        this.items.push(item);
    }

    calculateTotal(): number {
        return this.items.reduce((sum, item) => sum + item.calculatePrice(), 0);
    }
}

const order = new Order();

order.addItem(new Food("Svíčková", 150, 300));
order.addItem(new Drink("Pivo", 30, 0.5));

console.log(order.calculateTotal());