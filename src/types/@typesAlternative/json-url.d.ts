/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-default-export */

/**
 * @see https://github.com/masotime/json-url/issues/7
 */
declare module "json-url" {
  // declare module "json-url/dist/browser/json-url" {
  type Codec<TSrc extends object> = {
    compress: (obj: TSrc) => Promise<string>
    decompress: (str: string) => Promise<TSrc>
    stats: (
      obj: TSrc
    ) => Promise<{
      compressedencoded: any
      compression: any
      rawencoded: any
    }>
  }

  type CodecName = "lzw" | "lzma" | "lzstring" | "pack"

  const jsonurl: <TSrc extends object>(codecName: CodecName) => Codec<TSrc>

  export default jsonurl
}
