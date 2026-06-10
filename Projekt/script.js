// --- MODELY (Třídy pro data) ---
class MenuItem {
    name; //protected pro možnost přístupu v potomcích
    basePrice;
    constructor(name, basePrice) {
        this.name = name;
        this.basePrice = basePrice;
    }
    getName() {
        return this.name;
    }
    // metoda pro získání základní ceny
    getBasePrice() {
        return this.basePrice;
    }
}
class Food extends MenuItem {
    portionSize; // v gramech
    constructor(name, basePrice, portionSize) {
        super(name, basePrice);
        this.portionSize = portionSize;
    }
    calculatePrice() {
        return this.basePrice;
    }
}
class Drink extends MenuItem {
    volumeMl; // v mililitrech
    constructor(name, basePrice, volumeMl) {
        super(name, basePrice);
        this.volumeMl = volumeMl;
    }
    calculatePrice() {
        // Výpočet ceny: basePrice reprezentuje cenu za 1 litr (1000 ml)
        return Math.round(this.basePrice * (this.volumeMl / 1000));
    }
    getVolumeMl() {
        return this.volumeMl;
    }
}
class Order {
    items = []; //private znamená, že pole je přístupné pouze uvnitř třídy
    addItem(item) {
        this.items.push(item);
    }
    //Odebrání prvku z košíku podle indexu
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
    }
    getItems() {
        return this.items;
    }
    clear() {
        this.items = [];
    }
    calculateTotal() {
        return this.items.reduce((sum, item) => sum + item.calculatePrice(), 0); //výpočet celkové ceny objednávky
    }
}
// --- HLAVNÍ APLIKAČNÍ TŘÍDA ---
class RestaurantApp {
    menuList = [];
    currentOrder;
    constructor() {
        this.currentOrder = new Order();
        this.loadMenuData();
        if (document.readyState === 'loading') { // Pokud je dokument ještě načítán, počká na událost DOMContentLoaded, obstaralo Gemini pro správné načítání aplikace
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
        else {
            this.init();
        }
    }
    loadMenuData() {
        // Nápoje jsou definovány v mililitrech
        this.menuList = [
            new Food("Svíčková na smetaně", 180, 150),
            new Food("Smažený sýr s hranolkami", 160, 200),
            new Food("Kuřecí řízek s kaší", 150, 150),
            new Drink("Pivo 11°", 90, 500),
            new Drink("Domácí limonáda", 120, 400),
            new Drink("Coca-Cola", 150, 330)
        ];
    }
    init() {
        const appElement = document.getElementById('app');
        if (!appElement) {
            console.error("Prvek #app nebyl v HTML nalezen!");
            return;
        }
        appElement.innerHTML = `
            <style>
                :root {
                    --primary: #eab308;
                    --dark: #1f2937;
                    --light: #f3f4f6;
                    --danger: #ef4444;
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
                
                /* Nové styly pro vstup množství a odebírací tlačítko */
                .volume-input {
                    padding: 4px 8px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    width: 65px;
                    text-align: center;
                    margin-left: 5px;
                }
                .remove-btn {
                    background: none;
                    border: none;
                    color: var(--danger);
                    cursor: pointer;
                    font-size: 1.1rem;
                    padding: 0 5px;
                    transition: transform 0.1s;
                }
                .remove-btn:hover { transform: scale(1.2); }

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
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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
    renderMenu() {
        const menuContainer = document.getElementById('menu-items');
        if (!menuContainer)
            return;
        this.menuList.forEach((item) => {
            const itemRow = document.createElement('div');
            itemRow.className = 'menu-item';
            // Generování HTML pro změnu množství (pouze pro nápoje)
            let volumeControlsHtml = '';
            if (item instanceof Drink) {
                volumeControlsHtml = `
                    <label style="font-size: 0.9rem; color: #4b5563; margin-right: 15px;">
                        Množství: 
                        <input type="number" class="volume-input" value="${item.getVolumeMl()}" min="10" step="50"> ml
                    </label>
                `;
            }
            //Základní HTML pro položku menu, včetně dynamického zobrazení ceny a ovládacích prvků pro nápoje
            itemRow.innerHTML = `
                <span>${item.getName()} (<strong><span class="price-display">${item.calculatePrice()}</span> Kč</strong>)</span>
                <div style="display: flex; align-items: center;">
                    ${volumeControlsHtml}
                    <button class="add-btn">Přidat</button>
                </div>
            `;
            // Živé překreslování orientační ceny při změně mililitrů v lístku
            if (item instanceof Drink) {
                const volumeInput = itemRow.querySelector('.volume-input');
                const priceDisplay = itemRow.querySelector('.price-display');
                volumeInput?.addEventListener('input', () => {
                    const currentMl = parseInt(volumeInput.value) || 0;
                    const tempDrink = new Drink(item.getName(), item.getBasePrice(), currentMl);
                    priceDisplay.textContent = tempDrink.calculatePrice().toString();
                });
            }
            // Obsluha kliknutí na "Přidat"
            itemRow.querySelector('.add-btn')?.addEventListener('click', () => {
                let itemToAdd = item;
                if (item instanceof Drink) {
                    const volumeInput = itemRow.querySelector('.volume-input');
                    const customVolume = parseInt(volumeInput.value) || 0;
                    // Vytvoří novou instanci nápoje se specifickým zadaným objemem
                    itemToAdd = new Drink(item.getName(), item.getBasePrice(), customVolume);
                }
                this.currentOrder.addItem(itemToAdd);
                this.renderOrder();
            });
            menuContainer.appendChild(itemRow);
        });
    }
    renderOrder() {
        const orderList = document.getElementById('order-list');
        const totalPriceSpan = document.getElementById('total-price');
        const checkoutBtn = document.getElementById('checkout-btn');
        if (!orderList || !totalPriceSpan)
            return;
        orderList.innerHTML = '';
        const items = this.currentOrder.getItems();
        if (items.length === 0) {
            orderList.innerHTML = '<li style="text-align:center; font-style:italic;">Košík je prázdný</li>';
            if (checkoutBtn)
                checkoutBtn.disabled = true;
        }
        else {
            items.forEach((item, index) => {
                const li = document.createElement('li');
                // Formátování textu položky v košíku (u nápojů se vypíše i přesné ml)
                let itemDetails = '';
                if (item instanceof Drink) {
                    itemDetails = ` (${item.getVolumeMl()} ml)`;
                }
                li.innerHTML = `
                    <span>${item.getName()}${itemDetails} - <strong>${item.calculatePrice()} Kč</strong></span>
                    <button class="remove-btn" title="Odebrat z objednávky">❌</button>
                `;
                // Přidání posluchače pro odebrání konkrétního prvku z košíku podle indexu
                li.querySelector('.remove-btn')?.addEventListener('click', () => {
                    this.currentOrder.removeItem(index);
                    this.renderOrder();
                });
                orderList.appendChild(li);
            });
            if (checkoutBtn)
                checkoutBtn.disabled = false;
        }
        totalPriceSpan.textContent = this.currentOrder.calculateTotal().toString();
    }
    setupCheckoutListener() {
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn?.addEventListener('click', () => {
            const total = this.currentOrder.calculateTotal();
            alert(`🎉 Objednávka byla úspěšně odeslána do kuchyně!\nCelkem k placení: ${total} Kč.`);
            this.currentOrder.clear();
            this.renderOrder();
        });
    }
}
// --- SPUŠTĚNÍ APLIKACE ---
const app = new RestaurantApp();
export {};
