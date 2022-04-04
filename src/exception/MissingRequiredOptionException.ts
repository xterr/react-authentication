export default class MissingRequiredOptionException extends Error {
  constructor (private readonly option: string) {
    super(`The option "${ option }" is required but missing`);
  }
}
