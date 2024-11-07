import posthog from 'posthog-js'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

// initialize posthog
posthog.init('phc_R2VcYb99xpD3XEAuryuoNK6nlwxn0MRMlIpfl8Q23TQ',{api_host:'https://us.i.posthog.com', person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
});

// parse the current URL and query string
const a = document.createElement('a');
a.href = window.location.href;

const tokens = a.pathname.split('/').filter(token => token.length);
const search = new URLSearchParams(a.search);


/** fire a custom event on searches */
if (1 === tokens.length && tokens[0] === 'dataset' && search.has('q')) {
  const event = 'search';
  const eventData = {
    search_term: search.get('q')
  };
  window.dataLayer.push({
    event,
    ...eventData
  });
  posthog.capture(event, eventData);
}
/** fire custom event on "view dataset" */
else if (2 === tokens.length && tokens[0] === 'dataset') {

  // fetch package from api
  fetch(`/api/3/action/package_show?id=${tokens[1]}`).then(async response => {
    const data = await response.json();
    const dataset = data.result;
    const eventData = {
      id: dataset.id,
      name : dataset.name,
      title : dataset.title,
      tags : dataset.tags && dataset.tags.length ? dataset.tags.map((tag: { name: string; }) => tag.name) : []
    }
    const event = 'view_dataset';
    window.dataLayer.push({
      event,
      ...eventData
    });
    posthog.capture(event, eventData);

    // after I have metadata from package
    // add listener to download buttons
    const downloadButtons = document.querySelectorAll('a.resource-url-analytics');
    downloadButtons.forEach((button) => {
      const event = 'download_dataset';
      const dlEventData = { ...eventData, url : button.getAttribute('href') };
      button.addEventListener('click', () => {
        window.dataLayer.push({
          event,
          ...dlEventData
        });
        posthog.capture(event, dlEventData);
      });
    });
  });
}



export { /* need to treat this like a module so i can use typescript */ };
