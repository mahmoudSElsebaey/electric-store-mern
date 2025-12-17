import dotenv from "dotenv";
import { connectDB } from "./config/db/connectDB.js";
import Product from "./src/models/product.model.js";
import Category from "./src/models/category.model.js";
import Brand from "./src/models/brand.model.js";
dotenv.config();

const categoriesData = [
  {
    name: "غسالات",
    description: "غسالات ملابس أوتوماتيك، فوق أوتوماتيك، وتحميل أمامي",
    image: "https://media.istockphoto.com/id/1350790515/vector/washing-machine-icon.jpg?s=612x612&w=0&k=20&c=Nbnm1JnQtUcWwR3vbg68DeOBr0zw6WOjGTKrIRz05nQ=" // غسالة أنيقة
  },
  {
    name: "ثلاجات",
    description: "ثلاجات نوفروست، ديب فريزر، وثلاجات جانبية",
    image: "https://media.istockphoto.com/id/675706424/vector/full-and-empty-fridge-isolated-on-white-vector.jpg?s=612x612&w=0&k=20&c=k8wOFDkXbo3q1HRNoVtLtHpnDEk4TSwRq436303OPDk=" // ثلاجة مفتوحة/مغلقة
  },
  {
    name: "تكييفات",
    description: "تكييفات سبليت، شباك، وإنفرتر موفرة للطاقة",
    image: "https://media.istockphoto.com/id/1398744418/vector/icon-set-hvac-air-conditioner.jpg?s=612x612&w=0&k=20&c=eMaCDZZbMfgQ4PWHaPM32S70m14r-fgLkDhAE_SyV_I=" // أيقونات تكييف
  },
  {
    name: "خلاطات",
    description: "خلاطات، كبّات، ومحضرات طعام متعددة الاستخدامات",
    image: "https://media.istockphoto.com/id/589951028/vector/blender-flat-icon-set-household-kitchen-appliances-vector-illustration.jpg?s=612x612&w=0&k=20&c=D4Mlc5H0Bc3fVmDZhhEncOnD627_5C1QU3g2H4BW0VA=" // خلاط احترافي
  },
  {
    name: "مكانس",
    description: "مكانس كهربائية عادية، روبوت، ويدوية",
    image: "https://media.istockphoto.com/id/1266627910/vector/vacuum-cleaner-line-icons-set-vector-illustration-different-types-hoover.jpg?s=612x612&w=0&k=20&c=fCENGwG-xikGmwOqCm4jf2R91hN_eeVMLYUwpggr0Jw=" // مكانس متعددة
  },
  {
    name: "مكاوي",
    description: "مكاوي بخار عمودية وأفقية عالية الجودة",
    image: "https://media.gettyimages.com/id/1434335574/vector/steam-iron-icon-for-design-easily-editable.jpg?s=612x612&w=gi&k=20&c=tFS0UY0q3ijrAn0ATxlEH2FozEerR0jp_-9yen336lw=" // مكواة بخار
  },
  {
    name: "ميكروويف",
    description: "أفران ميكروويف ديجيتال وجريل",
    image: "https://media.istockphoto.com/id/1387359841/vector/microwave-oven-line-art-icon.jpg?s=612x612&w=0&k=20&c=i9PG4j-kwJ8ko2-wutnRbwDB5BkAGvNGUXBmOqWkLF0=" // ميكروويف أنيق
  },
  {
    name: "توستر",
    description: "توستر خبز، شوايات، وساندويتش ميكر",
    image: "https://media.istockphoto.com/id/1205502829/vector/toaster-icons-multi-series.jpg?s=612x612&w=0&k=20&c=Nj7e_29Wcj8yyHNl3k_gzayUTqxPi7_ybZXYRvGm-90=" // توستر متعدد
  },
  {
    name: "ماكينات قهوة",
    description: "ماكينات قهوة كبسولات، إسبريسو، وتركي",
    image: "https://www.shutterstock.com/image-vector/coffee-icons-set-20-trendy-600nw-2468328315.jpg" // ماكينات قهوة
  },
  {
    name: "غسالة أطباق",
    description: "غسالات أطباق مدمجة ومنفصلة موفرة للمياه",
    image: "https://media.istockphoto.com/id/1338070922/vector/dishwasher-flat-line-icons-set-household-appliance-for-washing-utensil-dishware-clean-dishes.jpg?s=612x612&w=0&k=20&c=0I_GiRvDR26KsYXWtpxXu-VXT_OEtWPXmhdfQGhZakI=" // غسالة أطباق
  },
  // تصنيفات شائعة جديدة
  {
    name: "تليفزيونات",
    description: "شاشات سمارت، LED، و4K عالية الدقة",
    image: "https://uxwing.com/wp-content/themes/uxwing/download/computers-mobile-hardware/led-television-icon.svg" // تليفزيون LED
  },
  {
    name: "سخانات",
    description: "سخانات غاز وكهرباء سريعة التسخين",
    image: "https://media.istockphoto.com/id/2159032503/vector/boiler-icon-water-heater-symbol-bathroom-thermostat-vector-illustration-thermal-system-sign.jpg?s=612x612&w=0&k=20&c=Nc9yxovNpckZazJNbEXeZYSc0YWrxH2LXQBxPPP8Rww=" // سخان
  },
  {
    name: "مراوح",
    description: "مراوح سقف، ستاند، وطاولة",
    image: "https://www.shutterstock.com/image-vector/4-blade-ac-ceiling-fan-600nw-2274944715.jpg" // مروحة سقف
  },
  {
    name: "أفران",
    description: "أفران بلت إن كهرباء وغاز",
    image: "https://www.shutterstock.com/image-vector/oven-cooking-mode-line-icon-260nw-2545986959.jpg" // فرن
  },
  {
    name: "بوتاجازات",
    description: "بوتاجازات 4 و5 شعلة مع فرن",
    image: "https://as2.ftcdn.net/jpg/05/40/44/95/1000_F_540449530_DtPnKb8YwQLSrfl5WX6HqW6kaPUieaWp.jpg" // بوتاجاز
  },
];

