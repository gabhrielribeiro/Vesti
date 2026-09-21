const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const page = document.querySelector('#productPage');
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));

function whatsappLink(phone, productName) {
  const number = (phone || '').replace(/\D/g, '');
  const text = encodeURIComponent(`Olá! Tenho interesse em ${productName}. Gostaria de saber mais sobre disponibilidade.`);
  return `https://wa.me/${number}?text=${text}`;
}

async function init() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Não foi possível carregar o catálogo.');
    const data = await response.json();
    const product = (data.products || []).find(item => item.id === productId);
    if (!product) {
      page.innerHTML = '<section class="product-error"><h1>Produto não encontrado</h1><a class="btn primary" href="index.html#produtos">Voltar ao catálogo</a></section>';
      return;
    }

    document.title = `${product.name} | ${data.store?.name || 'Vesti'}`;
    const storePhone = data.store?.whatsapp || '';
    document.querySelector('#footerWhatsApp').href = whatsappLink(storePhone, 'os produtos do catálogo');
    page.innerHTML = `
      <a class="product-back" href="index.html#produtos">← Voltar para produtos</a>
      <div class="product-detail">
        <div class="product-image-wrap"><img src="${product.image}" alt="${product.name}"></div>
        <div class="product-content">
          <p class="eyebrow">${product.category}</p>
          <h1>${product.name}</h1>
          <p class="product-price">${money(product.price)}</p>
          <p class="product-description">${product.description}</p>
          <div class="product-meta"><p><strong>Tamanhos disponíveis</strong><span>${(product.sizes || []).join(', ')}</span></p><p><strong>Cores disponíveis</strong><span>${(product.colors || []).join(', ')}</span></p></div>
          <a class="btn primary product-whatsapp" target="_blank" rel="noopener" href="${whatsappLink(storePhone, product.name)}">Consultar pelo WhatsApp →</a>
        </div>
      </div>`;
  } catch (error) {
    console.error(error);
    page.innerHTML = '<section class="product-error"><h1>Não foi possível carregar o produto.</h1><p>Confira se está usando um servidor local.</p><a class="btn primary" href="index.html#produtos">Voltar ao catálogo</a></section>';
  }
}

init();