import { colors } from './theme';

export const LIFECYCLE = [
  'registered',
  'received_china',
  'measured',
  'ready_dispatch',
  'dispatched',
  'in_transit',
  'arrived_ub',
  'branch_dispatched',
  'received_branch',
  'ready_pickup',
  'delivered',
];

export const STATUS_META = {
  registered: { label: 'Тээврийн дугаар бүртгэсэн', color: 'slate', icon: 'inbox' },
  received_china: { label: 'Эрээн дэх агуулахад ирсэн', color: 'info', icon: 'warehouse' },
  measured: { label: 'Ачааны хэмжээг бүртгэсэн', color: 'teal', icon: 'package' },
  ready_dispatch: { label: 'Монгол руу ачихад бэлэн', color: 'brand', icon: 'package' },
  dispatched: { label: 'Монгол руу ачигдсан', color: 'violet', icon: 'truck' },
  in_transit: { label: 'Замд яваа', color: 'violet', icon: 'truck' },
  arrived_ub: { label: 'Улаанбаатарт ирсэн', color: 'teal', icon: 'mapPin' },
  branch_dispatched: { label: 'Салбар руу илгээсэн', color: 'info', icon: 'truck' },
  received_branch: { label: 'Салбарт ирсэн', color: 'info', icon: 'store' },
  ready_pickup: { label: 'Авахад бэлэн', color: 'success', icon: 'packageCheck' },
  out_for_delivery: { label: 'Хүргэлтэд гарсан', color: 'warning', icon: 'truck' },
  delivered: { label: 'Хүлээлгэн өгсөн', color: 'success', icon: 'check' },
};

export const statusColor = (key) => {
  const meta = STATUS_META[key] || STATUS_META.registered;
  return { fg: colors[meta.color] || colors.slate, bg: colors[`${meta.color}Bg`] || colors.slateBg };
};

export const BRANCHES = [
  {
    id: 'baganat',
    name: 'Баганат салбар',
    address: 'Улаанхуаран, Баганат хороолол, 408-р байр, 2-р орц',
    hours: 'Даваа, Лхагва–Бямба 12:00–19:00 · Ням 12:00–16:00 · Мягмарт амарна',
    phone: '+976 88645444',
    warehousePhone: '15540532326',
    postal: '11100',
    building: '11号楼11号商铺',
    express: true,
  },
  {
    id: 'sapporo',
    name: 'Саппоро салбар',
    address: '80-р сургуулийн зүүн талд, ХД21-р байрны 1-р давхар',
    hours: 'Даваа, Лхагва–Бямба 12:00–19:00 · Ням 12:00–16:00 · Мягмарт амарна',
    phone: '+976 90297878',
    warehousePhone: '15847770099',
    postal: '11100',
    expressPostal: '111000',
    building: '11号楼11号商铺',
    express: true,
  },
  {
    id: 'kharkhorin',
    name: 'Хархорин салбар',
    address: 'Хархорин захын хойно, KFC-ийн баруун талын 30-р байрны 1-р давхар',
    hours: 'Даваа, Лхагва–Бямба 12:00–19:00 · Ням 12:00–16:00 · Мягмарт амарна',
    phone: '+976 95105670',
    warehousePhone: '15847975200',
    postal: '11000',
    building: '13号楼31号商铺',
    express: true,
  },
  {
    id: 'erdenet',
    name: 'Эрдэнэт салбар',
    address: 'Орхон аймаг, Баян-Өндөр сум, 2-р хороолол, 7-р байр',
    hours: 'Даваа–Баасан 11:00–19:00 · Бямба 12:00–16:00 · Нямд амарна',
    phone: '+976 80120077',
    warehousePhone: '16614799944',
    postal: '11100',
    building: '11号楼11号商铺',
    express: false,
  },
];

export const SERVICES = [
  { id: 'duoduo', name: '多多', label: 'Энгийн тээвэр' },
  { id: 'suda', name: '速达', label: 'Шуурхай тээвэр' },
];

