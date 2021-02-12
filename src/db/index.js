import mongoose from 'mongoose';
import Holymass from './models/holyMass';
import EveningPrayer from './models/eveningPrayer';
import ChurchMember from './models/churchMember';
import Phase from './models/phase';
import connectDb from './config';

export { Holymass,ChurchMember,EveningPrayer,Phase, connectDb };
