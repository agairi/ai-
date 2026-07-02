import React, { useState } from 'react';
import { Sparkles, Search, BookOpen, Video, FileText, Link } from 'lucide-react';

interface LearningRecommendation {
  skill: string;
  description: string;
  duration: string;
  difficulty: string;
  resources: {
    type: 'video' | 'article' | 'book' | 'practice';
    title: string;
    url: string;
    description: string;
  }[];
}

const LEARNING_DATA: Record<string, LearningRecommendation> = {
  'python': {
    skill: 'Python',
    description: 'Python是一种简单易学的编程语言，适合新手入门。学会后可以做数据分析、网站开发、自动化脚本等。',
    duration: '入门约2-3周，精通需要2-3个月持续练习',
    difficulty: '简单',
    resources: [
      { type: 'video', title: 'Python零基础入门教程', url: 'https://www.bilibili.com/video/BV1c64y1Y7kN', description: 'B站热门教程，从安装到实战项目' },
      { type: 'article', title: '菜鸟教程 Python', url: 'https://www.runoob.com/python3/python3-tutorial.html', description: '在线教程，边看边练' },
      { type: 'book', title: 'Python编程：从入门到实践', url: 'https://book.douban.com/subject/26829016/', description: '畅销书，有大量练习项目' },
      { type: 'practice', title: 'LeetCode Python练习', url: 'https://leetcode.cn/problemset/all/', description: '刷题提升编程能力' },
    ],
  },
  'javascript': {
    skill: 'JavaScript',
    description: 'JavaScript是网页开发必备语言，让网页有交互功能。学会后可以做前端开发、小程序、甚至后端开发。',
    duration: '入门约3-4周，熟练需要3-4个月项目实战',
    difficulty: '中等',
    resources: [
      { type: 'video', title: 'JavaScript基础教程', url: 'https://www.bilibili.com/video/BV1YW411T7GX', description: 'B站教程，详细讲解核心概念' },
      { type: 'article', title: 'MDN JavaScript教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', description: '官方文档，权威准确' },
      { type: 'book', title: 'JavaScript高级程序设计', url: 'https://book.douban.com/subject/10546125/', description: '经典红宝书，深入理解JS' },
      { type: 'practice', title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/chinese/', description: '免费实战练习平台' },
    ],
  },
  'react': {
    skill: 'React',
    description: 'React是目前最流行的前端框架，用于构建大型网页应用。很多大公司都在用，学会后就业机会多。',
    duration: '入门约3周，熟练需要2-3个月项目实战',
    difficulty: '中等',
    resources: [
      { type: 'video', title: 'React18入门教程', url: 'https://www.bilibili.com/video/BV1ZB4y1Z7bE', description: '最新版React教程' },
      { type: 'article', title: 'React官方文档', url: 'https://react.dev/learn', description: '官方教程，有中文版' },
      { type: 'book', title: 'React学习手册', url: 'https://book.douban.com/subject/30161831/', description: '系统学习React' },
      { type: 'practice', title: 'React实战项目', url: 'https://github.com/typescript-cheatsheets/react', description: 'GitHub实战项目参考' },
    ],
  },
  'html-css': {
    skill: 'HTML/CSS',
    description: 'HTML是网页骨架，CSS是网页样式。这是前端开发基础，学会了就能做出漂亮的网页。',
    duration: '入门约1-2周，熟练需要2-3周大量练习',
    difficulty: '简单',
    resources: [
      { type: 'video', title: 'HTML+CSS基础入门', url: 'https://www.bilibili.com/video/BV1k7411W7pS', description: 'B站教程，从零开始' },
      { type: 'article', title: '菜鸟教程 HTML/CSS', url: 'https://www.runoob.com/html/html-tutorial.html', description: '快速入门教程' },
      { type: 'practice', title: 'CSS练习游戏', url: 'https://flexboxfroggy.com/', description: '趣味学习Flexbox布局' },
      { type: 'practice', title: '模仿网页练习', url: 'https://www.frontendpractice.com/', description: '模仿真实网站练习' },
    ],
  },
  'git': {
    skill: 'Git',
    description: 'Git是代码版本管理工具，团队开发必备。学会后可以追踪代码历史、多人协作开发。',
    duration: '入门约1周，熟练需要日常使用积累',
    difficulty: '简单',
    resources: [
      { type: 'video', title: 'Git入门教程', url: 'https://www.bilibili.com/video/BV1FE411P7Y3', description: '30分钟学会Git' },
      { type: 'article', title: 'Git官方教程', url: 'https://git-scm.com/book/zh/v2', description: 'Pro Git中文版' },
      { type: 'practice', title: 'Learn Git Branching', url: 'https://learngitbranching.js.org/', description: '可视化学习Git分支' },
    ],
  },
  'machine-learning': {
    skill: '机器学习',
    description: '机器学习让计算机从数据中学习规律，用于预测、分类等任务。是AI领域核心技术。',
    duration: '入门约1-2个月，需要数学基础；精通需要半年以上',
    difficulty: '较难',
    resources: [
      { type: 'video', title: '吴恩达机器学习', url: 'https://www.bilibili.com/video/BV164411b7Dp', description: '经典入门课程' },
      { type: 'book', title: '机器学习实战', url: 'https://book.douban.com/subject/24744788/', description: '实战导向书籍' },
      { type: 'article', title: '机器学习入门指南', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', description: 'Kaggle免费教程' },
      { type: 'practice', title: 'Kaggle竞赛', url: 'https://www.kaggle.com/competitions', description: '参加真实AI竞赛' },
    ],
  },
  'llm': {
    skill: '大语言模型',
    description: 'ChatGPT等大语言模型是当下最火的AI技术。学会后可以开发AI聊天机器人、智能助手等应用。',
    duration: '入门约2-4周，应用开发需要1-2个月',
    difficulty: '中等',
    resources: [
      { type: 'video', title: '大模型应用开发教程', url: 'https://www.bilibili.com/video/BV1wT411e7kC', description: '从零开发AI应用' },
      { type: 'article', title: 'LangChain中文文档', url: 'https://python.langchain.com/docs/', description: 'LLM应用开发框架' },
      { type: 'practice', title: 'OpenAI API文档', url: 'https://platform.openai.com/docs', description: '官方API使用指南' },
      { type: 'article', title: '提示工程指南', url: 'https://www.promptingguide.ai/zh', description: '高效使用AI的技巧' },
    ],
  },
  'vue': {
    skill: 'Vue',
    description: 'Vue是国内最流行的前端框架，学习曲线平缓，适合快速上手开发Web应用。',
    duration: '入门约2-3周，熟练需要1-2个月',
    difficulty: '简单',
    resources: [
      { type: 'article', title: 'Vue官方教程', url: 'https://cn.vuejs.org/guide/introduction.html', description: '官方中文教程，最权威' },
      { type: 'video', title: 'Vue3入门教程', url: 'https://www.bilibili.com/video/BV1QA4y1d7fx', description: 'B站热门Vue3教程' },
      { type: 'practice', title: 'Vue实战项目', url: 'https://github.com/vuejs/awesome-vue', description: 'Vue生态项目合集' },
    ],
  },
  'java': {
    skill: 'Java',
    description: 'Java是企业级开发首选语言，银行、电商等大公司都在用，就业面广、薪资稳定。',
    duration: '入门约1个月，熟练需要3-6个月项目实战',
    difficulty: '中等',
    resources: [
      { type: 'video', title: 'Java零基础入门', url: 'https://www.bilibili.com/video/BV1Cv411l7Gi', description: 'B站最火Java教程' },
      { type: 'book', title: 'Java核心技术', url: 'https://book.douban.com/subject/26880604/', description: '经典Java教材' },
      { type: 'practice', title: 'LeetCode Java刷题', url: 'https://leetcode.cn/problemset/all/', description: '面试必备刷题' },
    ],
  },
  'go': {
    skill: 'Go',
    description: 'Go是Google开发的高性能语言，特别适合做后端微服务和云原生开发，薪资高。',
    duration: '入门约2-3周（有编程基础），熟练需要2个月',
    difficulty: '中等',
    resources: [
      { type: 'article', title: 'Go官方教程', url: 'https://go.dev/tour/welcome/1', description: '官方互动教程' },
      { type: 'video', title: 'Go语言入门', url: 'https://www.bilibili.com/video/BV1gf4y1r79E', description: 'B站热门Go教程' },
      { type: 'book', title: 'Go程序设计语言', url: 'https://book.douban.com/subject/27044219/', description: 'Go语言经典书籍' },
    ],
  },
  'docker': {
    skill: 'Docker',
    description: 'Docker让应用打包成容器，在任何环境都能运行。是现代开发和运维的必备技能。',
    duration: '入门约1-2周，熟练需要1个月实践',
    difficulty: '简单',
    resources: [
      { type: 'video', title: 'Docker入门教程', url: 'https://www.bilibili.com/video/BV1og4y1q7M4', description: '通俗易懂的Docker教程' },
      { type: 'article', title: 'Docker从入门到实践', url: 'https://yeasy.gitbook.io/docker_practice/', description: '中文开源书籍' },
      { type: 'practice', title: 'Docker Playground', url: 'https://labs.play-with-docker.com/', description: '在线练习Docker' },
    ],
  },
  'linux': {
    skill: 'Linux',
    description: 'Linux是服务器操作系统标配，学会后能远程管理服务器、编写自动化脚本。',
    duration: '入门约2-3周，熟练需要长期使用',
    difficulty: '中等',
    resources: [
      { type: 'video', title: 'Linux入门教程', url: 'https://www.bilibili.com/video/BV1WY4y1H7d3', description: 'Linux基础命令教程' },
      { type: 'article', title: 'Linux命令大全', url: 'https://www.linuxcool.com/', description: '查询Linux命令用法' },
      { type: 'practice', title: 'Linux实验楼', url: 'https://www.lanqiao.cn/courses/1', description: '在线Linux练习' },
    ],
  },
  'typescript': {
    skill: 'TypeScript',
    description: 'TypeScript是JavaScript的升级版，加了类型检查，写大项目更安全。现在前端岗位基本都要求。',
    duration: '入门约1-2周（有JS基础），熟练需要1个月',
    difficulty: '中等',
    resources: [
      { type: 'article', title: 'TypeScript官方手册', url: 'https://www.typescriptlang.org/docs/handbook/', description: '官方文档' },
      { type: 'video', title: 'TypeScript入门教程', url: 'https://www.bilibili.com/video/BV1H44y1k7oE', description: 'B站热门TS教程' },
      { type: 'practice', title: 'TypeScript练习', url: 'https://www.typescriptlang.org/play', description: '在线练习' },
    ],
  },
  'nodejs': {
    skill: 'Node.js',
    description: 'Node.js让JavaScript也能写后端，学会后可以一个人做全栈开发，前后端通吃。',
    duration: '入门约2-3周（有JS基础），熟练需要2个月',
    difficulty: '中等',
    resources: [
      { type: 'article', title: 'Node.js官方文档', url: 'https://nodejs.org/zh-cn/docs', description: '官方中文文档' },
      { type: 'video', title: 'Node.js入门教程', url: 'https://www.bilibili.com/video/BV1a34y1B7tm', description: '从零学习Node.js' },
      { type: 'book', title: 'Node.js实战', url: 'https://book.douban.com/subject/25870705/', description: '实战项目学习' },
    ],
  },
  'rust': {
    skill: 'Rust',
    description: 'Rust是最受开发者喜爱的系统编程语言，性能媲美C++，但更安全。区块链和高性能服务常用。',
    duration: '入门约1-2个月，学习曲线较陡',
    difficulty: '较难',
    resources: [
      { type: 'article', title: 'Rust官方教程', url: 'https://kaisery.github.io/trpl-zh-cn/', description: 'Rust程序设计语言中文版' },
      { type: 'video', title: 'Rust入门教程', url: 'https://www.bilibili.com/video/BV1x3411s7S6', description: 'B站Rust教程' },
      { type: 'practice', title: 'Rust练习', url: 'https://github.com/rust-lang/rustlings', description: '官方练习项目' },
    ],
  },
  'algorithms': {
    skill: '算法与数据结构',
    description: '算法是编程的核心能力，面试必考。学好算法能写出更高效的代码，也是大厂面试的关键。',
    duration: '入门约1-2个月，持续提升需要长期刷题',
    difficulty: '较难',
    resources: [
      { type: 'video', title: '算法入门教程', url: 'https://www.bilibili.com/video/BV1gJ4117377', description: '数据结构与算法基础' },
      { type: 'book', title: '算法图解', url: 'https://book.douban.com/subject/26979890/', description: '通俗易懂的算法入门书' },
      { type: 'practice', title: 'LeetCode刷题', url: 'https://leetcode.cn/problemset/all/', description: '面试必备练习' },
      { type: 'book', title: '剑指Offer', url: 'https://book.douban.com/subject/27008702/', description: '面试算法经典' },
    ],
  },
  'mysql': {
    skill: 'MySQL',
    description: 'MySQL是最常用的数据库，几乎所有Web应用都需要存数据。学会后能设计和管理数据库。',
    duration: '入门约2周，熟练需要1-2个月',
    difficulty: '简单',
    resources: [
      { type: 'video', title: 'MySQL入门教程', url: 'https://www.bilibili.com/video/BV1iq4y1u7vj', description: '从零学习MySQL' },
      { type: 'article', title: 'MySQL教程', url: 'https://www.runoob.com/mysql/mysql-tutorial.html', description: '菜鸟教程MySQL' },
      { type: 'book', title: '高性能MySQL', url: 'https://book.douban.com/subject/23008813/', description: 'MySQL进阶经典' },
    ],
  },
  'flutter': {
    skill: 'Flutter',
    description: 'Flutter是Google的跨平台框架，一套代码同时开发iOS和Android应用，效率高。',
    duration: '入门约2-3周，熟练需要2个月',
    difficulty: '中等',
    resources: [
      { type: 'article', title: 'Flutter中文文档', url: 'https://flutter.cn/', description: '官方中文文档' },
      { type: 'video', title: 'Flutter入门教程', url: 'https://www.bilibili.com/video/BV1y44y1k7Y7', description: 'B站热门Flutter教程' },
      { type: 'practice', title: 'Flutter实战', url: 'https://book.flutterchina.club/', description: 'Flutter实战电子书' },
    ],
  },
  'unity': {
    skill: 'Unity',
    description: 'Unity是最流行的游戏引擎，可以用C#开发2D/3D游戏，支持多平台发布。',
    duration: '入门约1个月，做出完整游戏需要3个月以上',
    difficulty: '中等',
    resources: [
      { type: 'article', title: 'Unity官方教程', url: 'https://learn.unity.com/', description: '官方学习平台' },
      { type: 'video', title: 'Unity入门教程', url: 'https://www.bilibili.com/video/BV1GJ411u7iA', description: 'B站Unity教程' },
      { type: 'practice', title: 'Unity Asset Store', url: 'https://assetstore.unity.com/', description: '免费素材和插件' },
    ],
  },
  'blockchain': {
    skill: '区块链',
    description: '区块链是去中心化技术，Web3和加密货币的基础。学会后可以开发智能合约和DApp。',
    duration: '入门约1-2个月，需要先学编程基础',
    difficulty: '较难',
    resources: [
      { type: 'video', title: '区块链入门教程', url: 'https://www.bilibili.com/video/BV1V54y1e7r6', description: '理解区块链原理' },
      { type: 'article', title: 'Solidity官方文档', url: 'https://docs.soliditylang.org/zh/latest/', description: '智能合约开发语言' },
      { type: 'practice', title: 'CryptoZombies', url: 'https://cryptozombies.io/zh/', description: '趣味学习Solidity' },
    ],
  },
  'embedded': {
    skill: '嵌入式开发',
    description: '嵌入式开发是给硬件写程序，比如智能家居、汽车电子、工业控制等。',
    duration: '入门约1-2个月，需要C语言和电子基础',
    difficulty: '较难',
    resources: [
      { type: 'video', title: '嵌入式入门教程', url: 'https://www.bilibili.com/video/BV1WY4y1H7d3', description: '从零学嵌入式' },
      { type: 'practice', title: 'Arduino入门', url: 'https://www.arduino.cc/en/Tutorial/HomePage', description: '开源硬件学习' },
      { type: 'practice', title: '树莓派项目', url: 'https://projects.raspberrypi.org/zh-CN', description: '树莓派实战项目' },
    ],
  },
  'prompt-engineering': {
    skill: '提示工程',
    description: '提示工程是高效使用AI的技巧，学会后可以更好地利用ChatGPT等工具提升工作效率。',
    duration: '入门约1周，精通需要持续实践',
    difficulty: '简单',
    resources: [
      { type: 'article', title: '提示工程指南', url: 'https://www.promptingguide.ai/zh', description: '系统学习提示技巧' },
      { type: 'article', title: 'OpenAI提示最佳实践', url: 'https://platform.openai.com/docs/guides/prompt-engineering', description: '官方提示工程指南' },
      { type: 'practice', title: 'Learn Prompting', url: 'https://learnprompting.org/zh-Hans/', description: '免费提示工程课程' },
    ],
  },
};

const ALL_SKILLS = Object.keys(LEARNING_DATA);

export const AIRecommend: React.FC = () => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setSearching(true);
    
    // Simple matching logic
    setTimeout(() => {
      const matched = ALL_SKILLS.filter((skill) =>
        skill.toLowerCase().includes(query.toLowerCase()) ||
        LEARNING_DATA[skill].skill.toLowerCase().includes(query.toLowerCase())
      );
      
      const results = matched.map((key) => LEARNING_DATA[key]);
      
      // If no match, show some default recommendations
      if (results.length === 0) {
        results.push(LEARNING_DATA['python'], LEARNING_DATA['javascript']);
      }
      
      setRecommendations(results);
      setSearching(false);
    }, 500);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'article': return <FileText size={16} />;
      case 'book': return <BookOpen size={16} />;
      case 'practice': return <Link size={16} />;
      default: return <Link size={16} />;
    }
  };

  return (
    <div className="ai-recommend">
      <h2 className="page-title">
        <Sparkles size={24} />
        AI 学习推荐
      </h2>

      <p className="page-desc">输入你想学习的技术，AI会为你推荐学习路线和资源</p>

      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例如：Python、React、机器学习..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch} disabled={searching}>
          <Search size={20} />
          {searching ? '搜索中...' : '推荐'}
        </button>
      </div>

      <div className="hot-skills">
        <span className="hot-label">热门推荐：</span>
        {['Python', 'React', '机器学习', '大语言模型', 'Go', 'Rust'].map((skill) => (
          <button
            key={skill}
            className="hot-tag"
            onClick={() => {
              setQuery(skill);
              handleSearch();
            }}
          >
            {skill}
          </button>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations">
          {recommendations.map((rec) => (
            <div key={rec.skill} className="recommend-card">
              <div className="rec-header">
                <h3>{rec.skill}</h3>
                <span className="difficulty">{rec.difficulty}</span>
              </div>

              <p className="rec-description">{rec.description}</p>

              <div className="rec-meta">
                <span className="duration">预计学习时间：{rec.duration}</span>
              </div>

              <div className="rec-resources">
                <h4>学习资源推荐</h4>
                {rec.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-item"
                  >
                    <div className="resource-icon">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="resource-info">
                      <span className="resource-title">{resource.title}</span>
                      <span className="resource-desc">{resource.description}</span>
                    </div>
                    <span className="resource-type">
                      {resource.type === 'video' ? '视频' : resource.type === 'article' ? '文章' : resource.type === 'book' ? '书籍' : '练习'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {recommendations.length === 0 && !searching && (
        <div className="empty-state">
          <Sparkles size={48} />
          <p>输入你想学习的内容，获取个性化推荐</p>
        </div>
      )}
    </div>
  );
};