export function processEXML(contents: string): XMLDocument {
  const parser = new DOMParser();
  const returnValue = parser.parseFromString(contents, "text/xml");
  return returnValue;
}