export const ODOD_WEBSITE = 'https://ododcargo.mn/';

export const buildChinaAddress = (branch, service) =>
  service.id === 'suda' && !branch.express ? null : {
    recipient: service.name + ' Odod ' + branch.phone.slice(-8),
    region: '内蒙古自治区锡林郭勒盟二连浩特市建设管理局',
    phone: branch.warehousePhone,
    address: '环宇商贸城' + branch.building,
    postal: service.id === 'suda' ? branch.expressPostal ?? branch.postal : branch.postal,
  };

export const userInitial = {
  name: 'Болд',
  fullName: 'Болд Бат-Эрдэнэ',
  code: 'C-10234',
  phone: '+976 8811 2233',
};

const h = (status, time, location, note) => ({ status, time, location, note });

export const initialParcels = [
  {
    id: 'od4812',
    code: 'OD-2026-04812',
    tracking: 'YT882731004CN',
    carrier: 'YTO Express 圆通速递',
    serviceId: 'duoduo',
    branchId: 'sapporo',
    status: 'in_transit',
    weight: '2.4 кг',
    dims: '30×20×15 см',
    photos: 2,
    invoiceId: null,
    history: [
      h('registered', '11.10 14:22'),
      h('received_china', '11.12 09:15', 'Эрээн дэх агуулах'),
      h('measured', '11.12 16:40', 'Эрээн дэх агуулах', 'Жин 2.4 кг'),
      h('ready_dispatch', '11.13 11:05'),
      h('dispatched', '11.14 08:30'),
      h('in_transit', '11.15 10:20', 'Тээвэрлэж байна'),
    ],
  },
  {
    id: 'od4815',
    code: 'OD-2026-04815',
    tracking: 'SF1388227711CN',
    carrier: 'SF Express 顺丰速运',
    serviceId: 'duoduo',
    branchId: 'baganat',
    status: 'received_china',
    weight: null,
    dims: null,
    photos: 0,
    invoiceId: null,
    history: [
      h('registered', '11.19 10:02'),
      h('received_china', '11.21 15:44', 'Эрээн дэх агуулах'),
    ],
  },
  {
    id: 'od4810',
    code: 'OD-2026-04810',
    tracking: 'YT882731188CN',
    carrier: 'YTO Express 圆通速递',
    serviceId: 'duoduo',
    branchId: 'baganat',
    status: 'ready_pickup',
    weight: '2.4 кг',
    dims: '28×20×14 см',
    photos: 2,
    invoiceId: 'inv1190',
    history: [
      h('registered', '11.02 09:10'),
      h('received_china', '11.04 11:20', 'Эрээн дэх агуулах'),
      h('measured', '11.04 15:32', 'Эрээн дэх агуулах', 'Жин 2.4 кг'),
      h('ready_dispatch', '11.05 10:00'),
      h('dispatched', '11.06 08:12'),
      h('in_transit', '11.07 09:00', 'Тээвэрлэж байна'),
      h('arrived_ub', '11.10 14:30', 'Улаанбаатар дахь төв агуулах'),
      h('branch_dispatched', '11.10 18:10', 'Улаанбаатар дахь төв агуулах'),
      h('received_branch', '11.11 10:05', 'Баганат салбар'),
      h('ready_pickup', '11.11 12:20', 'Баганат салбар'),
    ],
  },
  {
    id: 'od4802',
    code: 'OD-2026-04802',
    tracking: 'YT882730552CN',
    carrier: 'YTO Express 圆通速递',
    serviceId: 'duoduo',
    branchId: 'baganat',
    status: 'ready_pickup',
    weight: '1.1 кг',
    dims: '20×15×10 см',
    photos: 1,
    invoiceId: 'inv1190',
    history: [
      h('registered', '11.02 09:12'),
      h('received_china', '11.04 11:22', 'Эрээн дэх агуулах'),
      h('measured', '11.04 15:40', 'Эрээн дэх агуулах', 'Жин 1.1 кг'),
      h('ready_dispatch', '11.05 10:00'),
      h('dispatched', '11.06 08:12'),
      h('in_transit', '11.07 09:00', 'Тээвэрлэж байна'),
      h('arrived_ub', '11.10 14:30', 'Улаанбаатар дахь төв агуулах'),
      h('branch_dispatched', '11.10 18:10', 'Улаанбаатар дахь төв агуулах'),
      h('received_branch', '11.11 10:06', 'Баганат салбар'),
      h('ready_pickup', '11.11 12:22', 'Баганат салбар'),
    ],
  },
  {
    id: 'od4755',
    code: 'OD-2026-04755',
    tracking: 'YT882720011CN',
    carrier: 'ZTO Express 中通快递',
    serviceId: 'suda',
    branchId: 'baganat',
    status: 'delivered',
    weight: '3.2 кг',
    dims: '35×25×20 см',
    photos: 3,
    invoiceId: 'inv1130',
    history: [
      h('registered', '10.20 13:00'),
      h('received_china', '10.22 10:11', 'Эрээн дэх агуулах'),
      h('measured', '10.22 14:00', 'Эрээн дэх агуулах', 'Жин 3.2 кг'),
      h('ready_dispatch', '10.23 09:00'),
      h('dispatched', '10.24 08:00'),
      h('in_transit', '10.25 09:00', 'Тээвэрлэж байна'),
      h('arrived_ub', '10.28 15:00', 'Улаанбаатар дахь төв агуулах'),
      h('branch_dispatched', '10.28 17:00', 'Улаанбаатар дахь төв агуулах'),
      h('received_branch', '10.29 10:00', 'Баганат салбар'),
      h('ready_pickup', '10.29 12:00', 'Баганат салбар'),
      h('delivered', '10.30 16:45', 'Баганат салбар', 'Хүлээлгэн өгсөн'),
    ],
  },
];

