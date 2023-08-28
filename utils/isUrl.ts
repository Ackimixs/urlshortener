import isUrl from "is-url";

export default (url: string): boolean => {
  return isUrl(url);
};
