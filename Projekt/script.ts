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

    clear(): void {
        this.items = [];
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
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

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

    private init(): void {
        const appElement = document.getElementById('app');
        if (!appElement) {
            console.error("Prvek #app nebyl v HTML nalezen!");
            return;
        }

        // Vložíme moderní styly a HTML strukturu přímo přes TS
        appElement.innerHTML = `
            <style>
                :root {
                    --primary: #eab308;
                    --dark: #1f2937;
                    --light: #f3f4f6;
                }
                body {
                    font-family: 'Segoe UI', Roboto, sans-serif;
                    background-color: #f9fafb;
                    margin: 0;
                    padding: 0;
                }
                header {
                    background-color: var(--dark);
                    color: white;
                    text-align: center;
                    padding: 20px 0;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                header h1 { margin: 0; font-weight: 600; }
                .restaurant-container {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 30px;
                    max-width: 1200px;
                    margin: 30px auto;
                    padding: 0 20px;
                }
                @media (min-width: 768px) {
                    .restaurant-container { grid-template-columns: 2fr 1fr; }
                }
                section {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                h2 { margin-top: 0; color: var(--dark); border-bottom: 2px solid var(--light); padding-bottom: 10px; }
                .menu-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid var(--light);
                }
                .menu-item:last-child { border-bottom: none; }
                .add-btn {
                    background-color: var(--primary);
                    color: var(--dark);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .add-btn:hover { transform: translateY(-2px); opacity: 0.9; }
                #order-list { list-style: none; padding: 0; margin: 0; }
                #order-list li {
                    padding: 10px 0;
                    border-bottom: 1px dashed var(--light);
                    color: #4b5563;
                }
                .total {
                    margin-top: 20px;
                    font-size: 1.2rem;
                    text-align: right;
                    color: var(--dark);
                }
                .checkout-btn {
                    width: 100%;
                    background-color: var(--dark);
                    color: white;
                    border: none;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .checkout-btn:hover { background-color: #111827; }
                .checkout-btn:disabled { background-color: #9ca3af; cursor: not-allowed; }
            </style>

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
                        <strong>Celkem: <span id="total-price">0</span> Kč</strong>
                    </div>
                    <button id="checkout-btn" class="checkout-btn" disabled>Odeslat objednávku</button>
                </section>
            </div>
        `;

        this.renderMenu();
        this.renderOrder();
        this.setupCheckoutListener();
    }

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

            itemRow.querySelector('.add-btn')?.addEventListener('click', () => {
                this.currentOrder.addItem(item);
                this.renderOrder(); 
            });

            menuContainer.appendChild(itemRow);
        });
    }

    private renderOrder(): void {
        const orderList = document.getElementById('order-list');
        const totalPriceSpan = document.getElementById('total-price');
        const checkoutBtn = document.getElementById('checkout-btn') as HTMLButtonElement;
        
        if (!orderList || !totalPriceSpan) return;

        orderList.innerHTML = '';
        const items = this.currentOrder.getItems();

        if (items.length === 0) {
            orderList.innerHTML = '<li style="text-align:center; font-style:italic;">Košík je prázdný</li>';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            items.forEach((item) => {
                const li = document.createElement('li');
                li.textContent = `${item.getName()} - ${item.calculatePrice()} Kč`;
                orderList.appendChild(li);
            });
            if (checkoutBtn) checkoutBtn.disabled = false;
        }

        totalPriceSpan.textContent = this.currentOrder.calculateTotal().toString();
    }

    // Nová metoda pro zpracování kliknutí na objednávku
    private setupCheckoutListener(): void {
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn?.addEventListener('click', () => {
            const total = this.currentOrder.calculateTotal();
            
            // Simulace odeslání objednávky
            alert(`🎉 Objednávka byla úspěšně odeslána do kuchyně!\nCelkem k placení: ${total} Kč.`);
            
            // Vyčištění košíku
            this.currentOrder.clear();
            this.renderOrder();
        });
    }
}

// --- SPUŠTĚNÍ APLIKACE ---
const app = new RestaurantApp();
