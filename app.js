// Sistema PDV - JavaScript

class PDVSystem {
    constructor() {
        this.apiUrl = GOOGLE_SHEETS_API_URL;

        this.products = [];
        this.clients = [];
        this.cart = [];

        this.init();
    }

    init() {
        this.fetchProducts();
        this.setupEventListeners();
        this.renderUI();
    }

    async fetchProducts() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ acao: 'buscar_produtos' }),
            });
            const data = await response.json();
            if (data && Array.isArray(data)) {
                this.products = data;
                this.renderProducts();
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    }

    setupEventListeners() {
        // Eventos serão implementados aqui
    }

    renderUI() {
        document.querySelector('.main-content').innerHTML = `
            <div class="pdv-section">
                <h2>Ponto de Venda</h2>
                <input type="text" id="product-search" placeholder="Buscar produto pelo nome ou código" />
                <div id="product-list"></div>
                <h3>Carrinho</h3>
                <div id="cart-list"></div>
                <button id="finalize-sale">Finalizar Venda</button>
            </div>
        `;

        const searchInput = document.getElementById('product-search');
        searchInput.addEventListener('input', e => {
            this.renderProducts(e.target.value);
        });

        this.renderProducts();
    }

    renderProducts(filter = '') {
        const productList = document.getElementById('product-list');
        const filtered = this.products.filter(prod =>
            prod.nome.toLowerCase().includes(filter.toLowerCase()) ||
            prod.codigo.includes(filter)
        );

        productList.innerHTML = filtered
            .map(
                prod => `<div class="product-item">
            <span>${prod.codigo} - ${prod.nome} - R$ ${prod.preco_venda.toFixed(2)}</span>
            <button onclick="pdvSystem.addToCart('${prod.codigo}')">Adicionar</button>
        </div>`
            )
            .join('');
    }

    addToCart(productCode) {
        const product = this.products.find(p => p.codigo === productCode);
        if (!product) return alert('Produto não encontrado');

        const cartItem = this.cart.find(c => c.codigo === productCode);
        if (cartItem) {
            cartItem.quantidade++;
        } else {
            this.cart.push({ ...product, quantidade: 1 });
        }
        this.renderCart();
    }

    renderCart() {
        const cartList = document.getElementById('cart-list');
        if (!this.cart.length) {
            cartList.innerHTML = '<p>Carrinho vazio.</p>';
            return;
        }

        cartList.innerHTML = this.cart
            .map(
                item => `<div class="cart-item">
            <span>${item.nome} - Quantidade: ${item.quantidade} - R$ ${(item.preco_venda * item.quantidade).toFixed(2)}</span>
            <button onclick="pdvSystem.removeFromCart('${item.codigo}')">Remover</button>
        </div>`
            )
            .join('');
    }

    removeFromCart(productCode) {
        this.cart = this.cart.filter(item => item.codigo !== productCode);
        this.renderCart();
    }
}

// Inicializa o sistema PDV
const pdvSystem = new PDVSystem();
