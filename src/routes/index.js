import messenger from './messenger';
const routes = function (app) {
  app.use('/messenger', messenger);
}
export default routes; 
