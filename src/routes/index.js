import messenger from './messenger';
import holymass from './holymass';
import confession from './confession';
const routes = function (app) {
  app.use('/messenger', messenger);
  app.use('/holymass', holymass);
  app.use('/confession', confession);

};

export default routes; 
