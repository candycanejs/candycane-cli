import config from './config/environment'
import Application from 'candycane/dist/foundation/application';

const app = new Application({
  config,
  projectDir: __dirname,
});

app.boot();

debugger;

export default app;
