import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./components/App";


// parse the current URL and query string
const a = document.createElement('a');
a.href = window.location.href;

const tokens = a.pathname.split('/').filter(token => token.length);

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
        <App resourceId={resourceId} />
      </React.StrictMode>
    )
  }
}

export { /* need to treat this like a module so i can use typescript */ };
