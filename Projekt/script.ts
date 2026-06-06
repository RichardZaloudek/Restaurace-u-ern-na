export {};

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

getItems(): MenuItem[] {
        return this.items;
    }

    calculateTotal(): number {
        return this.items.reduce((sum, item) => sum + item.calculatePrice(), 0);
    }
}

const menuList: MenuItem[] = [
    new Food("Svíčková na smetaně", 180, 150),
    new Food("Smažený sýr s hranolkami", 160, 200),
    new Food("Kuřecí řízek", 150, 150),
    new Drink("Pivo 11°", 90, 0.5), // 90 * 0.5 = 45 Kč
    new Drink("Domácí limonáda", 120, 0.4), // 120 * 0.4 = 48 Kč
    new Drink("Coca-Cola", 150, 0.33)
];

const currentOrder = new Order();

const appElement = document.getElementById('app');

if (appElement) {
    appElement.innerHTML = `
        <header>
            <h1>Restaurace u Černína</h1>
        </header>
        <div class="restaurant-container">
            <section class="menu-section">
                <h2>Jídelní a nápojový lístek</h2>
                <div id="menu-items"></div>
            </section>
            
            <section class="order-section">
                <h2>Vaše objednávka</h2>
                <ul id="order-list"></ul>
                <div class="total">
                    <strong>Celkem k placení: <span id="total-price">0</span> Kč</strong>
                </div>
            </section>
        </div>
    `;
}

function renderMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    menuList.forEach((item) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'menu-item';
        
        itemRow.innerHTML = `
            <span>${item.getName()} (<strong>${item.calculatePrice()} Kč</strong>)</span>
            <button class="add-btn">Přidat</button>
        `;

        // Tlačítko pro přidání do objednávky
        itemRow.querySelector('.add-btn')?.addEventListener('click', () => {
            currentOrder.addItem(item);
            renderOrder(); // Po přidání překreslíme objednávku
        });

        menuContainer.appendChild(itemRow);
    });
}

function renderOrder() {
    const orderList = document.getElementById('order-list');
    const totalPriceSpan = document.getElementById('total-price');
    if (!orderList || !totalPriceSpan) return;

    // Vyčistíme starý seznam
    orderList.innerHTML = '';

    // Vložíme všechny aktuální položky
    currentOrder.getItems().forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.getName()} - ${item.calculatePrice()} Kč`;
        orderList.appendChild(li);
    });

    // Aktualizujeme celkovou cenu
    totalPriceSpan.textContent = currentOrder.calculateTotal().toString();
}
