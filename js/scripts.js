// The locale our app first shows
const defaultLocale = "fr";
const supportedLocales = ["en", "de", "fr", "nl"];

// The active locale
let locale;

// Gets filled with active locale translations
let translations = {};

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
  const initialLocale = 
    supportedOrDefault(browserLocales(true));
  // Translate the page to the default locale
  setLocale(initialLocale);
  bindLocaleSwitcher(initialLocale);
});

function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale,
  );
}
// Whenever the user selects a new locale, we
// load the locale's translations and update
// the page
function bindLocaleSwitcher(initialValue) {
  const switcher = 
    document.querySelector("[data-i18n-switcher]");
  switcher.value = initialValue;
  switcher.onchange = (e) => {
    // Set the locale to the selected option[value]
    setLocale(e.target.value);
  };
}

function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}
// Retrieve the first locale we support from the given
// array, or return our default locale
function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}

// Load translations for the given locale and translate
// the page to this locale
async function setLocale(newLocale) {
  if (newLocale === locale) return;

  const newTranslations = 
    await fetchTranslationsFor(newLocale);

  locale = newLocale;
  translations = newTranslations;

  translatePage();
  loadDatas(locale, `/data/drinks.json`, `drinksdivcontainer`);
  loadDatas(locale, `/data/food.json`, `fooddivcontainer`);
}

// Retrieve translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`/lang/${newLocale}.json`);
  return await response.json();
}
async function fetchData(path) {
  const response = await fetch(path);
  return await response.json();
}

// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
  document
    .querySelectorAll("[data-i18n-key]")
    .forEach(translateElement);
}

// Replace the inner text of the given HTML element
// with the translation in the active locale,
// corresponding to the element's data-i18n-key
function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  const translation = translations[key];
  element.innerText = translation;
}

async function loadDatas(locale, filename, divname) {  
  var datas = await fetchData(filename);
  var employess = datas[locale];
  var tablecolumns = [];
  for (var i = 0; i < employess.length; i++) {
      for (var key in employess[i]) {
          if (tablecolumns.indexOf(key) === -1) {
              tablecolumns.push(key);
          }
      }
  }

  //Creating html table and adding class to it
  var tableemployee = document.createElement("table");
  tableemployee.classList.add("table");
  tableemployee.classList.add("table-striped");
  tableemployee.classList.add("table-bordered");
  tableemployee.classList.add("table-hover")

  //Creating header of the HTML table using
  //tr
  var tr = tableemployee.insertRow(-1);

  for (var i = 0; i < tablecolumns.length; i++) {
      //header
      var th = document.createElement("th");
      th.innerHTML = tablecolumns[i];
      tr.appendChild(th);
  }

  // Add employee JSON data in table as tr or rows
  for (var i = 0; i < employess.length; i++) {
      tr = tableemployee.insertRow(-1);
      for (var j = 0; j < tablecolumns.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = employess[i][tablecolumns[j]];
      }
  }

  //Final step , append html table to the container div
  var employeedivcontainer = document.getElementById(divname);
  employeedivcontainer.innerHTML = "";
  employeedivcontainer.appendChild(tableemployee);
}