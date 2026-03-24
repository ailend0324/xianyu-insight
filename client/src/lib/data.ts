/*
 * 验货宝 2025 年 NPS 真实数据
 * 来源：2025年2-12月买家/卖家问卷调研
 */

export interface MonthlyNPS {
  month: string;
  buyer: number;
  seller: number;
  combined: number;
  buyerN: number;
  sellerN: number;
}

export interface TradeNPS {
  month: string;
  sellerSuccess: number;
  sellerOther: number;
  buyerSuccess: number;
  buyerOther: number;
}

export interface DissatisfyDriver {
  reason: string;
  sellerPct: number;
  buyerPct: number;
}

export interface RadarDimension {
  dimension: string;
  buyer: number;
  seller: number;
}

// 全年月度 NPS（合计口径）
export const monthlyNPS: MonthlyNPS[] = [
  { month: "2月", buyer: 21.5, seller: -5.7, combined: 6.1, buyerN: 298, sellerN: 386 },
  { month: "3月", buyer: 12.8, seller: -7.4, combined: 1.2, buyerN: 422, sellerN: 565 },
  { month: "4月", buyer: 24.9, seller: -9.1, combined: 7.6, buyerN: 349, sellerN: 363 },
  { month: "5月", buyer: 7.9, seller: -11.6, combined: -3.2, buyerN: 253, sellerN: 337 },
  { month: "6月", buyer: 2.6, seller: -9.5, combined: -4.4, buyerN: 312, sellerN: 422 },
  { month: "7月", buyer: -1.4, seller: -13.8, combined: -8.6, buyerN: 287, sellerN: 390 },
  { month: "8月", buyer: 16.1, seller: -5.0, combined: 3.4, buyerN: 223, sellerN: 337 },
  { month: "9月", buyer: 11.3, seller: -20.6, combined: -6.0, buyerN: 213, sellerN: 253 },
  { month: "10月", buyer: 11.6, seller: -10.3, combined: -0.2, buyerN: 414, sellerN: 484 },
  { month: "11月", buyer: 9.7, seller: -9.7, combined: -0.3, buyerN: 452, sellerN: 484 },
  { month: "12月", buyer: 15.0, seller: -10.0, combined: 2.0, buyerN: 147, sellerN: 160 },
];

// 交易结果分层 NPS（6-11月）
export const tradeNPS: TradeNPS[] = [
  { month: "6月", sellerSuccess: 19.1, sellerOther: -64.1, buyerSuccess: -5.4, buyerOther: 17.4 },
  { month: "7月", sellerSuccess: 24.0, sellerOther: -42.6, buyerSuccess: -10.2, buyerOther: 10.5 },
  { month: "8月", sellerSuccess: 17.6, sellerOther: -51.8, buyerSuccess: -5.3, buyerOther: 38.5 },
  { month: "9月", sellerSuccess: 13.8, sellerOther: -66.7, buyerSuccess: 7.1, buyerOther: 16.0 },
  { month: "10月", sellerSuccess: 23.9, sellerOther: -39.1, buyerSuccess: 3.0, buyerOther: 23.2 },
  { month: "11月", sellerSuccess: 23.0, sellerOther: -67.4, buyerSuccess: -2.1, buyerOther: 31.1 },
];

// 不满意原因（贬损者，6-11月）
export const dissatisfyDrivers: DissatisfyDriver[] = [
  { reason: "验货费用过高", sellerPct: 72.5, buyerPct: 18.2 },
  { reason: "验货结果不准确", sellerPct: 40.1, buyerPct: 45.3 },
  { reason: "验货时效太慢", sellerPct: 18.6, buyerPct: 28.7 },
  { reason: "损坏/丢失物品", sellerPct: 22.8, buyerPct: 8.4 },
  { reason: "客服处理不满意", sellerPct: 15.3, buyerPct: 32.1 },
  { reason: "报告不够详细", sellerPct: 12.4, buyerPct: 38.9 },
  { reason: "费用归属不合理", sellerPct: 35.7, buyerPct: 22.6 },
];

// 五维度满意度（1-5分，6-11月均值）
export const radarData: RadarDimension[] = [
  { dimension: "验货准确性", buyer: 3.52, seller: 3.22 },
  { dimension: "报告质量", buyer: 3.68, seller: 3.41 },
  { dimension: "验货时效", buyer: 3.61, seller: 3.25 },
  { dimension: "服务流程", buyer: 3.88, seller: 3.55 },
  { dimension: "客服服务", buyer: 3.88, seller: 3.48 },
];