export const initialRegistrations = [
  {
    id: 'reg1',
    branchId: 'baganat',
    serviceId: 'duoduo',
    tracking: 'YT882739900CN',
    carrier: 'YTO Express 圆通速递',
    orderRef: 'TB-2026-99120',
    status: 'waiting',
    createdAt: '11.21 09:30',
  },
  {
    id: 'reg2',
    branchId: 'baganat',
    serviceId: 'suda',
    tracking: 'SF1388001122',
    carrier: 'SF Express 顺丰速运',
    orderRef: '',
    status: 'waiting',
    createdAt: '11.20 18:12',
  },
];

export const initialInvoices = [
  {
    id: 'inv1190',
    number: 'INV-2026-1190',
    date: '2026.11.11',
    currency: '₮',
    status: 'partial',
    lines: [
      { parcelCode: 'OD-2026-04810', desc: '2.4 кг · 多多', amount: 26400 },
      { parcelCode: 'OD-2026-04802', desc: '1.1 кг · 多多', amount: 12100 },
    ],
    payments: [{ id: 'pay1', date: '11.19 11:20', amount: 14000, method: 'Салбарт бэлнээр' }],
  },
  {
    id: 'inv1130',
    number: 'INV-2026-1130',
    date: '2026.10.29',
    currency: '₮',
    status: 'paid',
    lines: [{ parcelCode: 'OD-2026-04755', desc: '3.2 кг · 速达', amount: 41600 }],
    payments: [{ id: 'pay2', date: '10.30 16:40', amount: 41600, method: 'Салбарт бэлнээр' }],
  },
];

export const invoiceTotals = (inv) => {
  const total = inv.lines.reduce((s, l) => s + l.amount, 0);
  const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
  return { total, paid, balance: Math.max(0, total - paid) };
};

