export default class RedirectException extends Error {
  constructor (private readonly url: URL) {
    super();
  }

  public getUrl (): URL {
    return this.url;
  }
}