// 用户原声
export const userVoices = {
  seller: [
    { text: "放大瑕疵，结果我被刀了。买家到手刀，特别是二手贩子，以后不会再用。", month: "6月", sentiment: "negative" },
    { text: "我交了39元多的检验费，结果买家不买，我却亏了39。小小瑕疵放大化，搞得客户不敢购买。", month: "7月", sentiment: "negative" },
    { text: "把灰尘看成划痕，纯垃圾服务。用放大镜放大那种，有点夸大。", month: "10月", sentiment: "negative" },
    { text: "买家都说自己承担费用，结果出尔反尔变成我要承担了。", month: "7月", sentiment: "negative" },
    { text: "建议由各品牌专业厂家来进行验货，而不是找三流人员进行是是非非的验货。", month: "6月", sentiment: "negative" },
    { text: "未拆封的机器，应当增加更全面的服务，保证卖家权益。", month: "11月", sentiment: "neutral" },
    { text: "挺好，双方都有保障。", month: "6月", sentiment: "positive" },
    { text: "总体还是不错的，报告希望保存更久一些。", month: "2月", sentiment: "positive" },
  ],
  buyer: [
    { text: "手机验货没有验出陀螺仪的问题，导致手机日常导航和游戏感应无法正常使用。", month: "9月", sentiment: "negative" },
    { text: "验机不拆机，那就别验了！主板是否翻修根本验不出来，咸鱼验货宝就是鸡肋。", month: "11月", sentiment: "negative" },
    { text: "所谓的验错必赔，才只是原价回收。明显的漏验问题，虽然承认，却以自己的规则搪塞推诿。", month: "6月", sentiment: "negative" },
    { text: "没有提供电池健康，缺少手机气密测试和电池健康度。", month: "11月", sentiment: "negative" },
    { text: "应该先沟通客户后，再出报告，先有一轮初步报告，解决客户疑惑，增加验货完整度。", month: "6月", sentiment: "neutral" },
    { text: "首次体验验货宝，验货速度快、报告清晰、精准，是买卖双方的保护盾，必须点赞！", month: "8月", sentiment: "positive" },
    { text: "专业性很强，很好。电子产品只要上咸鱼就得走验货宝，骗子太多不走验货宝怕被骗。", month: "2月", sentiment: "positive" },
  ],
};

// 产品演进方向
export const productDirections = [
  {
    id: "mechanism",
    title: "机制重构",
    subtitle: "重塑费用与风险分担",
    priority: "P0",
    icon: "⚖️",
    color: "seller",
    description: "改变「交易失败卖家全责」的规则，探索「谁主张谁买单」或「按比例分担」机制。推出验货宝 Lite / Pro 分层定价。",
    impact: "直接解决卖家 NPS 暴跌 80 分的核心痛点",
    actions: [
      "买家主动发起验货且验货结果与描述一致时，取消交易费用由买家承担",
      "推出基础版（仅外观）和专业版（含深度功能检测）分层定价",
      "设置费用上限保护机制，避免低价商品验货费倒挂",
    ],
  },
  {
    id: "standard",
    title: "标准重构",
    subtitle: "建立二手非标品宽容度体系",
    priority: "P0",
    icon: "📏",
    color: "seller",
    description: "区分「正常使用痕迹」与「重大瑕疵」，引入机型通病库，避免用微距强光放大肉眼不可见的细小划痕。",
    impact: "降低「到手刀」发生率，提升卖家信任度",
    actions: [
      "建立「正常使用痕迹」标准库，细微划痕不得使用微距强光拍摄",
      "引入机型通病提示（如折叠屏折痕、特定型号发热），降低买家不合理预期",
      "验货报告增加「结论」字段，明确说明是否符合工艺标准",
    ],
  },
  {
    id: "capability",
    title: "能力重构",
    subtitle: "从外观质检员到深度鉴定专家",
    priority: "P1",
    icon: "🔬",
    color: "buyer",
    description: "接入软件级深度检测（电池健康、充电次数、部件序列号匹配），提供全程作业视频，解决买家对「暗病」的担忧。",
    impact: "解决买家 45.3% 贬损者的「验货不准确」核心诉求",
    actions: [
      "接入爱思助手等系统级检测，读取电池健康度、充电次数、部件序列号",
      "提供验货拆包、检测全过程的监控视频或关键节点照片",
      "针对折叠屏等高端机型，增加专项检测项目（内屏、铰链等）",
    ],
  },
  {
    id: "experience",
    title: "体验重构",
    subtitle: "建立验错包赔极速通道",
    priority: "P1",
    icon: "🛡️",
    color: "buyer",
    description: "设立独立验货争议仲裁庭，简化举证门槛，落实真金白银赔付，夯实官方背书公信力。",
    impact: "提升买家售后满意度，降低 12315 投诉率",
    actions: [
      "设立独立「验货争议仲裁庭」，资深专家 24h 内复核",
      "简化「验错包赔」举证门槛，确认漏验后直接现金补偿",
      "增加买家与验货员的沟通通道，允许对报告细节进行确认",
    ],
  },
];

// 关键指标摘要
export const keyMetrics = {
  totalSurveys: 9700,
  months: 11,
  buyerAvgNPS: 12.1,
  sellerAvgNPS: -10.2,
  gap: 22.3,
  sellerSuccessNPS: 20.2,
  sellerFailNPS: -55.3,
  topSellerPain: 72.5,
  topBuyerPain: 45.3,
};
