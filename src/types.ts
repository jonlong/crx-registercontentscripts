export type RegisterScriptPayload = {
  type: "registerContentScript";
  jsPath: string;
  matches: string[];
};
