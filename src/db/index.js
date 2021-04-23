import mongoose from 'mongoose';
import UserForm from './models/userForm';
import Confession from './models/confession';
import Holymass from './models/holyMass';
import Pascha from './models/pascha';
import EveningPrayer from './models/eveningPrayer';
import ChurchMember from './models/churchMember';
import Phase from './models/phase';
import Reservation from './models/reservation';
import connectDb from './config';

export { UserForm,Confession,Holymass,Pascha,EveningPrayer,ChurchMember,Phase,Reservation, connectDb };
