import HttpException from './HttpException';

export default class NotFoundHttpException extends HttpException {
  constructor (response: Response, protected readonly bodyText: Record<string, any> | string = '', message: string = 'Not Found') {
    super(response, message);
  }
}
