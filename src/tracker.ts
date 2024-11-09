declare global {
  interface Window {
    dataLayer: any[],
    posthog : {
      init: (token: string, options: { api_host: string, person_profiles: string }) => void,
      capture: (event: string, data: any) => void
    }
  }
}
export { /* make this a module so i can declare global */ }

// @ts-ignore
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
// initialize posthog
window.posthog.init('phc_R2VcYb99xpD3XEAuryuoNK6nlwxn0MRMlIpfl8Q23TQ',{api_host:'https://us.i.posthog.com', person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
});

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
  const event = 'view_dataset';
  const eventData = {
    name: tokens[1]
  };
  window.posthog.capture(event, eventData);

  const downloadButtons = document.querySelectorAll('a.resource-url-analytics');
  downloadButtons.forEach((button) => {
    const event = 'download_dataset';
    const dlEventData = { ...eventData, url : button.getAttribute('href') };
    /** fire custom event on "download dataset" */
    button.addEventListener('click', () => {
      window.dataLayer.push({
        event,
        ...dlEventData
      });
      window.posthog.capture(event, dlEventData);
    });
  });
}

// since this script is running in the MAIN world/context
// i can opportunistically delete elements from the resource
// preview pane that I know I will never use.
const GUID_REGEX = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
if (4 === tokens.length && 'dataset' === tokens[0] && 'resource' === tokens[2] && GUID_REGEX.test(tokens[3])) {
  document.querySelector('#content section.module.module-resource .module-content ul.nav.nav-tabs')?.remove();
  document.querySelector('#content section.module.module-resource .module-content div.resource-view')?.remove();
}