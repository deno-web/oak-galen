import { Application } from 'https://deno.land/x/oak/mod.ts';
import { IApplication } from './types.ts';

const app: IApplication = new Application();

export default app;
