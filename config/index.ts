import defaultConfig from "./config.default.ts";
import { IConfig } from "../types.ts";

const env: string | undefined = Deno.env.get("APP_ENV");

interface IConfigMap {
  default: IConfig;
  [s: string]: IConfig;
}

const configMap: IConfigMap = {
  default: defaultConfig,
};

export default typeof env === "undefined"
  ? configMap["default"]
  : configMap[env];
