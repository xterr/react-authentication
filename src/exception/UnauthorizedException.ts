import HttpException from './HttpException';

export default class UnauthorizedException extends HttpException {
  constructor (protected readonly response: Response, protected readonly bodyText: Record<string, any> | string = '', message: string = 'Unauthorized') {
    super(response, message);
  }
}
