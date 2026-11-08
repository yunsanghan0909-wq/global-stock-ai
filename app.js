
const API_BASE = "https://hidden-hall-3f54.yunsanghan0909.workers.dev";

const dateNode = document.getElementById("today");
if (dateNode) {
  dateNode.textContent = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(new Date());
}

async function getStockQuote(symbol) {
  try {
    const response = await fetch(
      `${API_BASE}/quote?symbol=${encodeURIComponent(symbol)}`
    );
    const data = await response.json();

    if (!response.ok || data.status === "error" || data.code) {
      throw new Error(data.message || "조회 실패");
    }

    return data;
  } catch (error) {
    console.error(symbol, error);
    return null;
  }
}

function formatPrice(value) {
  const n = Number(value);
  return Number.isFinite(n)
    ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "--";
}

function addLivePanel() {
  if (document.getElementById("liveStocks")) return;

  const section = document.createElement("section");
  section.id = "liveStocks";
  section.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:20px 0;";

  section.innerHTML = `
    <article class="market-card">
      <div class="card-top"><span>APPLE</span><span>AAPL</span></div>
      <div class="market-value" id="price-AAPL">불러오는 중</div>
      <div class="change" id="change-AAPL">조회 중...</div>
    </article>
    <article class="market-card">
      <div class="card-top"><span>MICROSOFT</span><span>MSFT</span></div>
      <div class="market-value" id="price-MSFT">불러오는 중</div>
      <div class="change" id="change-MSFT">조회 중...</div>
    </article>
    <article class="market-card">
      <div class="card-top"><span>NVIDIA</span><span>NVDA</span></div>
      <div class="market-value" id="price-NVDA">불러오는 중</div>
      <div class="change" id="change-NVDA">조회 중...</div>
    </article>
  `;

  const heading = document.querySelector(".page-heading");
  heading?.insertAdjacentElement("afterend", section);
}

async function updateStock(symbol) {
  const priceNode = document.getElementById(`price-${symbol}`);
  const changeNode = document.getElementById(`change-${symbol}`);

  const data = await getStockQuote(symbol);

  if (!data) {
    priceNode.textContent = "조회 실패";
    changeNode.textContent = "잠시 후 다시 시도";
    return;
  }

  priceNode.textContent = "$" + formatPrice(data.close);

  const percent = Number(data.percent_change);
  const change = Number(data.change);

  if (Number.isFinite(percent)) {
    changeNode.textContent =
      `${percent >= 0 ? "▲" : "▼"} ${Math.abs(percent).toFixed(2)}%`;
    changeNode.className = "change " + (percent >= 0 ? "positive" : "negative");
  } else {
    changeNode.textContent = "등락률 정보 없음";
  }
}

async function loadMarketData() {
  addLivePanel();

  await Promise.all(
    ["AAPL", "MSFT", "NVDA"].map(updateStock)
  );

  console.log("주가 데이터 갱신 완료:", new Date().toLocaleString("ko-KR"));
}

document.getElementById("refreshBtn")?.addEventListener("click", loadMarketData);

loadMarketData();
