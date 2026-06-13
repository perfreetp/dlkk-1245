
import { Client, AssessmentScale, AssessmentResult, Interview, Report, Task, Appointment, KanbanItem } from '../types';

export const mockClients: Client[] = [
  { id: '1', name: '张明', gender: '男', age: 28, email: 'zhangming@example.com', phone: '13800138001', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: '李婷', gender: '女', age: 32, email: 'liting@example.com', phone: '13800138002', status: 'active', createdAt: '2024-01-20' },
  { id: '3', name: '王强', gender: '男', age: 35, email: 'wangqiang@example.com', phone: '13800138003', status: 'active', createdAt: '2024-02-01' },
  { id: '4', name: '刘芳', gender: '女', age: 26, email: 'liufang@example.com', phone: '13800138004', status: 'inactive', createdAt: '2024-02-10' },
  { id: '5', name: '陈伟', gender: '男', age: 40, email: 'chenwei@example.com', phone: '13800138005', status: 'active', createdAt: '2024-02-15' },
  { id: '6', name: '赵丽', gender: '女', age: 29, email: 'zhaoli@example.com', phone: '13800138006', status: 'completed', createdAt: '2024-01-05' },
];

export const mockScales: AssessmentScale[] = [
  {
    id: 's1',
    name: '职业兴趣测评',
    type: '兴趣探索',
    questions: [
      { id: 'q1', text: '您喜欢与人打交道的工作吗？', options: ['非常喜欢', '喜欢', '一般', '不喜欢', '非常不喜欢'], weight: 5 },
      { id: 'q2', text: '您喜欢分析数据和解决问题吗？', options: ['非常喜欢', '喜欢', '一般', '不喜欢', '非常不喜欢'], weight: 5 },
      { id: 'q3', text: '您喜欢创意和艺术表达吗？', options: ['非常喜欢', '喜欢', '一般', '不喜欢', '非常不喜欢'], weight: 5 },
      { id: 'q4', text: '您喜欢结构化和规律性的工作吗？', options: ['非常喜欢', '喜欢', '一般', '不喜欢', '非常不喜欢'], weight: 5 },
      { id: 'q5', text: '您喜欢领导和管理他人吗？', options: ['非常喜欢', '喜欢', '一般', '不喜欢', '非常不喜欢'], weight: 5 },
    ],
    scoringRules: [
      { range: [20, 25], label: '高兴趣', description: '强烈的职业兴趣倾向' },
      { range: [15, 19], label: '中等兴趣', description: '有一定的兴趣倾向' },
      { range: [5, 14], label: '低兴趣', description: '兴趣倾向较弱' },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 's2',
    name: '职业能力测评',
    type: '能力评估',
    questions: [
      { id: 'q1', text: '您的逻辑思维能力如何？', options: ['优秀', '良好', '一般', '较弱', '很差'], weight: 5 },
      { id: 'q2', text: '您的沟通表达能力如何？', options: ['优秀', '良好', '一般', '较弱', '很差'], weight: 5 },
      { id: 'q3', text: '您的团队协作能力如何？', options: ['优秀', '良好', '一般', '较弱', '很差'], weight: 5 },
      { id: 'q4', text: '您的学习能力如何？', options: ['优秀', '良好', '一般', '较弱', '很差'], weight: 5 },
      { id: 'q5', text: '您的抗压能力如何？', options: ['优秀', '良好', '一般', '较弱', '很差'], weight: 5 },
    ],
    scoringRules: [
      { range: [20, 25], label: '优秀', description: '能力表现优秀' },
      { range: [15, 19], label: '良好', description: '能力表现良好' },
      { range: [5, 14], label: '需提升', description: '能力需要提升' },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 's3',
    name: '职业价值观测评',
    type: '价值观探索',
    questions: [
      { id: 'q1', text: '工作稳定性对您重要吗？', options: ['非常重要', '重要', '一般', '不重要', '非常不重要'], weight: 5 },
      { id: 'q2', text: '工作中的创造性对您重要吗？', options: ['非常重要', '重要', '一般', '不重要', '非常不重要'], weight: 5 },
      { id: 'q3', text: '工作收入对您重要吗？', options: ['非常重要', '重要', '一般', '不重要', '非常不重要'], weight: 5 },
      { id: 'q4', text: '工作与生活平衡对您重要吗？', options: ['非常重要', '重要', '一般', '不重要', '非常不重要'], weight: 5 },
      { id: 'q5', text: '职业发展空间对您重要吗？', options: ['非常重要', '重要', '一般', '不重要', '非常不重要'], weight: 5 },
    ],
    scoringRules: [
      { range: [20, 25], label: '高度重视', description: '该价值观高度重视' },
      { range: [15, 19], label: '较为重视', description: '该价值观较为重视' },
      { range: [5, 14], label: '不太重视', description: '该价值观不太重视' },
    ],
    createdAt: '2024-01-01',
  },
];

export const mockAssessmentResults: AssessmentResult[] = [
  { id: 'ar1', clientId: '1', scaleId: 's1', score: 18, detailedScore: { '社会型': 20, '研究型': 15, '艺术型': 18, '常规型': 12, '企业型': 16 }, completedAt: '2024-01-20', scale: mockScales[0] },
  { id: 'ar2', clientId: '1', scaleId: 's2', score: 22, detailedScore: { '逻辑思维': 24, '沟通表达': 20, '团队协作': 22, '学习能力': 23, '抗压能力': 21 }, completedAt: '2024-01-22', scale: mockScales[1] },
  { id: 'ar3', clientId: '2', scaleId: 's1', score: 16, detailedScore: { '社会型': 14, '研究型': 18, '艺术型': 22, '常规型': 10, '企业型': 16 }, completedAt: '2024-01-25', scale: mockScales[0] },
  { id: 'ar4', clientId: '3', scaleId: 's1', score: 20, detailedScore: { '社会型': 16, '研究型': 22, '艺术型': 14, '常规型': 20, '企业型': 20 }, completedAt: '2024-02-05', scale: mockScales[0] },
  { id: 'ar5', clientId: '3', scaleId: 's3', score: 17, detailedScore: { '稳定性': 15, '创造性': 18, '收入': 20, '平衡': 14, '发展空间': 18 }, completedAt: '2024-02-08', scale: mockScales[2] },
];

export const mockInterviews: Interview[] = [
  { id: 'i1', clientId: '1', counselorId: 'c1', date: '2024-01-25', content: '来访者自述近期工作压力大，对当前职业发展方向感到迷茫，希望通过职业咨询找到更适合自己的发展路径。主要困惑在于如何平衡兴趣与现实需求。', confusionTypes: ['职业方向困惑', '工作压力'] },
  { id: 'i2', clientId: '1', counselorId: 'c1', date: '2024-02-01', content: '本次访谈重点探讨了来访者的职业兴趣测评结果，分析了其优势和潜在发展领域。来访者表现出较强的社会型和艺术型倾向。', confusionTypes: ['职业兴趣探索'] },
  { id: 'i3', clientId: '2', counselorId: 'c1', date: '2024-01-28', content: '来访者对当前工作内容缺乏兴趣，希望转型到更具创造性的领域。需要进一步了解其技能储备和转型意愿。', confusionTypes: ['职业转型困惑', '工作满意度'] },
  { id: 'i4', clientId: '3', counselorId: 'c1', date: '2024-02-10', content: '来访者在当前岗位工作5年，感觉职业发展遇到瓶颈，希望了解晋升路径和外部机会。讨论了行业发展趋势和个人能力提升方向。', confusionTypes: ['职业发展瓶颈', '晋升困惑'] },
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    clientId: '1',
    counselorId: 'c1',
    content: {
      strengths: ['良好的沟通能力', '较强的学习能力', '积极的工作态度', '团队协作精神'],
      limitations: ['职业方向不够明确', '缺乏系统的职业规划', '抗压能力有待提升'],
      recommendations: ['建议进行深入的职业兴趣探索', '制定短期和长期职业发展目标', '考虑参加相关培训提升专业技能'],
      careerDirections: ['市场营销', '人力资源', '教育培训', '心理咨询'],
      explorationTasks: ['完成职业兴趣深度测评', '调研目标行业发展前景', '进行职业访谈', '制定个人发展计划'],
      summary: '综合测评结果和访谈分析，来访者具有良好的沟通能力和学习能力，适合与人打交道的工作环境。建议重点探索市场营销、人力资源等方向。',
    },
    version: 1,
    generatedAt: '2024-02-05',
    sendStatus: 'draft',
  },
  {
    id: 'r2',
    clientId: '2',
    counselorId: 'c1',
    content: {
      strengths: ['富有创造力', '艺术感知力强', '思维活跃', '适应能力强'],
      limitations: ['职业转型经验不足', '相关技能储备不够', '对目标行业了解有限'],
      recommendations: ['建议系统学习目标领域知识', '积累相关实践经验', '建立行业人脉'],
      careerDirections: ['UI设计', '品牌策划', '广告创意', '新媒体运营'],
      explorationTasks: ['学习设计软件技能', '建立个人作品集', '参与行业交流活动', '寻找实习或兼职机会'],
      summary: '来访者具有较强的艺术型职业倾向，富有创造力和想象力。建议转型到创意设计相关领域，需要系统学习和实践积累。',
    },
    version: 1,
    generatedAt: '2024-02-08',
    sendStatus: 'draft',
  },
];

export const mockTasks: Task[] = [
  { id: 't1', clientId: '1', title: '完成职业兴趣深度测评', description: '在线完成霍兰德职业兴趣测试', deadline: '2024-02-15', status: 'completed', completedAt: '2024-02-10' },
  { id: 't2', clientId: '1', title: '调研目标行业', description: '了解市场营销和人力资源行业的发展前景', deadline: '2024-02-20', status: 'in_progress' },
  { id: 't3', clientId: '1', title: '制定个人发展计划', description: '根据测评结果制定3年职业发展规划', deadline: '2024-02-28', status: 'pending' },
  { id: 't4', clientId: '2', title: '学习设计软件', description: '学习Figma和Photoshop基础操作', deadline: '2024-02-25', status: 'in_progress' },
  { id: 't5', clientId: '2', title: '建立作品集', description: '整理个人设计作品，建立在线作品集', deadline: '2024-03-05', status: 'pending' },
  { id: 't6', clientId: '3', title: '更新简历', description: '根据职业目标优化简历内容', deadline: '2024-02-18', status: 'pending' },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', clientId: '1', counselorId: 'c1', datetime: '2024-02-15 14:00', status: 'completed', notes: '讨论测评结果和初步职业方向' },
  { id: 'a2', clientId: '1', counselorId: 'c1', datetime: '2024-02-22 10:00', status: 'scheduled', notes: '跟踪任务完成情况，制定下一步计划' },
  { id: 'a3', clientId: '2', counselorId: 'c1', datetime: '2024-02-16 15:00', status: 'scheduled', notes: '讨论职业转型路径' },
  { id: 'a4', clientId: '3', counselorId: 'c1', datetime: '2024-02-18 09:00', status: 'scheduled', notes: '分析职业发展瓶颈解决方案' },
  { id: 'a5', clientId: '4', counselorId: 'c1', datetime: '2024-02-20 11:00', status: 'scheduled', notes: '初次咨询，了解基本情况' },
];

export const mockKanbanItems: KanbanItem[] = [
  { id: 'k1', title: '完成职业兴趣测评', clientName: '张明', type: 'task', dueDate: '2024-02-15', status: 'completed' },
  { id: 'k2', title: '调研目标行业', clientName: '张明', type: 'task', dueDate: '2024-02-20', status: 'in_progress' },
  { id: 'k3', title: '制定发展计划', clientName: '张明', type: 'task', dueDate: '2024-02-28', status: 'pending' },
  { id: 'k4', title: '学习设计软件', clientName: '李婷', type: 'task', dueDate: '2024-02-25', status: 'in_progress' },
  { id: 'k5', title: '建立作品集', clientName: '李婷', type: 'task', dueDate: '2024-03-05', status: 'pending' },
  { id: 'k6', title: '更新简历', clientName: '王强', type: 'task', dueDate: '2024-02-18', status: 'pending' },
  { id: 'k7', title: '职业咨询预约', clientName: '李婷', type: 'appointment', dueDate: '2024-02-16', status: 'pending' },
  { id: 'k8', title: '测评发放跟进', clientName: '刘芳', type: 'assessment', dueDate: '2024-02-17', status: 'pending' },
];
