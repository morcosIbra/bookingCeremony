
import { takeLatest, put, delay } from 'redux-saga/effects';
import { setBooking } from '../actions/booking';
import { GET_META_DATA, setCommon } from '../actions/common';

const getMetaData = function* () {
    try {
        yield delay(3000)
        const currentPhase = { start: new Date('7/1/2020'), end: new Date('7/23/2020') };
        const info = {
            title: 'معلومات مهمه',
            home: [
                'يمكنك حجز موعد قداس لاكثر من شخص عن طريق ادخال الرقم القومي لكل منهم',
                'كل قداس له عدد محدد من الحضور حتي نضمن سلامه الشعب في ظل الظروف الحاليه',
                `كل شخص له الحق في قداس واحد فقط من ١ يوليو و حتي ٢٣ يوليو`,
                'يمكنك تغيير الحجز أو الغاءه في حاله عدم امكانيه الذهاب في الموعد الذي تم حجزه',
                'من فضلك الغي الحجز في حاله عدم امكانيه الذهاب حتي تتيح الفرصه لشخص اخر',
                'عند دخول الكنيسه من فضلك اظهر رقم الحجز مع ما يثبت رقمك القومي (بطاقه أو شهاده ميلاد) حتي يسهل عمليه الدخول'
            ],
            members: ['يمكنك حجز موعد قداس لاكثر من شخص عن طريق ادخال الرقم القومي لكل منهم'],
            events: [`كل شخص له الحق في قداس واحد فقط من ١ يوليو و حتي ٢٣ يوليو`,
                'يمكنك تغيير الحجز أو الغاءه في حاله عدم امكانيه الذهاب في الموعد الذي تم حجزه',
            ],
            checkout: ['عند دخول الكنيسه من فضلك اظهر رقم الحجز مع ما يثبت رقمك القومي (بطاقه أو شهاده ميلاد) حتي يسهل عمليه الدخول'
            ]
        };
        yield put(setCommon('currentPhase', currentPhase));
        yield put(setCommon('info', { title: info.title, home: info.home }));
        yield put(setBooking('info', {
            members: info.members, events: info.events,
            checkout: info.checkout
        }));
    } catch (error) {
        yield put(setCommon(`reponse`, { ...error }));
    }

}


const watchers = [
    takeLatest(GET_META_DATA, getMetaData),
]
export default watchers;


