import moment from 'moment';

export const logo = 'مارجرجس حمامات القبه';
export const mainPage = 'الصفحه الرئيسيه';
export const inputText = {
    id: 'الرقم القومي المكون من ۱٤ رقم',
    idAlreadyExist: 'هذا الرقم تم اضافته مسبقاً',
    name: 'الاسم رباعي كما هو موجود في البطاقه',
    mobile: 'رقم الموبايل المكون من ۱۱ رقم ويبدأ بصفر',
    event: 'لم يتم اختيار موعد قداس'
};
export const homeTitle = 'حجز القداسات';
export const bookCeremony = 'حجز القداس';
export const startBooking = 'ابدء الحجز';
export const pastBooking = 'حجوزات سابقه';
export const addPerson = 'اضف شخص';
export const noPersonsAdded = 'لم يتم اضافه اشخاص بعد';
export const cantBook = `لا يمكن الحجز مره اخري قبل`
export const bookWillChange = `سوف يتم تغيير هذا الحجز في حاله حجز جديد`;
export const bookingCongestion = `نعتذر عن الحجز في هذه الفتره نظراً للعدد الهائل من الحجوزات`
export const goOn = `استمرار`;
export const changeBooking = 'تغيير الحجز';
export const removeBooking = 'الغاء الحجز';
export const removeBookingConfirm = `هل تريد ${removeBooking} ؟`;
export const no = `لا`;
export const yes = `نعم`;
export const canceling = 'الغاء';
export const bookingExist = 'يوجد حجز بتاريخ';
export const bookingNum = 'رقم الحجز';
export const ceremony = 'قداس';
export const ticket = 'حجز';

export const eventDateFormat = date => date ? moment(date).format('يوم dddd Do MMMM الساعه h a') : '';
export const dayMonthFormat = date => date ? moment(date).format("Do MMM") : '';

export const arNum = '٠١٢٣٤٥٦٧٨٩';
export const engToArNum = num => `${num}`.split('').map(digit => arNum[digit]).join('');
export const arToEngNum = num =>
    `${num}`.replace(/[\u0660-\u0669]/g, matched =>
        arNum.indexOf(matched)
    )
export const noSeats = seats => (seats >= 3 && seats <= 10) ? `${engToArNum(seats)} اماكن`
    : seats > 10 ? `${engToArNum(seats)} مكان`
        : seats === 2 ? 'مكان واحد فقط' : 'مكانين فقط'


