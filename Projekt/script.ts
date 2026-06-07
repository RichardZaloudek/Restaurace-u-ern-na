export {};

// --- MODELY (Třídy pro data) ---

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
    private portionSize: number; // v gramech

    constructor(name: string, basePrice: number, portionSize: number) {
        super(name, basePrice);
        this.portionSize = portionSize;
    }

    calculatePrice(): number {
        return this.basePrice;
    }
}

class Drink extends MenuItem {
    private volume: number; // v litrech

    constructor(name: string, basePrice: number, volume: number) {
        super(name, basePrice);
        this.volume = volume;
    }

    calculatePrice(): number {
        return Math.round(this.basePrice * this.volume);
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

// --- HLAVNÍ APLIKAČNÍ TŘÍDA ---

class RestaurantApp {
    private menuList: MenuItem[] = [];
    private currentOrder: Order;

    constructor() {
        this.currentOrder = new Order();
        this.loadMenuData();
        
        // Bezpečné spuštění: Počkáme, až bude HTML kompletně připravené
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Naplnění dat menu uvnitř instance
    private loadMenuData(): void {
        this.menuList = [
            new Food("Svíčková na smetaně", 180, 150),
            new Food("Smažený sýr s hranolkami", 160, 200),
            new Food("Kuřecí řízek s kaší", 150, 150),
            new Drink("Pivo 11°", 90, 0.5), 
            new Drink("Domácí limonáda", 120, 0.4), 
            new Drink("Coca-Cola", 150, 0.33)
        ];
    }

    // Prvotní sestavení HTML struktury
    private init(): void {
        const appElement = document.getElementById('app');
        if (!appElement) {
            console.error("Prvek #app nebyl v HTML nalezen!");
            return;
        }

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

        // Po vytvoření kostry hned vykreslíme obsah
        this.renderMenu();
        this.renderOrder();
    }

    // Vykreslení položek menu
    private renderMenu(): void {
        const menuContainer = document.getElementById('menu-items');
        if (!menuContainer) return;

        this.menuList.forEach((item) => {
            const itemRow = document.createElement('div');
            itemRow.className = 'menu-item';
            
            itemRow.innerHTML = `
                <span>${item.getName()} (<strong>${item.calculatePrice()} Kč</strong>)</span>
                <button class="add-btn">Přidat</button>
            `;

            // Použití arrow funkce zachová správný kontext 'this' na instanci aplikace
            itemRow.querySelector('.add-btn')?.addEventListener('click', () => {
                this.currentOrder.addItem(item);
                this.renderOrder(); 
            });

            menuContainer.appendChild(itemRow);
        });
    }

    // Vykreslení aktuální objednávky
    private renderOrder(): void {
        const orderList = document.getElementById('order-list');
        const totalPriceSpan = document.getElementById('total-price');
        if (!orderList || !totalPriceSpan) return;

        orderList.innerHTML = '';

        this.currentOrder.getItems().forEach((item) => {
            const li = document.createElement('li');
            li.textContent = `${item.getName()} - ${item.calculatePrice()} Kč`;
            orderList.appendChild(li);
        });

        totalPriceSpan.textContent = this.currentOrder.calculateTotal().toString();
    }
}

// --- SPUŠTĚNÍ APLIKACE ---
// Vytvořením nové instance se automaticky spustí celý životní cyklus aplikace
const app = new RestaurantApp();
