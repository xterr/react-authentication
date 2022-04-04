export default interface GrantInterface {
  prepareRequestParameters (options: Record<string, string>): Record<string, string>;
}
