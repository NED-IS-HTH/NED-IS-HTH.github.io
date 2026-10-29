// Stock Data Array
const S = [
  ["AAPL","Apple","US",228.4,0.8], ["MSFT","Microsoft","US",421.1,-0.4],
  ["NVDA","NVIDIA","US",131.9,2.9], ["TSLA","Tesla","US",248.7,-1.8],
  ["RELIANCE","Reliance","India",2910,0.5], ["TCS","Tata Consultancy","India",4120,-0.7],
  ["ASML","ASML","Europe",905,1.4], ["7203","Toyota","Asia",2830,0.9]
];

const IDX = [["S&P 500", 5760, 0.4], ["Nasdaq", 18190, 0.7], ["Nifty 50", 25050, 0.3], ["Sensex", 81900, 0.2]];

let saved = JSON.parse(localStorage.getItem("tb.saved") || "[]");
let key = localStorage.getItem("tb.key") || "";

const saveWatchlist = () => localStorage.setItem("tb.saved", JSON.stringify(saved));

function renderMarkets() {
  const il = document.getElementById("indices-list");
  if (!il) return;

  il.innerHTML = IDX.map(i => `<div class="card"><b>${i[0]}</b><br>${i[1]} <span class="${i[2]>=0?'up':'down'}">${i[2]}%</span></div>`).join("");

  const ml = document.getElementById("movers-list");
  ml.innerHTML = S.slice(0, 4).map(s => `<div class="card"><b>${s[0]}</b> (${s[1]})<br>$${s[3]} <span class="${s[4]>=0?'up':'down'}">${s[4]}%</span></div>`).join("");

  renderWatchlist();
}

function renderWatchlist() {
  const wl = document.getElementById("watchlist");
  if (!wl) return;
  const filtered = S.filter(s => saved.includes(s[0]));
  wl.innerHTML = filtered.length 
    ? filtered.map(s => `<div class="card"><b>${s[0]}</b> - $${s[3]} <span class="${s[4]>=0?'up':'down'}">${s[4]}%</span></div>`).join("") 
    : "<p>No stocks saved in your watchlist.</p>";
}

function renderTable() {
  const tb = document.getElementById("stocks-body");
  if (!tb) return;
  const q = (document.getElementById("q")?.value || "").toLowerCase();
  const reg = document.getElementById("reg")?.value || "All";

  const rows = S.filter(s => (reg === "All" || s[2] === reg) && (s[0] + s[1]).toLowerCase().includes(q));
  tb.innerHTML = rows.map(s => `
    <tr>
      <td><button onclick="toggleSave('${s[0]}')">${saved.includes(s[0]) ? '★' : '☆'}</button></td>
      <td><b>${s[0]}</b></td>
      <td>${s[1]}</td>
      <td>${s[2]}</td>
      <td>$${s[3]}</td>
      <td class="${s[4]>=0?'up':'down'}">${s[4]}%</td>
    </tr>
  `).join("") || `<tr><td colspan="6">No stocks match filter.</td></tr>`;
}

function toggleSave(sym) {
  saved = saved.includes(sym) ? saved.filter(x => x !== sym) : [...saved, sym];
  saveWatchlist();
  renderTable();
  renderWatchlist();
}

document.addEventListener("input", e => { if (e.target.id === "q") renderTable(); });
document.addEventListener("change", e => { if (e.target.id === "reg") renderTable(); });

document.addEventListener("click", e => {
  if (e.target.id === "clr") { saved = []; saveWatchlist(); renderWatchlist(); }
  if (e.target.id === "sk") {
    const val = document.getElementById("kin").value.trim();
    if (val) { localStorage.setItem("tb.key", val); alert("API Key saved locally!"); }
  }
  if (e.target.id === "dk") { localStorage.removeItem("tb.key"); alert("API Key removed."); }
});

// Initial load
renderMarkets();
renderTable();