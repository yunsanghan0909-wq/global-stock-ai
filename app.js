
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

// 주가 데이터 가져오기
async function getStockQuote(symbol) {
  try {
    const response = await fetch(
      `${API_BASE}/quote?symbol=${encodeURIComponent(symbol)}`
    );

    const data = await response.json();

    if (!response.ok || data.status === "error" || data.code) {
      throw new Error(data.message || data.message || "주가 조회 실패");
    }

    return data;
  } catch (error) {
    console.error(`${symbol} 조회 오류:`, error);
    return null;
  }
}

// 화면의 주가 표시 요소 업데이트
async function updateStock(symbol, elementId) {
  const data = await getStockQuote(symbol);
  const element = document.getElementById(elementId);

  if (!data || !element) return;

  const price = Number(data.close);

  if (Number.isFinite(price)) {
    element.textContent = price.toLocaleString("en-US", {
      maximumFractionDigits: 2
    });
  }
}

// 새로고침 버튼
document.getElementById("refreshBtn")?.addEventListener("click", () => {
  window.location.reload();
});

// API 연결 확인용
async function testStockAPI() {
  const apple = await getStockQuote("AAPL");

  if (apple) {
    console.log("Apple 주가 데이터 연결 성공:", apple);
  } else {
    console.log("Apple 주가 데이터 연결 실패");
  }
}

testStockAPI();
