import defaultConfig from './config.default.ts';

const env: string | undefined = Deno.env.get('APP_ENV');

const configMap: Object = {
  default: defaultConfig
};

export default env ? configMap['default'] : configMap[env];
