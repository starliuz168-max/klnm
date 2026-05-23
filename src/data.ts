import { Task, DonationProject, DonationLeader, Message, User } from './types';

// The verified mock main user (张小牛)
export const initialUser: User = {
  id: 'user_cow_horse_99',
  name: '张小牛',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxMJ9smkAgQmf_NvA2H15g1luUneBcROqXnICAljm9R7dN6LU6KZOtH1PiH8NIvUu__RJPpnPUD0x1qaQ-Ao8sWZhMUZ_ypDlTYhmZdSPA_vNPHdSqSzHccZKsXGynP2xLeGalE6NgfdkxVF8WBE3U36EsLX2566AlU20pAr2doqggVUg7bY6YAaXXE15TvKL4SKf28Bx3QGveBj6I7mMB4qB91Ek2mR7fA7-TjhjEg9_j4F8xDNx9uO53Fw6vRaDnPQiXFZJwq-vC',
  isVerified: true,
  creditScore: 780,
  rating: 4.9,
  completeCount: 42,
  loveScore: 128,
  walletBalance: 2840.50,
  monthlyIncome: 1200.00,
  frozenAmount: 150.00
};

// Initial task logs (combination of View 1 Standard and view 10 Alternative)
export const initialTasks: Task[] = [
  {
    id: 'task_jingan_clean_280',
    publisherId: 'pub_lin_verified',
    publisherName: '林小姐',
    publisherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqeDiC82pCQo7xURkCPJqkFhnQGKftP3cwFvsHqcK8bReRkUcoVJ_-zoEP7obUXSwM_vZBzWmSQZM5voFjfQcKvGIuYwi08J8QFGR8k6fkkrQ3EPHnbvBj9m1RrU6b8apybQClohXL0Z7OmETWgmhFmBK7uCaODGVRHV_3rBTe3f_X9pm1j_V0L7gyjL6643QiBFuwphweur6r0CVnzB7z3vtk4Qd8v7g8Bd__oo_mr8bajP2oKJrw5pfucW44MzPr2cJzoaDiUD7T',
    publisherCredit: 680,
    publisherVerifyText: '已认证',
    category: 'clean',
    categoryLabel: '家政保洁',
    title: '静安寺附近高档公寓家政深度清洁',
    description: '高档精装公寓，三房两厅，需要对厨房抽油烟机、浴室死角及地板进行深度清洁、除灰和毛发清理。提供优质清洁工具，要求踏实细致，有家政经验者优先。',
    distance: '800m',
    pubTimeText: '2小时前发布',
    serviceTime: '本周内可协定',
    budget: 280,
    status: 'open',
    requirementsList: [
      '1. 深度清扫卧室、客厅、书房的主体灰尘、垃圾。',
      '2. 各玻璃面、镜面光洁无残留水渍印记。',
      '3. 厨房卫生：清理油烟机外壳，台面油垢，洗碗池光亮无污。',
      '4. 卫浴消毒：洗手盆除垢，马桶深层刷洗除味。'
    ]
  },
  {
    id: 'task_xuhui_pet_45',
    publisherId: 'pub_qiang_trust',
    publisherName: '阿强',
    publisherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM1pMTxuDvdtD3OwBBuk-zePrMCUzYelsR3eVYUC21Ab4h9uf_GnpuUDAM4pFfqeJE77kzJHaHkKuGYyW-_6ruNnmkmu_2j3AnIhIfLHstONm6C3s9sXvg973loD5j1StjMWHY2lRoSkVzLP66vHpzrqTqnsVGa_Exxbx8EICriL5gvI_DSPuJbfn5gteE64w7ArM5Wa_osWrsnavax3YdmBEFnF36PZ9zQeR1SrtogwER3QbsH7XEIYvBIS0vroF6SSG_I2RjLw',
    publisherCredit: 720,
    publisherVerifyText: '信用极好',
    category: 'pet',
    categoryLabel: '宠物代遛',
    title: '徐汇滨江代遛金毛狗 30分钟',
    description: '下午遛一条金毛猎犬，狗狗十分温顺不爆冲。请在滨江绿地附近遛犬，自备拾便袋，随时保持牵绳，不能在拥挤路段奔跑。',
    distance: '1.2km',
    pubTimeText: '10分钟前发布',
    serviceTime: '今天下午 16:30 之前',
    budget: 45,
    status: 'open',
    requirementsList: [
      '1. 必须全程紧握牵引绳，严禁松手或中途解开。',
      '2. 携带清水，观察狗狗大便情况并及时用垃圾袋封好丢弃。',
      '3. 代练结束后拍摄 2 张开心的现场视频，方便发单人确认。'
    ]
  },
  {
    id: 'task_putuo_wardrobe_120',
    publisherId: 'pub_zhang_real',
    publisherName: '张先生',
    publisherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaH11JT4NUFN-B8cUAvPMn7QjFZcwzn_hMtIEx9rmAgRuIwBlrQo98jt2kKSd1ZtdT9M6irkWgLA0rUoqquTqsKiDn1uiiTcwWiqxMjncqLTQI5FLfLAt19eM00jtPD7yf8k32awk-eWXRA0dysXlFb0e3w3q-5Q5m8nK3fa4w6SIi7SasRxkTksuNrYT6xbdzM7AMo840E_iYD8lu2NUAv3n8AVGd39lauxgH2ljQBR89yKZdn35WPp_2JanVFR9v_Tl37-24Xl-V',
    publisherCredit: 710,
    publisherVerifyText: '已实名',
    category: 'install',
    categoryLabel: '家修组装',
    title: '帮忙组装宜家两门衣柜 需自带工具',
    description: '工具齐全优先，大概一小时内可以完成。地点在普陀区长寿路街道邻近小区。配件全部齐全，有图纸，只要对照图纸敲敲打打即可。',
    distance: '2.5km',
    pubTimeText: '30分钟前发布',
    serviceTime: '随时均可',
    budget: 120,
    status: 'open',
    requirementsList: [
      '1. 自备内六角、螺丝刀、锤子等宜家衣柜组装常见手持工具。',
      '2. 请细心对准连接件，不要硬敲导致板子爆裂（损坏需照价补偿）。',
      '3. 安装完成后协助摆正到位，并协助带走包装纸箱等垃圾。'
    ]
  },
  {
    id: 'task_lunch_office_35',
    publisherId: 'pub_user123_750',
    publisherName: '用户123',
    publisherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhvnzQgCPmN5FB89OU5tFiFavA_96G-Ax-XBg03a8E4012OGKRAfweV6ycqLu1m0vu9V-YKRREvwmV0duzkDclxdC7MNXTk9Z_6DA9Jot-hQdEGjnyPCXZQB_8jw00ewM7oq0cO_brdGeDqLuVVW62LPufnRs3xSG6yPOkkjCw1RBD7rFJdPvTqU1oeM-o3BVQzB4LuCZ69T-2Ofz4ikA8AiYLmI6d1vYLwmdjLAIN38J0dCX1hpFB7X4RKLboxmoZhUY8KGysb_MV',
    publisherCredit: 750,
    publisherVerifyText: '信用极好',
    category: 'run',
    categoryLabel: '跑腿代买',
    title: '代买三份午餐送至写字楼',
    description: '1. 请在指定餐厅（老王快餐店）购买三份红烧肉套餐。\n2. 套餐需打包好，并确保汤汁不洒出。\n3. 送至国际金融中心 A 座 15 楼 1502 室。\n4. 到达前请提前 5 分钟电话联系，放在前台即可。',
    distance: '1.2km',
    pubTimeText: '10分钟前发布',
    serviceTime: '12:30',
    budget: 35,
    status: 'open',
    requirementsList: [
      '1. 请在指定餐厅（老王快餐店）购买三份红烧肉套餐。',
      '2. 套餐需打包好，并确保汤汁不洒出。',
      '3. 送至国际金融中心 A 座 15 楼 1502 室。',
      '4. 到达前请提前 5 分钟电话联系，放在前台即可。'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlLB_KBMT-_JgKq7zbFnr7orh56QrcOuKY2T1rYy8xiMAHCC-KALpm1Hu5j0vAGpB0BkciEFevCl8BmaS-fd5ND7yQk3w0Qin6aXRJsTd-Aqyl1uU7L_sEcMZMlf7o66oUiOulJ3J3wX5d7PM1VPijCvRAAePz-oH5p8VugvpmFFEwULoZ5ZYIVbXwi6vDaRgO0fuCYB29fxj8B7iZlhHZZV0vUZz5G_rsQuvZ3toPry35VwAMEmF3N_BKoM9lJ8dkVRstK_SCov59'
  },
  {
    id: 'task_tea_buy_15',
    publisherId: 'pub_ann_anonymous',
    publisherName: '匿名用户',
    publisherAvatar: '',
    publisherCredit: 620,
    publisherVerifyText: '成交新星',
    category: 'run',
    categoryLabel: '代买服务',
    title: '代买一杯茶百道，送到写字楼',
    description: '代买一杯杨枝甘露，微糖微冰，尽快送到张江国创中心写字楼3号楼。请在送达时放在写字楼楼下外卖暂存架。',
    distance: '0.3km',
    pubTimeText: '5分钟前发布',
    serviceTime: '立即需要',
    budget: 15,
    status: 'open',
    requirementsList: [
      '1. 指定茶百道门店购买杨枝甘露（微糖微冰）。',
      '2. 到货后放至 3 号楼下外卖置物架第 2 排，拍照留言发送。'
    ]
  },
  {
    id: 'task_tea_milan_20',
    publisherId: 'pub_user_milan_1',
    publisherName: '周生',
    publisherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlf7kfdEoZQAhoho-65j13-qQ5Cf9R1vEylookazj8Xvx5_Mkqf1K-Wh2tl2dw9l2LosIhlJL4RK3_AT8c3ZKgIeE85Inv8vT9_12w6ix9WhSeKI00ezxQElACxOfLYe5LswG7GgHaI_vV7o6uQP8sJ9OdwJrC0b4L5eILDRowxPQTrPSlosONu89bObL6zpypeWNxHVQ74vAV7gbucLZBoirUr2KESwM18tPWedXIJgZM8aj_ekk0oVZiGrLT4XDT1AtvkIDPDpKP',
    publisherCredit: 740,
    publisherVerifyText: '信用极好',
    category: 'run',
    categoryLabel: '跑腿代买',
    title: '代买网红奶茶',
    description: '代买附近人山人海的阿嬷手作，需要排队，代买 1 杯，加料生椰，微冰，请在下午 18:00 前送达。',
    distance: '0.8km',
    pubTimeText: '40分钟前发布',
    serviceTime: '今天 18:00 前',
    budget: 20,
    status: 'open',
    requirementsList: [
      '1. 必须在下午 18:00 之前派送。',
      '2. 到手时如果是冷饮，请确保冰度。物主可以支付额外排队时长的小费。'
    ]
  },
  {
    id: 'task_cat_clean_50',
    publisherId: 'pub_girl_cat_33',
    publisherName: '陈女士',
    publisherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK8-uT880EEm0k6eJzlljfpKHtNKWKVvqWolnD_UzIHpHgE6F_1SX-ZkzXM7GVmJPYy3yPnIa69GTyeZ_Z8dtOBP-bIt5RqxRTp09BeLgYJVjwBZRvTV0UVJawyd4e-Si8SD3Tfl-WY9F38dhAjVpxlKx70OUpn92rDH3P1u4b1928HOnlGk98YmXROH7jLqSe37rlvxrc9-1GmOIO6SrdL8HktG_NtC-jtkl7CMuW0ktSEc3DIEmRW0F_XdK6c00BBXklGtoQsl0i',
    publisherCredit: 760,
    publisherVerifyText: '信用优秀',
    category: 'pet',
    categoryLabel: '宠物照看',
    title: '上门喂猫铲屎',
    description: '由于周末出差，需要靠谱的铲屎官上门给家里的橘猫喂食、换温水并清理猫砂。要求细心对宠物有善心，上门全程保持沟通拍短视频反馈。',
    distance: '1.2km',
    pubTimeText: '25分钟前发布',
    serviceTime: '明天 10:00 前',
    budget: 50,
    status: 'open',
    requirementsList: [
      '1. 上门前后拍摄短视频给物主看猫咪的安全情况。',
      '2. 投喂猫粮并在水碗中注入干净温水。',
      '3. 清理两个猫砂盆，收集排泄物带走，观察猫咪便便成型状况。'
    ]
  },
  {
    id: 'task_exhibition_photo_100',
    publisherId: 'pub_photoman_9',
    publisherName: '赵先生',
    publisherAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCNni7OT0OC6x09xUPvBQZaObjUjaOXJBpSz10m3xLqlxi_QEC8RrznlLMGHUF9TZRVHqLMU_Ey1Ka_7Qk_xkke9OL_n6n8jARMxK3SkqKzyzS9cK_4yUhFXwNP5yvSNSOfEUpJiCroVkk3sCekwGIzen1D27XHhfYEzHYESDty3LoZOxedGeAFCSNb41tFp2eTKYUZn_QH4q5R3J_h_0JGZy24BwnOuXl0mPipkZ1WqpBacuoedqLfOCN2RWf2lpxmd7T0-49B4hB',
    publisherCredit: 730,
    publisherVerifyText: '信用极好',
    category: 'photo',
    categoryLabel: '拍照协助',
    title: '摄影展现场拍照',
    description: '需要找一名备有大光圈镜头的摄友，到虹桥美术馆摄影馆内，在我展示解说时协助拍摄 30 张高情境环境抓拍照片和小短片。',
    distance: '2.5km',
    pubTimeText: '1小时前发布',
    serviceTime: '本周六 全天',
    budget: 100,
    status: 'open',
    requirementsList: [
      '1. 拥有中高端微单或专业抓拍设备。',
      '2. 艺术表达能力强，懂得抓拍人物神情、光影、纵深。',
      '3. 无需精修，活动结束后直出打包给到百度网盘或百度相册传输即可。'
    ]
  }
];

// Initial Messages log (View 11)
export const initialMessages: Message[] = [
  {
    id: 'msg_new_apply_0',
    title: '新申请人通知',
    description: '您的任务“帮忙取中号快递”有新的牛马申请了，点击查看对方信用分及评价。',
    timeText: '14:20',
    type: 'order',
    read: false,
    relatedTaskId: 'task_tea_buy_15'
  },
  {
    id: 'msg_task_done_1',
    title: '任务已完成',
    description: '任务“徐汇滨江代遛金毛狗 30分钟”已由牛马小李提交完成申请，请确认并支付。',
    timeText: '12:05',
    type: 'order',
    read: false,
    relatedTaskId: 'task_xuhui_pet_45'
  },
  {
    id: 'msg_sys_maintenance_2',
    title: '系统维护通知',
    description: '我们将于本周三凌晨2:00-4:00进行系统优化升级，届时可能无法正常访问。请各位牛马注意时间安排。',
    timeText: '昨天',
    type: 'announcement',
    read: true
  },
  {
    id: 'msg_cs_reply_3',
    title: '官方客服小美',
    description: '您好，关于您反馈的任务纠纷问题，我们已经受理并已冻结相关金额，预计 24 小时内有专人跟进裁判，谢谢您的支持！',
    timeText: '昨天',
    type: 'support',
    read: true
  }
];

// Donation targets (View 3)
export const initialDonations: DonationProject[] = [
  {
    id: 'donate_project_1',
    title: '乡村教育助学计划',
    tag: '教育',
    description: '为偏远地区的学子提供必要的学习文具与课外读物，让梦想不因大山而止步。每一笔爱心分都将采购实用的铅笔、作业本和精装课外书送抵希望学校。',
    progressPercent: 82,
    currentPoints: 8200,
    targetPoints: 10000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtFBwMh7yyZTE8NhEUFhGfMDgWn_1SYUD2XhbXa0CD9k5Bv5q-t7AATUBCzRsDeHpYXKiXYjTjAKESfbbjSJaKR_h-k_0pAc3afb-KoJg586xczAHPUkf__ZsjYaA021SeXUs-ljabZxCUe6dd1qFu6U7xLTYExw1AgNvei7Pc-psP9I0KdilO-CQikMht2L8RFatvRtnKcGcFZdUo9SbqGdmXLtElzg0PbLu1PUDgHGScVk6EhP5Pla8pGVVWha5XLjDGjNkieg'
  },
  {
    id: 'donate_project_2',
    title: '流浪动物救助驿站',
    tag: '动物',
    description: '为社区里无家可归的猫咪和狗狗提供过冬口粮、必要的疫苗接种、驱虫费用以及搭建温馨的室外临时庇护所。愿每一只毛孩子都能平安度过严寒。',
    progressPercent: 45,
    currentPoints: 2250,
    targetPoints: 5000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD61q2C2HI9-2nAd2_VtaN5w3UwxlFXmt6xFY_g55Ma5e2e3o4m1xIQdFOfPUsHvTEx-wJ_Fkvj8jWs-N7XAIPu91zvgs7Crtj8ohW5LtIY6LnYM0NaDSwSkRJVVfvaH7tubS_vPWSzSqD46KLeRzYcFfcTryRaSkUlw3mtnSGm2neC63vABTlXiNsXIoNgftC1MEiY-6zwsCpxplvJsizUDqL8krUWmv9nDkQ5s6bIXRReXBP7vR9Vcvg9S6K9PGuwST1_XarXCw'
  }
];

// Honor Roll Leaders (View 3)
export const initialLeaders: DonationLeader[] = [
  {
    id: 'leader_1',
    name: '勤劳的小王',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ_Fpu3uKU-CJLd6UGLWSJLLKpI0A48JyMa3JLX6lVluVCbRSI6yVKBeJlG0hXxvCVviE26JgUGOsyQtsjqgyMRo08NQMRxAOxJXsnhWa-ZbojF_RbmuklHCUtO2dWdcAyAWKHnY-DslIwwPabDtdBfxHmy_bGxzmeT0PEeOolJl86hNc2SMvJ5Ap7OE8LOjHMxAFBhqmvLusuu51RU0tye6f-L5yqMxEzA0tXYanDR1YBfXg-UuTnTDtOzgiR_4vLdzJpsCU0-Q',
    rank: 1,
    points: 1240
  },
  {
    id: 'leader_2',
    name: '上海搬砖工',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM1pMTxuDvdtD3OwBBuk-zePrMCUzYelsR3eVYUC21Ab4h9uf_GnpuUDAM4pFfqeJE77kzJHaHkKuGYyW-_6ruNnmkmu_2j3AnIhIfLHstONm6C3s9sXvg973loD5j1StjMWHY2lRoSkVzLP66vHpzrqTqnsVGa_Exxbx8EICriL5gvI_DSPuJbfn5gteE64w7ArM5Wa_osWrsnavax3YdmBEFnF36PZ9zQeR1SrtogwER3QbsH7XEIYvBIS0vroF6SSG_I2RjLw',
    rank: 2,
    points: 980
  }
];
