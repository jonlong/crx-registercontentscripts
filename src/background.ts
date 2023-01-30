import browser from "webextension-polyfill";
import { RegisterScriptPayload } from "./types";

browser.runtime.onMessage.addListener(
  async (payload: RegisterScriptPayload) => {
    // Listen for a specific message type
    if (payload.type === "registerContentScript") {
      // Unregister script if it exists already
      const existingScript =
        await chrome.scripting.getRegisteredContentScripts();

      if (existingScript[0]) {
        await chrome.scripting.unregisterContentScripts({
          ids: existingScript.map((s) => s.id),
        });
      }

      /**
       * Register script
       *
       * Using promise methods here just to log these responses
       * for demo purposes.
       *
       * Example taken from:
       * https://developer.chrome.com/docs/extensions/mv3/content_scripts/#dynamic-declarative
       */
      chrome.scripting
        .registerContentScripts([
          {
            id: "content",
            js: [payload.jsPath],
            matches: payload.matches,
            runAt: "document_start",
            world: "MAIN",
          },
        ])
        .then(() => console.log("registration complete"))
        .catch((err) => console.warn("unexpected error", err));
    }

    /**
     * don't return anything for un-handled messages
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#addlistener_syntax
     */
    return false;
  }
);
