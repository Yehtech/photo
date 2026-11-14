// Keep deep links and inquiry selections when changing language.
document.addEventListener('click', event => {
  const link = event.target.closest('a.locale-switch');
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href, location.href);
  url.search = location.search;
  url.hash = location.hash;
  const types = JSON.parse(link.dataset.localeTypes || '{}');
  for (const key of ['type', 'package']) {
    const value = url.searchParams.get(key);
    if (value && types[value]) url.searchParams.set(key, types[value]);
  }
  link.href = url.href;
});
