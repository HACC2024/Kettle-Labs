export {};
declare global {
  interface Window {
    dataLayer: any[]
  }
}
console.log("HACC24");

// parse the current URL and query string
const a = document.createElement('a');
a.href = window.location.href;

const tokens = a.pathname.split('/').filter(token => token.length);
const search = new URLSearchParams(a.search);


/** fire a custom event on searches */
if (1 === tokens.length && tokens[0] === 'dataset' && search.has('q')) {
  window.dataLayer.push({
    event: 'search',
    search_term: search.get('q')
  });
}