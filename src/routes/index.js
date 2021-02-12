import holymass from './holymass';
import events from './events';
import churchmember from './churchmember';
import phase from './phase';

const routes = function (app) {
  app.use('/churchmember', churchmember);
  app.use('/phase', phase);
  app.use('/holymass', holymass);
  app.use('/events', events);
};

export default routes; 
