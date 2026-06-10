export {};

// --- MODELY (Třídy pro data) ---

abstract class MenuItem {
    protected name: string; //protected pro možnost přístupu v potomcích
    protected basePrice: number;

    constructor(name: string, basePrice: number) { //konstruktor pro inicializaci názvu a základní ceny
        this.name = name;
        this.basePrice = basePrice;
    }

    abstract calculatePrice(): number; //abstraktní metoda pro výpočet ceny

    getName(): string {
        return this.name;
    }

    // metoda pro získání základní ceny
    getBasePrice(): number {
        return this.basePrice;
    }
}

class Food extends MenuItem { //třída pro jídlo, dědí z MenuItem
    private portionSize: number; // v gramech

    constructor(name: string, basePrice: number, portionSize: number) { //konstruktor pro inicializaci názvu, základní ceny a velikosti porce
        super(name, basePrice);
        this.portionSize = portionSize;
    }

    calculatePrice(): number {
        return this.basePrice;
    }
}

class Drink extends MenuItem { //třída pro nápoje, dědí z MenuItem
    private volumeMl: number; // v mililitrech

    constructor(name: string, basePrice: number, volumeMl: number) { //konstruktor pro inicializaci názvu, základní ceny a objemu v mililitrech
        super(name, basePrice);
        this.volumeMl = volumeMl;
    }

    calculatePrice(): number {
        // Výpočet ceny: basePrice reprezentuje cenu za 1 litr (1000 ml)
        return Math.round(this.basePrice * (this.volumeMl / 1000));
    }

    getVolumeMl(): number {
        return this.volumeMl;
    }
}

class Order { //třída pro objednávku, obsahuje položky v košíku
    private items: MenuItem[] = []; //private znamená, že pole je přístupné pouze uvnitř třídy

    addItem(item: MenuItem): void { //metoda pro přidání položky do košíku
        this.items.push(item);
    }

    //Odebrání prvku z košíku podle indexu
    removeItem(index: number): void {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
    }

    getItems(): MenuItem[] { //metoda pro získání všech položek v košíku
        return this.items;
    }

    clear(): void {
        this.items = [];
    }

    calculateTotal(): number {
        return this.items.reduce((sum, item) => sum + item.calculatePrice(), 0); //výpočet celkové ceny objednávky
    }
}

// --- HLAVNÍ APLIKAČNÍ TŘÍDA ---

class RestaurantApp { //třída pro hlavní logiku aplikace
    private menuList: MenuItem[] = [];
    private currentOrder: Order;

    constructor() { //konstruktor pro inicializaci aktuální objednávky a načtení dat menu
        this.currentOrder = new Order();
        this.loadMenuData();
        
        if (document.readyState === 'loading') { // Pokud je dokument ještě načítán, počká na událost DOMContentLoaded, obstaralo Gemini pro správné načítání aplikace
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private loadMenuData(): void { //metoda pro načtení dat menu, zde jsou položky pevně zakódovány
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

    private init(): void {
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
                header h1 { margin: 0; font-weight: 600; font-size: 1.5rem; }
                
                /* --- NOVÝ FLEXBOX KONTEJNER (Mobilní první - pod sebou) --- */
                .restaurant-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    max-width: 1200px;
                    margin: 20px auto;
                    padding: 0 15px;
                    box-sizing: border-box;
                }
                
                section {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    box-sizing: border-box;
                }
                
                /* Výchozí plná šířka pro flex položky na mobilu */
                .menu-section, .order-section {
                    flex: 1 1 100%;
                }

                /* --- RESPONZIVITA PRO TABLETY A DESKOPY (Vedle sebe) --- */
                @media (min-width: 768px) {
                    header h1 { font-size: 2rem; }
                    .restaurant-container { 
                        flex-direction: row; 
                        align-items: flex-start; /* Zabrání zbytečnému natahování kratší sekce */
                        gap: 30px;
                        margin: 30px auto;
                    }
                    .menu-section {
                        flex: 2; /* Jídelní lístek dostane 2/3 prostoru */
                    }
                    .order-section {
                        flex: 1; /* Košík dostane 1/3 prostoru */
                    }
                }

                h2 { margin-top: 0; color: var(--dark); border-bottom: 2px solid var(--light); padding-bottom: 10px; font-size: 1.3rem; }
                
                /* Responzivní položka v menu */
                .menu-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap; /* Pokud se text nevejde vedle tlačítek, odřadkuje se */
                    gap: 10px;
                    padding: 15px 0;
                    border-bottom: 1px solid var(--light);
                }
                .menu-item:last-child { border-bottom: none; }
                
                .menu-item-controls {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex-grow: 1; /* Roztáhne ovládání k pravému kraji */
                }
                
                .volume-input {
                    padding: 6px 8px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    width: 60px;
                    text-align: center;
                    margin: 0 5px;
                    font-size: 0.9rem;
                }
                
                .remove-btn {
                    background: none;
                    border: none;
                    color: var(--danger);
                    cursor: pointer;
                    font-size: 1.1rem;
                    padding: 5px;
                }

                .add-btn {
                    background-color: var(--primary);
                    color: var(--dark);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .add-btn:hover { opacity: 0.9; }
                
                #order-list { list-style: none; padding: 0; margin: 0; }
                #order-list li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px dashed var(--light);
                    color: #4b5563;
                    font-size: 0.95rem;
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
                }
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

    private renderMenu(): void { //metoda pro vykreslení menu do HTML, generuje položky a přidává posluchače pro změnu množství a přidání do košíku
        const menuContainer = document.getElementById('menu-items');
        if (!menuContainer) return;

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
                const volumeInput = itemRow.querySelector('.volume-input') as HTMLInputElement;
                const priceDisplay = itemRow.querySelector('.price-display') as HTMLSpanElement;
                
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
                    const volumeInput = itemRow.querySelector('.volume-input') as HTMLInputElement;
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

    private renderOrder(): void { //metoda pro vykreslení aktuální objednávky do HTML, zobrazuje položky v košíku, jejich jednotlivé ceny, celkovou cenu a přidává možnost odebrat položku z košíku
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
            if (checkoutBtn) checkoutBtn.disabled = false;
        }

        totalPriceSpan.textContent = this.currentOrder.calculateTotal().toString();
    }

    private setupCheckoutListener(): void { //metoda pro nastavení posluchače události pro tlačítko "Odeslat objednávku", které zobrazí alert s celkovou cenou a vyčistí košík
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
