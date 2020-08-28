import moment from 'moment';

export const logo = 'مارجرجس حمامات القبه';
export const mainPage = 'الصفحه الرئيسيه';
export const address = 'العنوان';
export const admin = 'ادمن';

export const inputText = {
    usernameValidation: 'اسم المستخدم مطلوب',
    usernamePlaceholder: 'اسم المستخدم',
    isDeaconValidation: 'هل انت شماس',
    passwordValidation: 'كلمه السر مطلوبه',
    passwordPlaceholder: 'كلمه السر',
    id: 'الرقم القومي المكون من ۱٤ رقم',
    idAlreadyExist: 'هذا الرقم تم اضافته مسبقاً',
    maxAddedMembers: 'لا يمكن اضافه اكثر من خمسه اشخاص',
    name: 'الاسم رباعي كما هو موجود في البطاقه',
    mobilePlaceholder: 'رقم الموبايل',
    mobileValidation: 'رقم الموبايل المكون من ۱۱ رقم ويبدأ بصفر',
    streetValidation: 'اسم الشارع مطلوب',
    buildingValidation: 'رقم العماره مطلوب',
    apartmentValidation: 'رقم الشقة مطلوب',
    regionValidation: 'المنطقه مطلوبه',
    floorValidation: 'الدور مطلوب',
    event: 'لم يتم اختيار ميعاد من القائمه',
    streetPlaceholder: 'اسم الشارع',
    buildingPlaceholder: 'العماره',
    apartmentPlaceholder: 'الشقة',
    floorPlaceholder: 'الدور'
};
export const loginFailed = 'من فضلك تأكد من اسم المستخدم و كلمه السر'
export const homeTitle = 'حجز القداسات';
export const holymasses = 'قداسات';
export const holymass = 'قداس';
export const eveningPrayer = 'عشيه';
export const eveningPrayers = 'عشيات';
export const availableCeremonies = ceremony =>
    ceremony === 'holymass' ? `${holymasses} المتاحه حاليا` : `${eveningPrayers} المتاحه حاليا`

export const bookCeremony = 'حجز القداس';
export const startBooking = 'ابدء الحجز';
export const newBooking = 'حجز جديد';
export const pastBooking = 'حجوزات سابقه';
export const compInfo = 'اكمل البيانات';
export const addPerson = 'اضف اشخاص'
export const noPersonsAdded = 'لم يتم اضافه اشخاص بعد';
export const cantBook = `لا يمكن الحجز الان و يمكنك الحجز مره اخري بعد`;
export const cantDeleteBooking = type => {
    switch (type) {
        case 'past':
            return `لا يمكن الغاء حجز فات`;
        case 'late':
            return `لا يمكن الغاء الحجز بعد الساعه التاسعه ليلاً`;
        default:
            return `لا يمكن الغاء حجز فات`;;
    }
};
export const bookingDeleteWarning = 'ليتم هذا الحجز ,كل الحجوزات السابقه سوف تلغي ان وجدت';
export const region = 'منطقه';
export const chooseRegion = 'اختر المنطقه';
export const chooseCeremony = 'اختر الصلاه';
export const pastHolymasses = 'مواعيد فاتت';
export const comingHolymasses = 'مواعيد جايه';
export const hamammatElkoba = 'حمامات القبه';
export const kobriElkoba = 'كوبري القبه';
export const sarayaElkoba = 'سراي القبه'
export const manshetElbakry = 'منشيه البكري';
export const zeiton = 'زيتون';
export const maryAnbamousa = 'كنيسة العذراء و الانبا موسي';
export const other = 'اخري';
export const bookWillChange = `للقيام بحجز جديد يجب الغاء هذا الحجز`;
export const bookingCongestion = `هذه البيانات غير مسجله علي العضويه الكنسيه برجاء التواصل مع الكنيسه`
export const bookingCheckout = `يعتبر الحجز مؤكد في حاله عدم استقبال مكالمه تفيد عكس ذلك`
export const sagaFail = `لا يمكن اتمام العمليه من فضلك  اعد المحاوله لاحقاً`;
export const goOn = `استمرار`;
export const changeBooking = 'الغاء الحجز';
export const notChangeBooking = 'عدم الغاء الحجز';
export const removeBooking = 'الغاء الحجز';
export const removeBookingConfirm = `هل تريد ${removeBooking} ؟`;
export const removeMemberConfirm = `هل تريد حذف هذا الشخص و جميع حجوزاته نهائياً ؟`
export const no = `لا`;
export const yes = `نعم`;
export const canceling = 'الغاء';
export const accepted = 'موافق';
export const register = 'تسجيل';
export const login = 'تسجيل دخول';
export const logout = 'تسجيل خروج';

export const bookingExist = 'يوجد حجز بتاريخ';
export const noBookingExist = 'لا يوجد حجز مسبق';
export const bookingNum = 'رقم الحجز';
export const ceremony = 'قداس';
export const ticket = 'حجز';
export const deacon = 'شماس';
export const notDeacon = 'غير شماس';
export const isDeacon = 'هل انت شماس ؟';
export const noEventsFoundText = ceremony =>
    ceremony === 'holymass' ? `لا يوجد ${holymasses} متاحه حالياً` : `لا يوجد ${eveningPrayers} متاحه حالياً`
export const eventDateFormat = date => date ? moment(date).format('يوم dddd Do MMMM الساعه h:mm a') : '';
export const dayMonthFormat = date => date ? moment(date).format("Do MMM") : '';
export const active = 'نشط';
export const inactive = 'متوقف';
export const editMember = 'تعديل بيانات';
export const edit = 'تعديل';
export const update = 'update';
export const arNum = '٠١٢٣٤٥٦٧٨٩';

export const engToArNum = num => `${num}`.split('').map(digit => arNum[digit]).join('');
export const arToEngNum = num =>
    `${num}`.replace(/[\u0660-\u0669]/g, matched =>
        arNum.indexOf(matched)
    )
export const noSeats = seats => seats == 0 ? 'لا يوجد اماكن'
    : (seats >= 3 && seats <= 10) ? `${engToArNum(seats)} اماكن`
        : seats > 10 ? `${engToArNum(seats)} مكان`
            : seats == 2 ? 'مكانين فقط' : 'مكان واحد فقط'



