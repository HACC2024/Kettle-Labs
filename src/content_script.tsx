import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./components/App";


declare global {
  interface Window {
    dataLayer: any[],
    posthog : {
      init: (token: string, options: { api_host: string, person_profiles: string }) => void,
      capture: (event: string, data: any) => void
    }
  }
}
// @ts-ignore
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
// initialize posthog
window.posthog.init('phc_R2VcYb99xpD3XEAuryuoNK6nlwxn0MRMlIpfl8Q23TQ',{api_host:'https://us.i.posthog.com', person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
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
  window.posthog.capture(event, eventData);
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
    window.posthog.capture(event, eventData);

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
        window.posthog.capture(event, dlEventData);
      });
    });
  });
}

// if this is a resource preview page
// then i can introduce some markup to the page
const GUID_REGEX = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
if (4 === tokens.length && 'dataset' === tokens[0] && 'resource' === tokens[2] && GUID_REGEX.test(tokens[3])) {
  console.log("running resource preview page");
  const resourceId:string = tokens[3];
  const descriptionElement = document.querySelector('#content section.module.module-resource .module-content .prose.notes');
  if (!!descriptionElement) { // if the description element exists
    const div = document.createElement('div');
    div.id = 'hacc-root';
    //div.attachShadow({mode: 'open'});
    descriptionElement!.insertAdjacentElement("afterend", div);
    const root = createRoot(div);
    root.render(
      <React.StrictMode>
        <App resourceId={resourceId} track={ window.posthog.capture } />
      </React.StrictMode>
    )
  }
}


export { /* need to treat this like a module so i can use typescript */ };
