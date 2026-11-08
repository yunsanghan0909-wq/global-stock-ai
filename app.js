
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
      throw new Error(data.message || "API 조회 실패");
    }

    return data;
  } catch (error) {
    console.error(symbol, error);
    return null;
  }
}

function formatPrice(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : "--";
}

async function loadMarketData() {
  const symbols = ["AAPL", "MSFT", "NVDA"];

  const results = await Promise.all(
    symbols.map(symbol => getStockQuote(symbol))
  );

  console.log("시장 데이터:", results);
}

document.getElementById("refreshBtn")?.addEventListener("click", () => {
  loadMarketData();
});

loadMarketData();
