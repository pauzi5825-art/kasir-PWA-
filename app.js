let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = [];

function addProduct() {
    const name = document.getElementById('prodName').value;
    const price = parseInt(document.getElementById('prodPrice').value);
    if (!name || isNaN(price)) return alert('Isi nama dan harga produk!');
    
    products.push({ id: Date.now(), name, price });
    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('prodName').value = '';
    document.getElementById('prodPrice').value = '';
    renderProducts();
}

function renderProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = '';
    products.forEach(p => {
        list.innerHTML += `
            <div class="item-row">
                <span>${p.name} - Rp ${p.price.toLocaleString('id-ID')}</span>
                <button onclick="addToCart(${p.id})">+ Tambah</button>
            </div>`;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        cartList.innerHTML += `<li>${item.name} - Rp ${item.price.toLocaleString('id-ID')}</li>`;
    });
    document.getElementById('totalPrice').innerText = total.toLocaleString('id-ID');
    calcChange();
}

function calcChange() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cash = parseInt(document.getElementById('cashInput').value) || 0;
    const change = cash - total;
    document.getElementById('changePrice').innerText = (change >= 0 ? change : 0).toLocaleString('id-ID');
}

function clearCart() {
    cart = [];
    document.getElementById('cashInput').value = '';
    renderCart();
}

function sendWhatsApp() {
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cash = parseInt(document.getElementById('cashInput').value) || 0;
    
    let text = `*STRUK PEMBAYARAN*\n------------------\n`;
    cart.forEach(item => {
        text += `${item.name}: Rp ${item.price.toLocaleString('id-ID')}\n`;
    });
    text += `------------------\n*Total:* Rp ${total.toLocaleString('id-ID')}\n*Bayar:* Rp ${cash.toLocaleString('id-ID')}\n*Kembali:* Rp ${(cash - total).toLocaleString('id-ID')}\n\nTerima kasih!`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

renderProducts();