const brandsData = [
  {
    name: "LG",
    description: "ماركة كورية رائدة في الشاشات، الثلاجات، الغسالات والأجهزة المنزلية بتقنيات متقدمة وكفاءة عالية",
    logo: "https://www.freepnglogos.com/uploads/lg-logo-png/lg-logo-logo-png-transparent-svg-vector-bie-supply-0.png"
  },
  {
    name: "Samsung",
    description: "عملاق كوري في الهواتف، الشاشات، الثلاجات والأجهزة الذكية بتصميم عصري وأداء قوي",
    logo: "https://images.samsung.com/is/image/samsung/assets/us/about-us/brand/logo/mo/360_197_1.png?$720_N_PNG$"
  },
  {
    name: "Toshiba",
    description: "ماركة يابانية متخصصة في الشاشات، التكييفات، الثلاجات والأجهزة الكهربائية بجودة عالية ومتانة",
    logo: "https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-toshiba-transparent-background-PNG.png"
  },
  {
    name: "Sharp",
    description: "ماركة يابانية معروفة بالشاشات، التكييفات، الميكروويف والأجهزة المنزلية بتقنية بلازما كلاستر",
    logo: "https://download.logo.wine/logo/Sharp_Corporation/Sharp_Corporation-Logo.wine.png"
  },
  {
    name: "Bosch",
    description: "ماركة ألمانية متخصصة في الأدوات الكهربائية، الغسالات، الثلاجات والأجهزة الاحترافية عالية الدقة",
    logo: "https://logos-world.net/wp-content/uploads/2020/08/Bosch-Logo-2018-present.jpg"
  },
  {
    name: "Whirlpool",
    description: "ماركة أمريكية رائدة في الغسالات، الثلاجات، البوتاجازات والأجهزة المنزلية الكبيرة",
    logo: "https://logos-world.net/wp-content/uploads/2022/12/Whirlpool-Logo.png"
  },
  {
    name: "Beko",
    description: "ماركة تركية اقتصادية توفر ثلاجات، غسالات، تكييفات وأجهزة منزلية بجودة جيدة وسعر مناسب",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Beko_logo.png"
  },
  {
    name: "Unionaire",
    description: "ماركة مصرية متخصصة في التكييفات، البوتاجازات، السخانات والأجهزة المنزلية بأسعار تنافسية",
    logo: "https://thumbs.dreamstime.com/b/unionaire-company-logo-samsung-tablet-air-condition-home-appliances-93357572.jpg" // أفضل صورة متوفرة، لو عندك أفضل غيرها
  },
  {
    name: "Kenwood",
    description: "ماركة بريطانية متخصصة في الخلاطات، الكيتشن ماشين، المحضرات الطعام والأجهزة الصغيرة",
    logo: "https://1000logos.net/wp-content/uploads/2021/05/Kenwood-logo.png"
  },
  {
    name: "Braun",
    description: "ماركة ألمانية رائدة في ماكينات الحلاقة، العناية الشخصية، الخلاطات والأجهزة الدقيقة",
    logo: "https://download.logo.wine/logo/Braun_(company)/Braun_(company)-Logo.wine.png"
  },
  {
    name: "Philips",
    description: "ماركة هولندية معروفة بالإضاءة، ماكينات الحلاقة، الخلاطات، المكاوي والأجهزة المنزلية",
    logo: "https://1000logos.net/wp-content/uploads/2017/05/Phillips-Logo.png"
  },
  {
    name: "Nespresso",
    description: "ماركة سويسرية متخصصة في ماكينات القهوة الكبسولات والإسبريسو بطعم احترافي",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Nespresso.png"
  },
];

