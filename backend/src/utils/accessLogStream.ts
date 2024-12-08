import fs from "fs";
import path from "path";
/**
 * @description Create a write stream for the access log
 * @param dirname
 * @returns fs.WriteStream
 * @example const accessLogStream = accessLogStream(__dirname);
 *
 */
export const accessLogStream = (dirname: string) =>
  fs.createWriteStream(path.join(dirname, "access.log"), { flags: "a" });
