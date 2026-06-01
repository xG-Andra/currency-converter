const currencyFirstEl = document.getElementById("currency-first");
const worthFirstEl = document.getElementById("worth-first");
const currencySecondEl = document.getElementById("currency-second");
const worthSecondEl = document.getElementById("worth-second");
const exchangeRateEl = document.getElementById("exchange-rate");

function updateRate() {
  const amount = Number(worthFirstEl.value);
  if (!Number.isFinite(amount)) return;

  const base = currencyFirstEl.value;
  const target = currencySecondEl.value;

  fetch(`https://v6.exchangerate-api.com/v6/6fd7263e0ecc73d9d2c6670c/latest/${base}`)
    .then((res) => res.json())
    .then((data) => {
      const rate = data?.conversion_rates?.[target];
      if (!Number.isFinite(rate)) {
        exchangeRateEl.innerText = "Rate not available";
        worthSecondEl.value = "";
        return;
      }

      exchangeRateEl.innerText = `1 ${base} = ${rate} ${target}`;
      worthSecondEl.value = (amount * rate).toFixed(2);
    })
    .catch(() => {
      exchangeRateEl.innerText = "Failed to fetch exchange rate";
      worthSecondEl.value = "";
    });
}

currencyFirstEl.addEventListener("change", updateRate);
currencySecondEl.addEventListener("change", updateRate);
worthFirstEl.addEventListener("input", updateRate);

updateRate();
