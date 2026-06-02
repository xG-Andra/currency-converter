const currencyFirstEl = document.getElementById("currency-first");
const worthFirstEl = document.getElementById("worth-first");
const currencySecondEl = document.getElementById("currency-second");
const worthSecondEl = document.getElementById("worth-second");
const exchangeRateEl = document.getElementById("exchange-rate");

function formatCurrencyID(value) {
  return Number(value).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function updateRate() {
  const rawInput = worthFirstEl.value.trim();

  if (rawInput === "") {
    exchangeRateEl.innerText = "";
    worthSecondEl.value = "";
    return;
  }

  const amount = Number(rawInput);

  if (!Number.isFinite(amount) || Number.isNaN(amount)) {
    exchangeRateEl.innerText = "Masukkan angka yang valid";
    worthSecondEl.value = "";
    return;
  }

  const base = currencyFirstEl.value;
  const target = currencySecondEl.value;

  fetch(`https://v6.exchangerate-api.com/v6/6fd7263e0ecc73d9d2c6670c/latest/${base}`)
    .then((res) => {
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    })
    .then((data) => {
      const rate = data?.conversion_rates?.[target];
      if (!Number.isFinite(rate)) {
        exchangeRateEl.innerText = "Kurs tidak tersedia";
        worthSecondEl.value = "";
        return;
      }

      exchangeRateEl.innerText = `1 ${base} = ${formatCurrencyID(rate)} ${target}`;
      
      worthSecondEl.value = formatCurrencyID(amount * rate);
    })
    .catch(() => {
      exchangeRateEl.innerText = "Gagal mengambil data kurs terkini";
      worthSecondEl.value = "";
    });
}

currencyFirstEl.addEventListener("change", updateRate);
currencySecondEl.addEventListener("change", updateRate);
worthFirstEl.addEventListener("input", updateRate);

updateRate();