export const initialNotifications = [
  {
    id: 'n4',
    type: 'received_china',
    parcelId: 'od4815',
    title: 'Эрээн дэх агуулахад ирлээ',
    body: 'SF1388227711CN дугаартай ачааг хүлээн авч бүртгэлээ.',
    time: '11.21 15:44',
    read: true,
  },
  {
    id: 'n3',
    type: 'dispatched',
    parcelId: 'od4812',
    title: 'Монгол руу хөдөллөө',
    body: 'YT882731004CN дугаартай ачаа Эрээнээс ачигдлаа.',
    time: '11.14 08:30',
    read: true,
  },
  {
    id: 'n1',
    type: 'ready_pickup',
    parcelId: 'od4810',
    title: 'Авахад бэлэн боллоо',
    body: 'OD-2026-04810 дугаартай ачаагаа Баганат салбараас аваарай.',
    time: '11.11 12:20',
    read: false,
  },
  {
    id: 'n2',
    type: 'received_branch',
    parcelId: 'od4810',
    title: 'Салбарт ирлээ',
    body: 'OD-2026-04810 дугаартай ачаа Баганат салбарт ирлээ.',
    time: '11.11 10:05',
    read: false,
  },
];

export const CARRIERS = [
  'YTO Express 圆通速递',
  'SF Express 顺丰速运',
  'ZTO Express 中通快递',
  'Yunda Express 韵达快递',
  'Тээвэрлэгч тодорхойгүй',
];

export const HELP_ARTICLES = {
  login: {
    icon: 'bookOpen',
    title: 'Нэвтрэхэд тусламж авах',
    body: [
      'Утасны дугаараа +976 кодын араас 8 оронтойгоор оруулна.',
      'Туршилтын горимд 123456 кодоор нэвтэрнэ. Ачааны жишээ мэдээлэл харах бол 88112233 дугаарыг ашиглаарай.',
    ],
  },
  address: {
    icon: 'bookOpen',
    title: 'Эрээн дэх хаягаа яаж оруулах вэ?',
    body: [
      'Одод Каргогийн албан ёсны сайтаас ачаагаа авах салбар болон тээврийн төрлөө сонгоно.',
      'Taobao, Pinduoduo эсвэл 1688-д хүлээн авагч, бүс нутаг, утас, дэлгэрэнгүй хаяг, шуудангийн кодыг харгалзах талбарт оруулна.',
      'Захиалгаа батлахаасаа өмнө нэр, утас болон агуулахын байр, тоотыг шалгаарай.',
    ],
  },
  tracking: {
    icon: 'scanSearch',
    title: 'Тээврийн дугаараа яаж олох вэ?',
    body: [
      'Дэлгүүр барааг тээвэрлэгчид өгсний дараа захиалгын хүргэлтийн мэдээлэлд тээврийн дугаар (tracking number) гарна.',
      'Taobao: «我的淘宝 → 已买到的宝贝 → 查看物流» хэсэгт, Pinduoduo: «个人中心 → 我的订单 → 查看物流» хэсэгт харагдана.',
      'Дугаараа аппын «Тээврийн дугаар бүртгүүлэх» хэсэгт оруулна. Агуулах ачааг хүлээн авч, дугаартай нь тулгасны дараа «Миний ачаа» хэсэгт харагдана.',
    ],
  },
  dispute: {
    icon: 'scale',
    title: 'Ачааны эзэмшлээ баталгаажуулах',
    body: [
      'Хэрэв дугаар тань өөр бүртгэлтэй давхцсан эсвэл ачаа тань харагдахгүй байвал Одод Карготой холбогдоно уу.',
      'Дэлгүүрийн захиалгын зураг, тээврийн дугаар болон төлбөрийн баримтаа бэлдээрэй.',
      'Оператор баримтыг шалгаад дараагийн алхмыг хэлж өгнө.',
    ],
  },
};

export const fmtMoney = (n) => `${n.toLocaleString('mn-MN')} ₮`;

export const nowLabel = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ulaanbaatar', month: '2-digit', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return values.year + '.' + values.month + '.' + values.day + ' ' + values.hour + ':' + values.minute;
};
