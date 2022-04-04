export default class HttpException extends Error {
  constructor (protected readonly response: Response, protected readonly bodyText: Record<string, any> | string = '', message: string = '') {
    super(`${ [ message, response.statusText ].join(', ') }. Status Code: ${ response.status }`);
  }

  getResponse (): Response {
    return this.response;
  }

  getBodyText (): Record<string, any> | string {
    return this.bodyText;
  }
}
