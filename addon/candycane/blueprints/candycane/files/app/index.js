/**
 * Import express dependencies
 */
import Express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

/**
 * Import local router and application
 */
import Router from './router';
import app from './app';

const expressApp = new Express();

app.singleton(`express`, expressApp);

expressApp.use(morgan(`dev`));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

const router = new Router(app, container);

router.registerRoutes();
