import content from "./content?script&module";

const script = document.createElement("script");
script.src = chrome.runtime.getURL(content);
script.type = "module";
document.head.prepend(script);
