import { useState, useEffect, useMemo } from "react";
import browser from "webextension-polyfill";
import { RegisterScriptPayload } from "../types";
import contentScriptUrl from "../content/inject?script&module";
import "./style.css";

function Popup() {
  const [hasPermission, setHasPermission] = useState(false);
  const contentScriptPayload: RegisterScriptPayload = useMemo(
    () => ({
      type: "registerContentScript",
      jsPath: contentScriptUrl,
      matches: ["https://www.youtube.com/*"],
    }),
    []
  );

  useEffect(() => {
    chrome.permissions.contains(
      {
        origins: contentScriptPayload.matches,
      },
      async (result) => {
        if (result) {
          await browser.runtime.sendMessage(contentScriptPayload);

          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      }
    );
  }, [hasPermission, contentScriptPayload]);

  function handleClick() {
    if (!hasPermission) {
      chrome.permissions.request(
        {
          origins: contentScriptPayload.matches,
        },
        async (granted) => {
          if (granted) {
            await browser.runtime.sendMessage(contentScriptPayload);
          }
        }
      );
    }
  }

  return (
    <div className="popup">
      {hasPermission ? (
        <div>
          <h1>You have permission!</h1>
          <p>The script should be injected in the page.</p>
        </div>
      ) : (
        <div>
          <h1 className="title">Grant Permission</h1>
          <div className="card">
            <p>
              This is an explanation about why we're going to request these
              permissions.
            </p>
            <p>
              Included is a heads-up about the warnings they'll give when you're
              prompted to accept them, and details about exactly what we use it
              for.{" "}
            </p>
            <button className="button" onClick={handleClick}>
              Grant Permission for YouTube
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Popup;
