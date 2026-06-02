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

function setTargetContent(element, content, elementId) {
  if (!element) {
    console.warn(`[Peringatan] Elemen dengan ID "${elementId}" tidak ditemukan di HTML. Periksa ejaannya!`);
    return;
  }
  
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    element.value = content;
  } else {
    
    element.innerText = content;
  }
}

function updateRate() {
  const rawInput = worthFirstEl.value.trim();

  if (rawInput === "") {
    exchangeRateEl.innerText = "";
    setTargetContent(worthSecondEl, "", "worth-second");
    return;
  }

  const amount = Number(rawInput);
  
  if (!Number.isFinite(amount) || Number.isNaN(amount)) {
    exchangeRateEl.innerText = "Masukkan angka yang valid";
    setTargetContent(worthSecondEl, "", "worth-second");
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
        setTargetContent(worthSecondEl, "", "worth-second");
        return;
      }

      exchangeRateEl.innerText = `1 ${base} = ${formatCurrencyID(rate)} ${target}`;
      
      const totalHasil = formatCurrencyID(amount * rate);
      setTargetContent(worthSecondEl, totalHasil, "worth-second");
    })
    .catch(() => {
      exchangeRateEl.innerText = "Gagal mengambil data kurs terkini";
      setTargetContent(worthSecondEl, "", "worth-second");
    });
}

currencyFirstEl.addEventListener("change", updateRate);
currencySecondEl.addEventListener("change", updateRate);
worthFirstEl.addEventListener("input", updateRate);

updateRate();
