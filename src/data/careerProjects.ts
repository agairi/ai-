import type { ProjectGoal } from './projectGoals';

export const CAREER_PROJECTS: ProjectGoal[] = [
  // 前端开发工程师
  {
    id: 'pg-career-frontend',
    skillId: 'react',
    title: '企业级后台管理系统',
    description: '开发一套完整的企业级后台管理系统，包含用户管理、权限控制、数据表格、图表可视化等功能。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '使用 React + TypeScript + Ant Design 技术栈',
      '实现用户登录、权限路由、角色管理',
      '实现数据表格（排序、筛选、分页）',
      '集成 ECharts 实现数据可视化图表',
      '使用 React Query 管理服务端状态',
    ],
    estimatedTime: '4-6 周',
    verificationMethod: '项目完成',
  },

  // 后端开发工程师
  {
    id: 'pg-career-backend',
    skillId: 'nodejs',
    title: '电商订单系统后端',
    description: '开发电商订单系统的完整后端服务，包含商品、购物车、订单、支付等核心模块。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '使用 Node.js + Express/Mongoose 技术栈',
      '实现商品 CRUD、库存管理',
      '实现购物车增删改查',
      '实现订单创建、支付回调、退款流程',
      '编写单元测试与 API 文档',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '代码提交',
  },

  // Java后端工程师
  {
    id: 'pg-career-java',
    skillId: 'spring',
    title: 'Spring Boot 微服务网关',
    description: '基于 Spring Cloud 构建微服务网关，实现统一认证、路由转发、限流熔断。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '使用 Spring Cloud Gateway 实现网关路由',
      '集成 Spring Security + JWT 统一认证',
      '使用 Sentinel 实现限流熔断',
      '配置 Nacos 服务注册与发现',
      '实现灰度发布与链路追踪',
    ],
    estimatedTime: '4-5 周',
    verificationMethod: '实操演示',
  },

  // 全栈开发工程师
  {
    id: 'pg-career-fullstack',
    skillId: 'nextjs',
    title: '全栈社区论坛系统',
    description: '独立开发一套全栈社区论坛系统，包含帖子、评论、用户、私信等功能。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '使用 Next.js + TypeScript + PostgreSQL',
      '实现帖子 CRUD、Markdown 渲染',
      '实现评论楼中楼、点赞收藏',
      '实现用户私信系统',
      '部署到 Vercel 并配置域名',
    ],
    estimatedTime: '4-6 周',
    verificationMethod: '项目完成',
  },

  // AI工程师
  {
    id: 'pg-career-ai',
    skillId: 'pytorch',
    title: '图像目标检测系统',
    description: '基于 YOLO 模型构建图像目标检测系统，实现实时检测与结果可视化。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '使用 PyTorch 复现 YOLOv5/v8 模型',
      '在 COCO 数据集上训练与验证',
      '实现实时视频流检测',
      '开发 Web API 服务端部署',
      '制作检测结果可视化界面',
    ],
    estimatedTime: '4-6 周',
    verificationMethod: '实操演示',
  },

  // 大模型应用工程师
  {
    id: 'pg-career-llm',
    skillId: 'langchain',
    title: '企业智能知识库问答系统',
    description: '基于 LangChain + LLM 构建企业知识库问答系统，支持文档上传、问答检索、多轮对话。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '实现文档上传与解析（PDF/Word/Markdown）',
      '使用 Embedding + 向量数据库存储',
      '构建 RAG 检索增强生成链路',
      '支持多轮对话与上下文管理',
      '开发 Web 界面进行交互',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // 数据分析师
  {
    id: 'pg-career-analyst',
    skillId: 'pandas',
    title: '电商用户行为分析报告',
    description: '对电商用户行为数据进行深度分析，输出业务洞察报告与可视化看板。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '清洗与预处理用户行为数据集',
      '分析用户留存、转化、复购率',
      '构建用户分群与价值模型',
      '使用 Tableau/Power BI 制作可视化看板',
      '撰写分析报告与改进建议',
    ],
    estimatedTime: '2-3 周',
    verificationMethod: '项目完成',
  },

  // 数据工程师
  {
    id: 'pg-career-dataeng',
    skillId: 'kafka',
    title: '实时数据处理管道',
    description: '基于 Kafka + Flink 构建实时数据处理管道，实现日志采集、实时计算与数据入库。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '部署 Kafka 集群与 Producer/Consumer',
      '使用 Flink 实现实时流计算',
      '实现数据清洗、聚合、窗口计算',
      '写入 ClickHouse/Elasticsearch',
      '监控数据管道运行状态',
    ],
    estimatedTime: '4-5 周',
    verificationMethod: '实操演示',
  },

  // DevOps工程师
  {
    id: 'pg-career-devops',
    skillId: 'kubernetes',
    title: '企业级 K8s 平台建设',
    description: '搭建企业级 Kubernetes 平台，实现应用部署、运维管理、自动化运维。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '搭建多节点 K8s 集群（高可用控制平面）',
      '配置 Ingress Controller 与证书管理',
      '实现应用灰度发布与回滚',
      '配置 HPA/VPA 自动扩缩容',
      '集成监控告警与日志系统',
    ],
    estimatedTime: '4-6 周',
    verificationMethod: '实操演示',
  },

  // 移动端开发工程师
  {
    id: 'pg-career-mobile',
    skillId: 'react-native',
    title: '跨平台外卖配送 App',
    description: '开发跨平台外卖配送 App，包含商家列表、购物车、订单、地图定位等功能。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '使用 React Native + TypeScript',
      '实现商家列表与商品展示',
      '集成地图 SDK 实现定位与导航',
      '实现订单状态实时推送',
      '适配 iOS/Android 双平台',
    ],
    estimatedTime: '4-6 周',
    verificationMethod: '项目完成',
  },

  // 网络安全工程师
  {
    id: 'pg-career-security',
    skillId: 'web-security',
    title: '企业安全渗透测试实战',
    description: '对企业 Web 应用进行全面渗透测试，发现漏洞并输出修复方案。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '使用 Burp Suite 进行漏洞扫描',
      '检测并利用 SQL 注入、XSS、CSRF',
      '检测文件上传、命令注入漏洞',
      '进行身份认证与授权测试',
      '输出渗透测试报告与修复建议',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '实操演示',
  },

  // 游戏开发工程师
  {
    id: 'pg-career-game',
    skillId: 'unity',
    title: '2D 横版动作游戏开发',
    description: '使用 Unity 开发一款 2D 横版动作游戏，包含角色、敌人、关卡、UI 等完整功能。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '使用 Unity 2D 搭建游戏场景',
      '实现角色移动、攻击、跳跃',
      '实现敌人 AI 与战斗系统',
      '设计关卡与道具系统',
      '实现 UI 界面与游戏存档',
    ],
    estimatedTime: '4-6 周',
    verificationMethod: '项目完成',
  },

  // 云计算工程师
  {
    id: 'pg-career-cloud',
    skillId: 'cloud-aws',
    title: '云原生应用全栈部署',
    description: '将微服务应用部署到云平台，实现高可用、弹性伸缩、成本优化。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '使用 Terraform 定义云资源',
      '部署容器化应用到 ECS/EKS',
      '配置 ALB 负载均衡与 Auto Scaling',
      '实现数据库读写分离',
      '配置 CloudWatch 监控与告警',
    ],
    estimatedTime: '4-5 周',
    verificationMethod: '实操演示',
  },

  // 区块链工程师
  {
    id: 'pg-career-blockchain',
    skillId: 'solidity',
    title: '去中心化 NFT 交易市场',
    description: '开发去中心化 NFT 交易市场，实现 NFT 铸造、上架、购买等核心功能。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '使用 Solidity 编写智能合约',
      '实现 NFT 铸造与元数据管理',
      '实现订单簿与交易撮合',
      '开发 Web3 前端交互界面',
      '部署到测试网并进行测试',
    ],
    estimatedTime: '4-6 周',
    verificationMethod: '项目完成',
  },

  // 嵌入式工程师
  {
    id: 'pg-career-embedded',
    skillId: 'embedded',
    title: '智能温湿度监控系统',
    description: '基于 Arduino/STM32 开发智能温湿度监控系统，实现数据采集、传输与远程控制。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '使用 Arduino/STM32 开发硬件驱动',
      '连接温湿度传感器与显示屏',
      '实现 WiFi/蓝牙数据上传',
      '开发云端数据接收与展示',
      '实现远程控制与告警',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '实操演示',
  },

  // 测试工程师
  {
    id: 'pg-career-test',
    skillId: 'python',
    title: '自动化测试框架搭建',
    description: '搭建企业级自动化测试框架，实现接口测试、UI 测试、性能测试。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '使用 pytest 编写接口测试用例',
      '使用 Selenium/Playwright 编写 UI 测试',
      '使用 Locust 进行性能测试',
      '集成 Allure 生成测试报告',
      '配置 CI/CD 自动化执行',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '代码提交',
  },

  // 技术产品经理
  {
    id: 'pg-career-pm',
    skillId: 'product-design',
    title: '产品需求文档与原型设计',
    description: '完成一款 SaaS 产品的完整需求分析、竞品调研、原型设计与 PRD 文档。',
    difficulty: 3,
    type: '实战练习',
    requirements: [
      '进行竞品分析与市场调研',
      '完成用户画像与需求梳理',
      '使用 Figma 设计产品原型',
      '撰写完整 PRD 文档',
      '输出交互流程图与状态图',
    ],
    estimatedTime: '2-3 周',
    verificationMethod: '项目完成',
  },

  // 技术架构师
  {
    id: 'pg-career-architect',
    skillId: 'system-design',
    title: '百万级高并发系统架构设计',
    description: '设计支持百万级 QPS 的电商秒杀系统，涵盖架构选型、容量评估、高可用设计。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '进行业务分析与容量评估',
      '设计系统架构图与模块划分',
      '设计数据库分库分表方案',
      '设计缓存策略与消息队列',
      '编写完整架构设计文档',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // UI/UX设计师
  {
    id: 'pg-career-ui',
    skillId: 'figma',
    title: '移动端 App UI/UX 设计',
    description: '为一款健康管理 App 完成完整的 UI/UX 设计，包含用户研究、界面设计、交互设计。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '进行用户研究与需求分析',
      '设计信息架构与用户流程',
      '使用 Figma 完成 UI 设计稿',
      '制作交互原型与动效',
      '输出设计规范文档',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // Go后端工程师
  {
    id: 'pg-career-go',
    skillId: 'gin',
    title: 'Go 语言微服务架构',
    description: '使用 Go 语言构建微服务架构，包含服务发现、RPC 调用、链路追踪。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '使用 Gin 框架开发多个微服务',
      '使用 gRPC 实现服务间通信',
      '集成 Consul/Etcd 服务发现',
      '使用 OpenTelemetry 链路追踪',
      '编写单元测试与基准测试',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '代码提交',
  },

  // 网络工程师
  {
    id: 'pg-career-network',
    skillId: 'routing-switching',
    title: '企业网络全场景配置',
    description: '在模拟器中完成企业网络全场景配置，包含 VLAN、路由、安全、无线等。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '配置交换机 VLAN 划分与 Trunk',
      '配置路由器 OSPF/BGP 动态路由',
      '配置防火墙安全策略',
      '配置 WiFi 无线网络',
      '配置网络监控与故障排查',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '实操演示',
  },

  // 高级网络工程师
  {
    id: 'pg-career-senior-network',
    skillId: 'isp-bgp',
    title: '运营商级网络架构设计',
    description: '设计运营商级网络架构，包含 BGP 路由策略、流量工程、冗余备份。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '设计多区域 OSPF 网络',
      '配置 BGP 路由策略与过滤',
      '实现流量工程与负载均衡',
      '设计网络冗余与快速收敛',
      '编写网络设计方案文档',
    ],
    estimatedTime: '4-5 周',
    verificationMethod: '项目完成',
  },

  // IT运维工程师
  {
    id: 'pg-career-itops',
    skillId: 'backup-recovery',
    title: '企业备份与灾备方案实施',
    description: '为企业部署完整的备份与灾备方案，确保数据安全与业务连续性。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '设计备份策略（全量/增量/差异）',
      '部署备份软件与存储设备',
      '配置异地灾备与数据同步',
      '执行备份恢复演练',
      '编写运维手册与应急预案',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '实操演示',
  },

  // 高级IT运维工程师
  {
    id: 'pg-career-senior-itops',
    skillId: 'monitoring',
    title: '企业运维自动化平台建设',
    description: '搭建企业运维自动化平台，实现资产管理、配置管理、自动化运维。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '使用 Ansible 实现配置自动化',
      '搭建 CMDB 资产管理系统',
      '实现自动化巡检与告警',
      '配置自动化部署流水线',
      '集成运维知识库',
    ],
    estimatedTime: '4-5 周',
    verificationMethod: '项目完成',
  },

  // IT经理
  {
    id: 'pg-career-itmanager',
    skillId: 'project-management',
    title: 'IT项目全周期管理',
    description: '模拟管理一个 IT 项目，从立项、规划、执行到验收的全周期管理。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '编写项目立项报告与可行性分析',
      '制定项目计划与资源分配',
      '管理项目进度与风险',
      '协调团队沟通与汇报',
      '编写项目验收文档',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // 技术项目经理
  {
    id: 'pg-career-tpm',
    skillId: 'agile',
    title: '敏捷项目管理实战',
    description: '使用 Scrum/Kanban 方法管理一个软件开发项目，实现敏捷交付。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '制定产品 Backlog 与迭代计划',
      '主持每日站会与 Sprint Review',
      '使用看板管理工作流',
      '管理需求变更与风险',
      '输出项目度量报告',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // 数据库管理员(DBA)
  {
    id: 'pg-career-dba',
    skillId: 'mysql',
    title: '数据库性能优化实战',
    description: '对大型 MySQL 数据库进行性能优化，包含慢查询优化、索引优化、架构优化。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '分析慢查询日志并优化 SQL',
      '设计合理的索引策略',
      '配置主从复制与读写分离',
      '进行数据库压力测试',
      '制定数据库备份与恢复策略',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '实操演示',
  },

  // 系统分析师
  {
    id: 'pg-career-sysanalyst',
    skillId: 'requirement-analysis',
    title: '企业信息系统需求分析',
    description: '为企业进行信息系统需求分析，输出需求规格说明书与系统设计方案。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '进行业务流程调研与分析',
      '编写需求规格说明书',
      '设计系统功能与非功能需求',
      '输出系统架构设计方案',
      '编写接口规格文档',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // 计算机教师
  {
    id: 'pg-career-teacher',
    skillId: 'tech-writing',
    title: '编程课程教学设计',
    description: '设计一门完整的编程入门课程，包含教学大纲、教案、课件与练习题。',
    difficulty: 3,
    type: '实战练习',
    requirements: [
      '制定课程目标与教学大纲',
      '编写每节课的详细教案',
      '制作教学课件（PPT/视频）',
      '设计课后练习与作业',
      '编写课程考核方案',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // 测试主管
  {
    id: 'pg-career-qalead',
    skillId: 'quality-management',
    title: '测试质量管理体系搭建',
    description: '为企业搭建测试质量管理体系，包含测试流程、质量标准、度量指标。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '制定测试流程与规范',
      '设计测试用例管理体系',
      '建立质量度量指标体系',
      '制定缺陷管理流程',
      '编写测试管理文档',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '项目完成',
  },

  // 网络安全专家
  {
    id: 'pg-career-security-expert',
    skillId: 'network-security',
    title: '企业安全架构设计',
    description: '为企业设计完整的安全架构，包含网络安全、应用安全、数据安全。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '进行安全风险评估',
      '设计网络安全架构',
      '设计应用安全防护方案',
      '制定数据安全策略',
      '编写安全合规文档',
    ],
    estimatedTime: '4-5 周',
    verificationMethod: '项目完成',
  },

  // 数通工程师
  {
    id: 'pg-career-datacom',
    skillId: 'ospf-bgp',
    title: '数通网络全量配置实战',
    description: '完成数通工程师认证级别的网络配置实战，包含路由交换、VPN、QoS 等。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '配置 VLAN/STP 二层网络',
      '配置 OSPF 动态路由',
      '配置 BGP 路由策略',
      '配置 IPSec/GRE VPN',
      '配置 QoS 流量控制',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '实操演示',
  },

  // 网络架构师
  {
    id: 'pg-career-network-arch',
    skillId: 'network-design',
    title: '大型园区网络架构设计',
    description: '为大型园区设计完整的网络架构方案，包含核心、汇聚、接入三层架构。',
    difficulty: 5,
    type: '实战练习',
    requirements: [
      '设计三层网络拓扑架构',
      '规划 IP 地址与 VLAN',
      '设计冗余与高可用方案',
      '规划网络安全策略',
      '编写网络设计方案文档',
    ],
    estimatedTime: '4-5 周',
    verificationMethod: '项目完成',
  },

  // 无线网络工程师
  {
    id: 'pg-career-wireless',
    skillId: 'wireless-network',
    title: '企业 WiFi 网络规划与优化',
    description: '为企业进行 WiFi 网络规划、部署与优化，确保覆盖与性能。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '进行 WiFi 信号勘测与规划',
      '部署无线控制器与 AP',
      '配置 WiFi 安全策略',
      '优化信道与功率',
      '进行网络性能测试',
    ],
    estimatedTime: '3-4 周',
    verificationMethod: '实操演示',
  },

  // 售前工程师
  {
    id: 'pg-career-presales',
    skillId: 'tech-writing',
    title: '技术方案编写与演示',
    description: '编写完整的技术解决方案文档，并进行产品演示与客户答疑。',
    difficulty: 4,
    type: '实战练习',
    requirements: [
      '理解客户需求并进行分析',
      '编写技术方案文档',
      '制作产品演示 PPT',
      '进行方案讲解与演示',
      '准备投标文件与报价',
    ],
    estimatedTime: '2-3 周',
    verificationMethod: '项目完成',
  },

  // 售后工程师
  {
    id: 'pg-career-aftersales',
    skillId: 'network-troubleshooting',
    title: '网络故障排查与客户培训',
    description: '模拟企业网络故障排查，并为客户提供技术培训与支持。',
    difficulty: 3,
    type: '实战练习',
    requirements: [
      '进行网络故障定位与排查',
      '编写故障处理报告',
      '为客户提供技术培训',
      '编写运维手册',
      '进行客户满意度回访',
    ],
    estimatedTime: '2-3 周',
    verificationMethod: '实操演示',
  },
];

export default CAREER_PROJECTS;