import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";


const Options = () => {
  const [secretKey, setSecretKey] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.local.get(
      {
        secretKey: "",
        organization: ""
      },
      (items) => {
        setSecretKey(items.secretKey);
        setOrganization(items.organization);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.local.
    chrome.storage.local.set( { secretKey, organization },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options synchronized.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <form onSubmit={saveOptions}>
      <fieldset>
        <legend>enter your OpenAI credentials</legend>
        <div>
          <label htmlFor="secret">Secret Key: </label>
          <input type="text" name="secret" id="secret" placeholder="OpenAI Secret Key" onChange={e => setSecretKey(e.currentTarget.value)} value={secretKey}></input>
        </div>
        <div>
          <label htmlFor="org">Organization: </label>
          <input type="text" name="org" id="org" placeholder="OpenAI Organization" onChange={e => setOrganization(e.currentTarget.value)} value={organization}></input>
        </div>
      </fieldset>
      <div>{status}</div>
      <input type="submit" value="Save Options" />
    </form>
  );
};

//const root = createRoot(document.getElementById("root")!);
//const root:Element = document.getElementById("root") as Element;
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);