const productsData = [
  // ميكروويف وتوستر وماكينات قهوة وغسالة أطباق (5)
  {
    name: "ميكروويف Samsung 40 لتر",
    price: 6900,
    image:
      "https://www.raneen.com/media/catalog/product/2/5/25-900-8-tmd-25se-bk_jxhxndwlvmzay8qr_1_1.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Samsung",
    category: "ميكروويف",
    countInStock: 11,
    description:
      "ميكروويف Samsung بحجم 40 لتر، تسخين سريع وبرامج متعددة للطهي.",
  },
  {
    name: "توستر Kenwood 4 شرائح",
    price: 890,
    image:
      "https://www.raneen.com/media/catalog/product/1/_/1_1el0rjwhayyhauq0.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Kenwood",
    category: "توستر",
    countInStock: 28,
    description: "توستر Kenwood لأربع شرائح مع مستويات تحميص متعددة.",
  },
  {
    name: "ماكينة قهوة Nespresso",
    price: 4900,
    image:
      "https://www.raneen.com/media/catalog/product/e/s/es187609blk-conf_0norjikjqwmakvqz.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Nespresso",
    category: "ماكينات قهوة", // ← تعديل هنا
    countInStock: 15,
    description:
      "ماكينة قهوة Nespresso بإستخراج احترافي للكبسولات وطعم قهوة ممتاز.",
  },
  {
    name: "غسالة أطباق Bosch 13 فرد",
    price: 28900,
    image:
      "https://www.raneen.com/media/catalog/product/e/l/el1065755slv-conf_fn8jzhqnzdzhwylg.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Bosch",
    category: "غسالة أطباق",
    countInStock: 5,
    description:
      "غسالة أطباق 13 فرد من Bosch مع برامج غسيل قوية وموفرة للطاقة.",
  },
  {
    name: "غسالة أطباق Whirlpool 12 فرد",
    price: 24900,
    image:
      "https://www.raneen.com/media/catalog/product/a/g/agsms25ab00gblk-conf-abozied_olrbayt3xsgszsql_5.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Whirlpool",
    category: "غسالة أطباق",
    countInStock: 8,
    description: "غسالة أطباق Whirlpool بسعة 12 فرد مع نتائج تجفيف ممتازة.",
  },

  // غسالات (4)
  {
    name: "غسالة LG أوتوماتيك 10 كجم",
    price: 18500,
    image:
      "https://www.raneen.com/media/catalog/product/e/l/el1090993slv-conf_bhftb6zgyztbaa9j.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=1000&width=1000&canvas=1000:1000",
    brand: "LG",
    category: "غسالات",
    countInStock: 12,
    description:
      "غسالة LG بسعة 10 كجم، تقنية العناية بالملابس، برامج متعددة، موفرة للطاقة ودوران عالي للملابس.",
  },
  {
    name: "غسالة Samsung 9 كجم ديجيتال",
    price: 16200,
    image:
      "https://www.raneen.com/media/catalog/product/5/_/5_mruhyfymh42o9vgl.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300",
    brand: "Samsung",
    category: "غسالات",
    countInStock: 8,
    description:
      "غسالة Samsung مزودة بتقنية Eco Bubble، شاشة ديجيتال، أداء قوي وتنظيف مثالي للملابس.",
  },
  {
    name: "غسالة Toshiba فوق أوتوماتيك 12 كجم",
    price: 9800,
    image:
      "https://www.raneen.com/media/catalog/product/1/7/1739204467_img-20241217-wa0016-1-1-1_zemro8c3pinxv7w8_1_1.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300",
    brand: "Toshiba",
    category: "غسالات",
    countInStock: 20,
    description:
      "غسالة فوق أوتوماتيك 12 كجم صنعت للاستخدام اليومي، هادئة وسهلة الاستخدام وتحتوي على برامج متعددة.",
  },
  {
    name: "غسالة Beko 8 كجم",
    price: 13500,
    image:
      "https://www.raneen.com/media/catalog/product/1/0/10.1_3.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300",
    brand: "Beko",
    category: "غسالات",
    countInStock: 15,
    description:
      "غسالة Beko موفرة للطاقة ومصممة للأسر الصغيرة والمتوسطة مع برامج غسل سريعة وهادئة.",
  },

  // ثلاجات (4)
  {
    name: "ثلاجة LG 600 لتر نوفروست",
    price: 28900,
    image:
      "https://www.raneen.com/media/catalog/product/i/t/item1748850104_pjqy27jqzvqytaq8_4.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300",
    brand: "LG",
    category: "ثلاجات",
    countInStock: 5,
    description:
      "ثلاجة LG كبيرة بحجم 600 لتر، تقنية نوفروست، تبريد سريع، إنفرتر موفر للطاقة.",
  },
  {
    name: "ثلاجة Samsung 500 لتر إنفرتر",
    price: 25900,
    image:
      "https://www.raneen.com/media/catalog/product/e/l/el1131161blk-2.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=240&canvas=240:300",
    brand: "Samsung",
    category: "ثلاجات",
    countInStock: 7,
    description:
      "ثلاجة Samsung بسعة 500 لتر، تبريد متساوٍ، إنفرتر لضمان استهلاك أقل للطاقة.",
  },
  {
    name: "ثلاجة Sharp 450 لتر",
    price: 18900,
    image:
      "https://www.raneen.com/media/catalog/product/i/t/item1650888408_egvxovx8q9agpnac_1.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300",
    brand: "Sharp",
    category: "ثلاجات",
    countInStock: 10,
    description:
      "ثلاجة Sharp متينة، تبريد قوي، نظام توزيع هواء ممتاز للمحافظة على الطعام طازج.",
  },
  {
    name: "ثلاجة Whirlpool 550 لتر",
    price: 27500,
    image:
      "https://www.raneen.com/media/catalog/product/o/r/original-1_dzvdpogamumnsyin.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=240&canvas=240:300",
    brand: "Whirlpool",
    category: "ثلاجات",
    countInStock: 6,
    description:
      "ثلاجة Whirlpool بسعة 550 لتر مثالية للعائلات الكبيرة مع نظام تبريد ذكي.",
  },

  // تكييفات (3)
  {
    name: "تكييف Unionaire سبليت 1.5 حصان بارد",
    price: 14500,
    image:
      "https://www.raneen.com/media/catalog/product/e/l/eloptimax_53khct-24wit-2_5_14.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=240&canvas=240:300",
    brand: "Unionaire",
    category: "تكييفات",
    countInStock: 18,
    description:
      "تكييف Unionaire تبريد قوي، تشغيل هادئ، وضمان توفير في استهلاك الكهرباء.",
  },
  {
    name: "تكييف LG إنفرتر 2.25 حصان بارد/ساخن",
    price: 22900,
    image:
      "https://www.raneen.com/media/catalog/product/1/_/1_3dm9c8xxsmsg6vex_3.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300",
    brand: "LG",
    category: "تكييفات",
    countInStock: 9,
    description:
      "تكييف LG إنفرتر بارد/ساخن يوفر تبريد سريع وهادئ ويوفر في استهلاك الكهرباء.",
  },
  {
    name: "تكييف Sharp 3 حصان",
    price: 28900,
    image:
      "https://www.raneen.com/media/catalog/product/1/-/1-5-ah-a12zse_1__4.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300",
    brand: "Sharp",
    category: "تكييفات",
    countInStock: 4,
    description:
      "Sharp 3 حصان مناسب للمساحات الكبيرة، تبريد فوري، وكفاءة عالية.",
  },

  // خلاطات ومكانس ومكاوي (4)
  {
    name: "خلاط Kenwood 1000 وات",
    price: 1890,
    image:
      "https://www.raneen.com/media/catalog/product/4/7/474_kymbwc8htn4id7cg.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Kenwood",
    category: "خلاطات",
    countInStock: 25,
    description:
      "خلاط Kenwood قوي 1000 وات، متعدد الاستخدامات، مع وعاء زجاجي متين.",
  },
  {
    name: "خلاط Braun متعدد الاستخدامات",
    price: 1590,
    image:
      "https://www.raneen.com/media/catalog/product/4/4/44_1_6_1.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Braun",
    category: "خلاطات",
    countInStock: 30,
    description: "خلاط Braun عملي وخفيف، مثالي للعصائر والمزج اليومي.",
  },
  {
    name: "مكنسة Bosch كيس",
    price: 4500,
    image:
      "https://www.raneen.com/media/catalog/product/1/5/1592133220_1045767-1_lhhe8o5baewibnrc_1.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Bosch",
    category: "مكانس",
    countInStock: 14,
    description:
      "مكنسة Bosch ذات قوة شفط ممتازة وسعة كيس كبيرة، مناسبة لكافة أنواع الأرضيات.",
  },
  {
    name: "مكواة بخار Philips",
    price: 1290,
    image:
      "https://www.raneen.com/media/catalog/product/e/l/el1100237grn-conf_x2e1lqnafyfwcwse.jpg?width=265&height=265&canvas=265,265&optimize=high&bg-color=255,255,255&fit=bounds",
    brand: "Philips",
    category: "مكاوي",
    countInStock: 22,
    description: "مكواة Philips بخار قوية وسهلة الانزلاق، تزيل التجاعيد بسرعة.",
  },
];

const seedDB = async () => {
  await connectDB();

  await Category.deleteMany({});
  await Brand.deleteMany({});
  await Product.deleteMany({});

  const createdCategories = await Category.insertMany(categoriesData);
  const createdBrands = await Brand.insertMany(brandsData);

  const categoryMap = createdCategories.reduce((map, cat) => {
    map[cat.name] = cat._id;
    return map;
  }, {});

  const brandMap = createdBrands.reduce((map, br) => {
    map[br.name] = br._id;
    return map;
  }, {});

  const mappedProducts = productsData.map((p) => ({
    ...p,
    brand: brandMap[p.brand],
    category: categoryMap[p.category],
  }));

  await Product.insertMany(mappedProducts);

  console.log(
    `✅ تم إضافة ${mappedProducts.length} منتج، ${categoriesData.length} تصنيف، ${brandsData.length} براند بنجاح!`
  );
  process.exit();
};

seedDB();
