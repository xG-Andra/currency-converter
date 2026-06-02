const currencyFirstEl = document.getElementById("currency-first");
const worthFirstEl = document.getElementById("worth-first");
const currencySecondEl = document.getElementById("currency-second");
const worthSecondEl = document.getElementById("worth-second");
const exchangeRateEl = document.getElementById("exchange-rate");
const optionsFirstEl = document.getElementById("options-first");
const optionsSecondEl = document.getElementById("options-second");
const currencyList = [
  "USD", "AUD", "AED", "ALL", "AMD", "ANG", "AOA", "ARS", "AWG", "AZN", 
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BSD", 
  "BTN", "BZD", "CAD", "CHF", "CLP", "CNY", "COP", "CRC", "CVE", "CZK", 
  "DJF", "DKK", "DOP", "DZD", "EUR", "EGP", "FJD", "FKP", "GBP", "GEL", 
  "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", 
  "HUF", "IDR", "INR", "ISK", "JMD", "JPY", "KES", "KGS", "KHR", "KMF", 
  "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", 
  "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", 
  "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", 
  "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", 
  "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", 
  "SHP", "SLL", "SOS", "SRD", "SSP", "STN", "SVC", "SYP", "SZL", "THB", 
  "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", 
  "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", 
  "YER", "ZAR"
];
let lastValidFirst = "USD";
let lastValidSecond = "IDR";

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

function populateDropdown(optionsEl, inputEl, isFirst) {
  optionsEl.innerHTML = "";
  currencyList.forEach((currency) => {
    const li = document.createElement("li");
    li.innerText = currency;
    
    li.addEventListener("click", () => {
      inputEl.value = currency;
      if (isFirst) lastValidFirst = currency;
      else lastValidSecond = currency;
      
      optionsEl.classList.remove("show"); 
      updateRate(); 
    });
    
    optionsEl.appendChild(li);
  });
}

function filterDropdown(optionsEl, query) {
  const items = optionsEl.getElementsByTagName("li");
  let hasMatch = false;

  for (let item of items) {
    if (item.innerText.toLowerCase().includes(query.toLowerCase())) {
      item.style.display = "block";
      hasMatch = true;
    } else {
      item.style.display = "none";
    }
  }
  
  if (!hasMatch && query !== "") {
  }
}

function validateInputOnClose(inputEl, isFirst) {
  const userTyped = inputEl.value.toUpperCase().trim();
  
  if (currencyList.includes(userTyped)) {
    inputEl.value = userTyped;
    if (isFirst) lastValidFirst = userTyped;
    else lastValidSecond = userTyped;
  } else {
    inputEl.value = isFirst ? lastValidFirst : lastValidSecond;
  }
  updateRate();
}

function setupSearchableDropdown(inputEl, optionsEl, isFirst) {
  populateDropdown(optionsEl, inputEl, isFirst);

  inputEl.addEventListener("focus", () => {
    optionsFirstEl.classList.remove("show");
    optionsSecondEl.classList.remove("show");
    optionsEl.classList.add("show");
    filterDropdown(optionsEl, inputEl.value);
  });

  inputEl.addEventListener("input", () => {
    optionsEl.classList.add("show");
    filterDropdown(optionsEl, inputEl.value);
  });
}

setupSearchableDropdown(currencyFirstEl, optionsFirstEl, true);
setupSearchableDropdown(currencySecondEl, optionsSecondEl, false);

document.addEventListener("click", (e) => {
  if (!currencyFirstEl.contains(e.target) && !optionsFirstEl.contains(e.target)) {
    optionsFirstEl.classList.remove("show");
    validateInputOnClose(currencyFirstEl, true);
  }
  if (!currencySecondEl.contains(e.target) && !optionsSecondEl.contains(e.target)) {
    optionsSecondEl.classList.remove("show");
    validateInputOnClose(currencySecondEl, false);
  }
});

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

  const base = currencyFirstEl.value.toUpperCase().trim();
  const target = currencySecondEl.value.toUpperCase().trim();

  if (!currencyList.includes(base) || !currencyList.includes(target)) {
    return;
  }

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

worthFirstEl.addEventListener("input", updateRate);

updateRate();
