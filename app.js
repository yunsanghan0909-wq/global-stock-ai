const dateNode = document.getElementById("today");
if (dateNode) {
  dateNode.textContent = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "short"
  }).format(new Date());
}
document.getElementById("refreshBtn")?.addEventListener("click", () => {
  window.location.reload();
});
