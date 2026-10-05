export function selectGoogleTranslateLanguage(language) {
  const select = document.querySelector(".goog-te-combo");
  if (!select) return;

  select.value = language === "en" ? "" : language;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

export function clearGoogleTranslateCookies() {
  const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0";
  const paths = new Set(["/", window.location.pathname]);
  const hostname = window.location.hostname;
  const domains = ["", `; domain=${hostname}`, `; domain=.${hostname}`];

  paths.forEach((path) => {
    domains.forEach((domain) => {
      document.cookie = `${expired}; path=${path}${domain}`;
    });
  });

  document.documentElement.lang = "en";
}