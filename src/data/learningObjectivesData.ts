export type LearningObjective = {
  id: string;
  category: string;
  statement: string;
};

export const LEARNING_OBJECTIVES: LearningObjective[] = [
  // 1. شکایت اصلی و اطلاعات دموگرافیک اولیه
  { id: 'demographics-name', category: 'شکایت اصلی و اطلاعات دموگرافیک اولیه', statement: 'نام و نام خانوادگی بیمار را پرسید.' },
  { id: 'demographics-age', category: 'شکایت اصلی و اطلاعات دموگرافیک اولیه', statement: 'سن بیمار را پرسید.' },
  { id: 'demographics-chief-complaint', category: 'شکایت اصلی و اطلاعات دموگرافیک اولیه', statement: 'علت اصلی مراجعه بیمار به بیمارستان را پرسید.' },
  
  // 2. توصیف بیماری کنونی
  { id: 'hpi-onset', category: 'توصیف بیماری کنونی', statement: 'نحوه ی شروع درد را پرسید.(ناگهانی یا آرام)' },
  { id: 'hpi-location', category: 'توصیف بیماری کنونی', statement: 'محل درد را پرسید.' },
  { id: 'hpi-radiation', category: 'توصیف بیماری کنونی', statement: 'محل انتشار درد را پرسید.' },
  { id: 'hpi-duration', category: 'توصیف بیماری کنونی', statement: 'مدت زمان هر اپیزود درد را پرسید.' },
  { id: 'hpi-frequency', category: 'توصیف بیماری کنونی', statement: 'تعداد یا فرکانس حملات درد را پرسید.' },
  { id: 'hpi-quality', category: 'توصیف بیماری کنونی', statement: 'کیفیت(نوع یا ماهیت) درد را پرسید.' },
  { id: 'hpi-severity', category: 'توصیف بیماری کنونی', statement: 'شدت درد را پرسید.' },
  { id: 'hpi-aggravating-factors', category: 'توصیف بیماری کنونی', statement: 'عواملی که منجر به تشدید درد می شود را پرسید.' },
  { id: 'hpi-relieving-factors', category: 'توصیف بیماری کنونی', statement: 'عواملی که منجر به بهبود درد می شود را پرسید.' },
  { id: 'hpi-associated-symptoms', category: 'توصیف بیماری کنونی', statement: 'علائم همراه با درد را پرسید.(تهوع، استفراغ، احساس ضعف شدید، بی حالی، رنگ پریدگی، تنگی نفس)' },
  { id: 'hpi-related-info', category: 'توصیف بیماری کنونی', statement: 'اطلاعات مرتبط با شکایت اصلی(علت مراجعه اصلی) را پرسید.' },
  { id: 'hpi-referral-method', category: 'توصیف بیماری کنونی', statement: 'نحوه ی مراجعه بیمار به مرکز درمانی را پرسید.' },

  // 3. سابقه بیماری
  { id: 'pmh-underlying-disease', category: 'سابقه بیماری', statement: 'سابقه ی بیماری زمینه ای قبلی را پرسید.' },
  { id: 'pmh-surgeries', category: 'سابقه بیماری', statement: 'سابقه ی جراحی، زمان ، نوع و علت آن را پرسید.' },
  { id: 'pmh-hospitalizations', category: 'سابقه بیماری', statement: 'سابقه ی بستری، زمان، نوع بستری، علت و مدت آن را پرسید.' },
  { id: 'pmh-psychiatric-history', category: 'سابقه بیماری', statement: 'سابقه ی بیماری روانپزشکی، زمان  و نوع تشخیص، دفعات و علت بستری را پرسید.' },
  
  { id: 'pmh-allergies', category: 'سابقه بیماری', statement: 'سابقه ی آلرژی یا حساسیت دارویی/غذایی/فصلی را پرسید.' },
  { id: 'pmh-vaccinations', category: 'سابقه بیماری', statement: 'سابقه ی واکسیناسیون را پرسید.' },

  // 4. مرور سیستم‌ها
  { id: 'ros-general', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با وضعیت عمومی پرسید. (تب، کاهش وزن، تعریق شبانه)' },
  { id: 'ros-skin', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با پوست پرسید. (راش، خارش، تغییر رنگ پوست)' },
  { id: 'ros-head-neck', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با سر و گردن پرسید. (سردرد، سرگیجه، تاری دید، کاهش شنوایی، وزوز گوش، خون‌ریزی بینی، مشکلات سینوس‌ها، خونریزی لثه، مراجعه اخیر به دندانپزشک، خشکی دهان، دندان مصنوعی، خشونت صدا)' },
  { id: 'ros-respiratory', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با سیستم تنفسی پرسید. (سرفه، خلط، تنگی نفس، درد هنگام تنفس)' },
  { id: 'ros-cardiovascular', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با سیستم قلبی-عروقی پرسید. (فشار خون، درد قفسه سینه، تپش قلب، تب روماتیسمی، تورم اندام‌ها)' },
  { id: 'ros-peripheral-vascular', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با عروق محیطی پرسید. (درد ساق پا، شرح حال رینود، رگ واریسی)' },
  { id: 'ros-gastrointestinal', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با دستگاه گوارش پرسید. (مشکل بلع، تهوع/استفراغ، یبوست/اسهال، درد شکم/تغییر در شکل و قوام مدفوع، مدفوع سیاه، خون در مدفوع)' },
  { id: 'ros-urinary', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با دستگاه ادراری پرسید. (سوزش ادرار، افزایش حجم ادرار، افزایش دفعات ادرار، تغییر رنگ ادرار، درد پهلو، سنگ کلیه)' },
  { id: 'ros-genital', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با دستگاه تناسلی پرسید. مرد: (فتق، ترشح از پنیس، درد یا توده یا تورم بیضه، سابقه STD، عملکرد و میل جنسی) زن: (وضعیت قاعدگی، ترشح واژینال، درد یا خارش واژینال، درد هنگام آمیزش، عملکرد و میل جنسی)' },
  { id: 'ros-musculoskeletal', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با دستگاه اسکلتی-عضلانی پرسید. (درد مفاصل، تورم مفاصل، محدودیت حرکت، کمردرد)' },
  { id: 'ros-neurological', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با سیستم عصبی پرسید. (تشنج، سکته مغزی، اختلال در راه رفتن، اختلال در تکلم، اختلال در حافظه)' },
  { id: 'ros-endocrine', category: 'مرور سیستم‌ها', statement: 'موارد زیر را در رابطه با سیستم غدد پرسید. (عدم تحمل گرما/سرما، تعریق زیاد، تشنگی زیاد، پرنوشی، پرادراری)' },

  // 5. سابقه دارویی
  { id: 'meds-name', category: 'سابقه دارویی', statement: 'نام داروهای مصرفی را پرسید.' },
  { id: 'meds-dose', category: 'سابقه دارویی', statement: 'دوز داروهای مصرفی را پرسید.' },
  { id: 'meds-reason', category: 'سابقه دارویی', statement: 'علت مصرف داروها را پرسید.' },
  { id: 'meds-herbal', category: 'سابقه دارویی', statement: 'سابقه ی مصرف داروهای گیاهی و مکمل ها را پرسید.' },
  { id: 'meds-otc', category: 'سابقه دارویی', statement: 'سابقه ی مصرف داروهای بدون نسخه را پرسید.' },
  
  // 6. سابقه خانوادگی
  { id: 'family-similar-illness', category: 'سابقه خانوادگی', statement: 'سابقه ی بیماری های مشابه در خانواده را پرسید.' },
  { id: 'family-hereditary-disease', category: 'سابقه خانوادگی', statement: 'سابقه ی بیماری های ارثی در خانواده را پرسید.' },
  { id: 'family-health-status', category: 'سابقه خانوادگی', statement: 'وضعیت سلامتی والدین و خواهر و برادران را پرسید.' },

  // 7. سابقه اجتماعی-شخصی
  { id: 'social-occupation', category: 'سابقه اجتماعی-شخصی', statement: 'شغل بیمار را پرسید.' },
  { id: 'social-marital-status', category: 'سابقه اجتماعی-شخصی', statement: 'وضعیت تاهل را پرسید.' },
  { id: 'social-smoking', category: 'سابقه اجتماعی-شخصی', statement: 'سابقه ی مصرف سیگار را پرسید.' },
  { id: 'social-alcohol', category: 'سابقه اجتماعی-شخصی', statement: 'سابقه ی مصرف الکل را پرسید.' },
  { id: 'social-drugs', category: 'سابقه اجتماعی-شخصی', statement: 'سابقه ی مصرف مواد مخدر را پرسید.' },
  { id: 'social-nutrition', category: 'سابقه اجتماعی-شخصی', statement: 'وضعیت تغذیه بیمار را پرسید.' },
  { id: 'social-exercise', category: 'سابقه اجتماعی-شخصی', statement: 'وضعیت فعالیت بدنی بیمار را پرسید.' },
  { id: 'social-sleep', category: 'سابقه اجتماعی-شخصی', statement: 'وضعیت خواب بیمار را پرسید.' },
  { id: 'social-stress', category: 'سابقه اجتماعی-شخصی', statement: 'وضعیت استرس و اضطراب بیمار را پرسید.' },
  { id: 'social-support', category: 'سابقه اجتماعی-شخصی', statement: 'حمایت اجتماعی بیمار را پرسید.' },
];

type Objective = typeof LEARNING_OBJECTIVES[number];

// Pre-group objectives by category for easier rendering
export const GroupedLearningObjectives = LEARNING_OBJECTIVES.reduce((acc, objective) => {
  const category = objective.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(objective);
  return acc;
}, {} as Record<string, Objective[]>);
