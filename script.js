// Get DOM elements
const loaderEl = document.querySelector('.loader');
const rowsEl = document.querySelector('.rows');
const container = document.querySelector('.container');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const footer = document.querySelector('.footer');
const coinIndex = document.getElementById('coin-index');
const pageIndex = document.getElementById('page-index');

// App object
let app = {
  index: 9,
  page: 1,
  hasStarted: false,
};

// Start app
initPage();

// Update data automatically
setInterval(updateData, 30000);

// Event listeners
nextBtn.addEventListener('click', () => {
  prevBtn.disabled = false;
  if (app.index === 49) {
    nextBtn.disabled = true;
  } else {
    loadPage('next');
    app.page++;
  }
});
prevBtn.addEventListener('click', () => {
  nextBtn.disabled = false;
  if (app.index === 9) {
    prevBtn.disabled = true;
  } else {
    loadPage('prev');
    app.page--;
  }
});

// Functions
async function getData() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins');
    const data = await res.json();
    return data;
  } catch (err) {
    alert(err);
  }
}

async function initPage() {
  try {
    renderSpinner(loaderEl);

    const data = await getData();

    showCoin(data, app.index);

    app.hasStarted = true;
  } catch (err) {
    alert(err);
  }
}

async function updateData() {
  try {
    const data = await getData();
    rowsEl.innerHTML = '';

    showCoin(data, app.index);
    console.log('refreshed');
  } catch (err) {
    alert(err);
  }
}

function showCoin(coin, index) {
  for (let i = index; i >= index - 9; i--) {
    const Coin = {
      position: i + 1,
      image: coin[i].image.large,
      symbol: coin[i].symbol,
      price: coin[i].market_data.current_price.usd,
      change1hr: coin[i].market_data.price_change_percentage_1h_in_currency.usd,
      change24hr: coin[i].market_data.price_change_percentage_24h_in_currency.usd,
      change7d: coin[i].market_data.price_change_percentage_7d_in_currency.usd,
      high24h: coin[i].market_data.high_24h.usd,
      marketCap: coin[i].market_data.total_volume.usd,
    };

    const markup = `
    <div class="row">
    <div class="piece position">
    <p>${Coin.position}</p>
    </div>
    <div>
    <img class="piece thumb" src="${Coin.image}" alt="" />
    </div>
    <div class="piece name">
    <p>${Coin.symbol.toUpperCase()}</p>
    </div>
    <div class="piece price">
    <p>$${Coin.price}</p>
    </div>
    <div class="piece 1h">
    ${setColor(Coin.change1hr)}
    </div>
    <div class="piece 24h">
    ${setColor(Coin.change24hr)}
    </div>
    <div class="piece 7d">
    ${setColor(Coin.change7d)}
    </div>
    <div class="piece 24h-high">
    <p>$${Coin.high24h}</p>
    </div>
    <div class="piece market-cap">
    <p>$${Coin.marketCap}</p>
    </div>
    </div>
    `;

    loaderEl.innerHTML = '';
    rowsEl.insertAdjacentHTML('afterbegin', markup);
  }

  updatePageInfo(app.index, app.page);
}

function renderSpinner(parentEl) {
  const markup = `
  <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  `;

  parentEl.insertAdjacentHTML('afterbegin', markup);
}

function setColor(percentage) {
  if (percentage <= 0) {
    return `<p style="color: red">${percentage.toFixed(2)}%</p>`;
  } else {
    return `<p style="color: green">${percentage.toFixed(2)}%</p>`;
  }
}

function loadPage(page) {
  rowsEl.innerHTML = '';
  page === 'next' ? (app.index += 10) : (app.index -= 10);

  console.log(app);
  initPage();
}

function updatePageInfo(index, page) {
  coinIndex.textContent = `Currently showing coins #${index - 8} - #${index + 1}`;
  pageIndex.textContent = `Currently showing page ${page} of 5`;

  if (app.page === 1) {
    prevBtn.classList.add('disabled');
  } else if (app.page === 5) {
    nextBtn.classList.add('disabled');
  } else {
    prevBtn.classList.remove('disabled');
    nextBtn.classList.remove('disabled');
  }
}
