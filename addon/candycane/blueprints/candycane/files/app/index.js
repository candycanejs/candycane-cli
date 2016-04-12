/**
 * Import express dependencies
 */
import Express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

/**
 * Import local router and application
 */
import Router from './router';
import app from './app';

const expressApp = Express();

app.singleton(`express`, expressApp);

expressApp.use(morgan(`dev`));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.json({ type: 'application/*+json' }));
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(cors());


const router = new Router(app);

router.registerRoutes();

export default expressApp;
