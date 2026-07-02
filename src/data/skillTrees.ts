export type SkillTreeNode = {
  id: string;
  name: string;
  description?: string;
  children?: SkillTreeNode[];
};

export type SkillTree = SkillTreeNode[];

export const SKILL_TREES: Record<string, SkillTree> = {
  // ============ Python ============
  'python': [
    {
      id: 'py-basic',
      name: '基础语法',
      children: [
        { id: 'py-basic-vars', name: '变量与数据类型' },
        { id: 'py-basic-strings', name: '字符串操作' },
        { id: 'py-basic-numbers', name: '数字运算' },
        { id: 'py-basic-comments', name: '注释与文档字符串' },
      ],
    },
    {
      id: 'py-control',
      name: '控制流',
      children: [
        { id: 'py-control-if', name: 'if/elif/else 条件判断' },
        { id: 'py-control-for', name: 'for 循环与 range' },
        { id: 'py-control-while', name: 'while 循环' },
        { id: 'py-control-break', name: 'break、continue、pass' },
        { id: 'py-control-match', name: 'match/case 模式匹配' },
      ],
    },
    {
      id: 'py-operators',
      name: '运算符',
      children: [
        { id: 'py-op-arithmetic', name: '算术运算符（+、-、*、/、//、%、**）' },
        { id: 'py-op-comparison', name: '比较运算符（==、!=、>、<、>=、<=）' },
        { id: 'py-op-logical', name: '逻辑运算符（and、or、not）' },
        { id: 'py-op-assignment', name: '赋值运算符（=、+=、-=、*= 等）' },
        { id: 'py-op-membership', name: '成员运算符（in、not in）' },
        { id: 'py-op-identity', name: '身份运算符（is、is not）' },
      ],
    },
    {
      id: 'py-datastruct',
      name: '数据结构',
      children: [
        { id: 'py-ds-list', name: '列表（List）及常用方法' },
        { id: 'py-ds-tuple', name: '元组（Tuple）' },
        { id: 'py-ds-dict', name: '字典（Dict）及常用方法' },
        { id: 'py-ds-set', name: '集合（Set）及集合运算' },
        { id: 'py-ds-comprehension', name: '列表推导式与字典推导式' },
      ],
    },
    {
      id: 'py-functions',
      name: '函数',
      children: [
        { id: 'py-func-def', name: '函数定义与调用' },
        { id: 'py-func-params', name: '参数（位置、默认、可变、关键字）' },
        { id: 'py-func-return', name: '返回值与多返回值' },
        { id: 'py-func-lambda', name: 'lambda 匿名函数' },
        { id: 'py-func-scope', name: '作用域与命名空间' },
        { id: 'py-func-decorator', name: '装饰器（Decorator）' },
        { id: 'py-func-generator', name: '生成器（Generator）' },
      ],
    },
    {
      id: 'py-oop',
      name: '面向对象编程',
      children: [
        { id: 'py-oop-class', name: '类与对象' },
        { id: 'py-oop-attr', name: '属性与方法' },
        { id: 'py-oop-init', name: '__init__ 构造方法' },
        { id: 'py-oop-inherit', name: '继承与多态' },
        { id: 'py-oop-encap', name: '封装与访问控制' },
        { id: 'py-oop-magic', name: '魔法方法（__str__、__len__ 等）' },
        { id: 'py-oop-classmethod', name: '类方法与静态方法' },
      ],
    },
    {
      id: 'py-modules',
      name: '模块与包',
      children: [
        { id: 'py-mod-import', name: 'import 与 from...import' },
        { id: 'py-mod-package', name: '包的组织与 __init__.py' },
        { id: 'py-mod-pip', name: 'pip 与虚拟环境' },
        { id: 'py-mod-stdlib', name: '常用标准库（os、sys、datetime 等）' },
      ],
    },
    {
      id: 'py-exception',
      name: '异常处理',
      children: [
        { id: 'py-exc-try', name: 'try/except/finally' },
        { id: 'py-exc-raise', name: 'raise 抛出异常' },
        { id: 'py-exc-custom', name: '自定义异常' },
      ],
    },
    {
      id: 'py-file',
      name: '文件操作',
      children: [
        { id: 'py-file-read', name: '文件读取' },
        { id: 'py-file-write', name: '文件写入' },
        { id: 'py-file-context', name: 'with 上下文管理器' },
        { id: 'py-file-json', name: 'JSON 数据处理' },
      ],
    },
  ],

  // ============ JavaScript ============
  'javascript': [
    {
      id: 'js-basic',
      name: '基础语法',
      children: [
        { id: 'js-basic-vars', name: 'var、let、const 变量声明' },
        { id: 'js-basic-datatypes', name: '数据类型（Number、String、Boolean、Null、Undefined、Symbol、BigInt）' },
        { id: 'js-basic-operators', name: '运算符' },
        { id: 'js-basic-template', name: '模板字符串' },
      ],
    },
    {
      id: 'js-control',
      name: '控制流',
      children: [
        { id: 'js-control-if', name: 'if/else if/else' },
        { id: 'js-control-switch', name: 'switch 语句' },
        { id: 'js-control-for', name: 'for 循环（for、for...in、for...of）' },
        { id: 'js-control-while', name: 'while 与 do...while' },
        { id: 'js-control-break', name: 'break 与 continue' },
      ],
    },
    {
      id: 'js-operators',
      name: '运算符',
      children: [
        { id: 'js-op-arithmetic', name: '算术运算符（+、-、*、/、%、**、++、--）' },
        { id: 'js-op-comparison', name: '比较运算符（==、===、!=、!==、>、<）' },
        { id: 'js-op-logical', name: '逻辑运算符（&&、||、!）' },
        { id: 'js-op-assignment', name: '赋值运算符' },
        { id: 'js-op-ternary', name: '三元运算符（? :）' },
        { id: 'js-op-spread', name: '展开运算符（...）' },
        { id: 'js-op-optional', name: '可选链（?.）与空值合并（??）' },
      ],
    },
    {
      id: 'js-functions',
      name: '函数',
      children: [
        { id: 'js-func-declaration', name: '函数声明与函数表达式' },
        { id: 'js-func-arrow', name: '箭头函数（Arrow Function）' },
        { id: 'js-func-params', name: '参数（默认值、剩余参数）' },
        { id: 'js-func-return', name: '返回值' },
        { id: 'js-func-this', name: 'this 指向' },
        { id: 'js-func-closure', name: '闭包（Closure）' },
        { id: 'js-func-hoisting', name: '变量提升与函数提升' },
      ],
    },
    {
      id: 'js-objects',
      name: '对象与数组',
      children: [
        { id: 'js-obj-literal', name: '对象字面量与属性访问' },
        { id: 'js-obj-destruct', name: '解构赋值' },
        { id: 'js-obj-methods', name: '对象方法（Object.keys/values/entries 等）' },
        { id: 'js-arr-methods', name: '数组方法（map、filter、reduce、forEach 等）' },
        { id: 'js-arr-spread', name: '数组展开与合并' },
      ],
    },
    {
      id: 'js-async',
      name: '异步编程',
      children: [
        { id: 'js-async-callback', name: '回调函数' },
        { id: 'js-async-promise', name: 'Promise' },
        { id: 'js-async-await', name: 'async/await' },
        { id: 'js-async-fetch', name: 'fetch API 与 AJAX' },
        { id: 'js-async-eventloop', name: '事件循环与宏任务微任务' },
      ],
    },
    {
      id: 'js-es6',
      name: 'ES6+ 特性',
      children: [
        { id: 'js-es6-class', name: 'class 类与继承' },
        { id: 'js-es6-module', name: '模块化（import/export）' },
        { id: 'js-es6-symbol', name: 'Symbol' },
        { id: 'js-es6-set', name: 'Set 与 Map' },
        { id: 'js-es6-proxy', name: 'Proxy 与 Reflect' },
        { id: 'js-es6-iterator', name: '迭代器与生成器' },
      ],
    },
  ],

  // ============ TypeScript ============
  'typescript': [
    {
      id: 'ts-basic',
      name: '基础类型',
      children: [
        { id: 'ts-basic-primitives', name: '原始类型（string、number、boolean）' },
        { id: 'ts-basic-array', name: '数组类型' },
        { id: 'ts-basic-tuple', name: '元组（Tuple）' },
        { id: 'ts-basic-enum', name: '枚举（Enum）' },
        { id: 'ts-basic-any', name: 'any、unknown、never、void' },
        { id: 'ts-basic-null', name: 'null 与 undefined' },
      ],
    },
    {
      id: 'ts-interface',
      name: '接口与类型别名',
      children: [
        { id: 'ts-itf-basic', name: 'interface 基本用法' },
        { id: 'ts-itf-optional', name: '可选属性与只读属性' },
        { id: 'ts-itf-index', name: '索引签名' },
        { id: 'ts-itf-extends', name: '接口继承' },
        { id: 'ts-type-alias', name: 'type 类型别名' },
        { id: 'ts-type-union', name: '联合类型（|）与交叉类型（&）' },
      ],
    },
    {
      id: 'ts-function',
      name: '函数类型',
      children: [
        { id: 'ts-func-params', name: '参数类型与返回值类型' },
        { id: 'ts-func-optional', name: '可选参数与默认参数' },
        { id: 'ts-func-rest', name: '剩余参数' },
        { id: 'ts-func-overload', name: '函数重载' },
      ],
    },
    {
      id: 'ts-generics',
      name: '泛型',
      children: [
        { id: 'ts-gen-basic', name: '泛型函数' },
        { id: 'ts-gen-interface', name: '泛型接口' },
        { id: 'ts-gen-class', name: '泛型类' },
        { id: 'ts-gen-constraint', name: '泛型约束（extends）' },
        { id: 'ts-gen-utility', name: '工具类型（Partial、Required、Pick、Omit 等）' },
      ],
    },
    {
      id: 'ts-class',
      name: '类与面向对象',
      children: [
        { id: 'ts-class-basic', name: '类的定义与成员类型' },
        { id: 'ts-class-modifier', name: '访问修饰符（public、private、protected）' },
        { id: 'ts-class-readonly', name: 'readonly 修饰符' },
        { id: 'ts-class-abstract', name: '抽象类与抽象方法' },
        { id: 'ts-class-implements', name: '类实现接口' },
      ],
    },
  ],

  // ============ Java ============
  'java': [
    {
      id: 'java-basic',
      name: '基础语法',
      children: [
        { id: 'java-basic-vars', name: '变量与数据类型' },
        { id: 'java-basic-operators', name: '运算符' },
        { id: 'java-basic-control', name: '控制流（if、switch、for、while）' },
        { id: 'java-basic-array', name: '数组' },
      ],
    },
    {
      id: 'java-oop',
      name: '面向对象',
      children: [
        { id: 'java-oop-class', name: '类与对象' },
        { id: 'java-oop-encap', name: '封装与访问修饰符' },
        { id: 'java-oop-inherit', name: '继承（extends）' },
        { id: 'java-oop-polymorphism', name: '多态（方法重载与重写）' },
        { id: 'java-oop-abstract', name: '抽象类与接口' },
        { id: 'java-oop-object', name: 'Object 类与常用方法' },
      ],
    },
    {
      id: 'java-exception',
      name: '异常处理',
      children: [
        { id: 'java-exc-try', name: 'try-catch-finally' },
        { id: 'java-exc-throw', name: 'throw 与 throws' },
        { id: 'java-exc-custom', name: '自定义异常' },
        { id: 'java-exc-hierarchy', name: '异常体系结构' },
      ],
    },
    {
      id: 'java-collections',
      name: '集合框架',
      children: [
        { id: 'java-coll-list', name: 'List（ArrayList、LinkedList）' },
        { id: 'java-coll-set', name: 'Set（HashSet、TreeSet）' },
        { id: 'java-coll-map', name: 'Map（HashMap、TreeMap、LinkedHashMap）' },
        { id: 'java-coll-iterator', name: 'Iterator 迭代器' },
        { id: 'java-coll-stream', name: 'Stream API' },
      ],
    },
    {
      id: 'java-concurrent',
      name: '多线程与并发',
      children: [
        { id: 'java-thread-basic', name: '线程创建（Thread、Runnable、Callable）' },
        { id: 'java-thread-lifecycle', name: '线程生命周期' },
        { id: 'java-thread-sync', name: 'synchronized 同步' },
        { id: 'java-thread-lock', name: 'Lock 与 ReentrantLock' },
        { id: 'java-thread-pool', name: '线程池' },
        { id: 'java-thread-atomic', name: '原子类与并发包' },
      ],
    },
    {
      id: 'java-io',
      name: 'IO 与 NIO',
      children: [
        { id: 'java-io-bio', name: '字节流与字符流' },
        { id: 'java-io-file', name: 'File 类' },
        { id: 'java-io-serial', name: '序列化与反序列化' },
        { id: 'java-nio', name: 'NIO（Channel、Buffer、Selector）' },
      ],
    },
  ],

  // ============ Go ============
  'go': [
    {
      id: 'go-basic',
      name: '基础语法',
      children: [
        { id: 'go-basic-vars', name: '变量与常量（var、const、:=）' },
        { id: 'go-basic-types', name: '基本数据类型' },
        { id: 'go-basic-operators', name: '运算符' },
        { id: 'go-basic-control', name: 'if、for、switch 控制流' },
      ],
    },
    {
      id: 'go-datatype',
      name: '复合数据类型',
      children: [
        { id: 'go-dt-array', name: '数组（Array）' },
        { id: 'go-dt-slice', name: '切片（Slice）' },
        { id: 'go-dt-map', name: '映射（Map）' },
        { id: 'go-dt-struct', name: '结构体（Struct）' },
        { id: 'go-dt-pointer', name: '指针（Pointer）' },
      ],
    },
    {
      id: 'go-functions',
      name: '函数',
      children: [
        { id: 'go-func-basic', name: '函数定义与多返回值' },
        { id: 'go-func-params', name: '可变参数' },
        { id: 'go-func-defer', name: 'defer 延迟调用' },
        { id: 'go-func-closure', name: '闭包' },
        { id: 'go-func-method', name: '方法（Method）与接收者' },
      ],
    },
    {
      id: 'go-interface',
      name: '接口',
      children: [
        { id: 'go-itf-basic', name: '接口定义与实现' },
        { id: 'go-itf-empty', name: '空接口（interface{}）' },
        { id: 'go-itf-assert', name: '类型断言与类型选择' },
      ],
    },
    {
      id: 'go-concurrent',
      name: '并发编程',
      children: [
        { id: 'go-goroutine', name: 'goroutine 协程' },
        { id: 'go-channel', name: 'channel 通道' },
        { id: 'go-select', name: 'select 多路复用' },
        { id: 'go-sync', name: 'sync 包（WaitGroup、Mutex、RWMutex、Once）' },
        { id: 'go-context', name: 'context 上下文' },
      ],
    },
  ],

  // ============ HTML/CSS ============
  'html-css': [
    {
      id: 'html-basic',
      name: 'HTML 基础',
      children: [
        { id: 'html-structure', name: 'HTML 文档结构' },
        { id: 'html-tags', name: '常用标签（div、p、a、img、ul、ol 等）' },
        { id: 'html-form', name: '表单与表单元素' },
        { id: 'html-semantic', name: '语义化标签（header、nav、main、article、footer）' },
        { id: 'html-attr', name: '常用属性（class、id、style、data-* 等）' },
      ],
    },
    {
      id: 'css-basic',
      name: 'CSS 基础',
      children: [
        { id: 'css-selector', name: '选择器（类、ID、属性、伪类、伪元素）' },
        { id: 'css-box', name: '盒模型（Box Model）' },
        { id: 'css-text', name: '文本与字体样式' },
        { id: 'css-color', name: '颜色与背景' },
        { id: 'css-units', name: '单位（px、em、rem、%、vh、vw）' },
      ],
    },
    {
      id: 'css-layout',
      name: '布局',
      children: [
        { id: 'css-layout-display', name: 'display（block、inline、inline-block、none）' },
        { id: 'css-layout-float', name: 'float 浮动与清除' },
        { id: 'css-layout-position', name: 'position（static、relative、absolute、fixed、sticky）' },
        { id: 'css-layout-flex', name: 'Flexbox 弹性布局' },
        { id: 'css-layout-grid', name: 'Grid 网格布局' },
      ],
    },
    {
      id: 'css-advanced',
      name: 'CSS 进阶',
      children: [
        { id: 'css-adv-transform', name: 'transform 变换' },
        { id: 'css-adv-transition', name: 'transition 过渡' },
        { id: 'css-adv-animation', name: 'animation 动画与 @keyframes' },
        { id: 'css-adv-responsive', name: '响应式设计与媒体查询' },
        { id: 'css-adv-variable', name: 'CSS 变量（自定义属性）' },
        { id: 'css-adv-pseudo', name: '伪类与伪元素深入' },
      ],
    },
  ],

  // ============ React ============
  'react': [
    {
      id: 'react-basic',
      name: '基础概念',
      children: [
        { id: 'react-component', name: '组件（函数组件与类组件）' },
        { id: 'react-jsx', name: 'JSX 语法' },
        { id: 'react-props', name: 'Props 传递与只读' },
        { id: 'react-state', name: 'State 状态管理' },
        { id: 'react-conditional', name: '条件渲染' },
        { id: 'react-list', name: '列表渲染与 key' },
      ],
    },
    {
      id: 'react-hooks',
      name: 'Hooks',
      children: [
        { id: 'react-hook-usestate', name: 'useState' },
        { id: 'react-hook-useeffect', name: 'useEffect' },
        { id: 'react-hook-usecontext', name: 'useContext' },
        { id: 'react-hook-usereducer', name: 'useReducer' },
        { id: 'react-hook-usecallback', name: 'useCallback 与 useMemo' },
        { id: 'react-hook-useref', name: 'useRef' },
        { id: 'react-hook-custom', name: '自定义 Hook' },
      ],
    },
    {
      id: 'react-advanced',
      name: '进阶概念',
      children: [
        { id: 'react-adv-context', name: 'Context API' },
        { id: 'react-adv-ref', name: 'Ref 与 DOM 操作' },
        { id: 'react-adv-lifecycle', name: '生命周期（类组件与 Hooks 等价）' },
        { id: 'react-adv-error', name: '错误边界（Error Boundary）' },
        { id: 'react-adv-code', name: '代码分割与 React.lazy' },
        { id: 'react-adv-memo', name: 'React.memo 与性能优化' },
      ],
    },
    {
      id: 'react-ecosystem',
      name: '生态系统',
      children: [
        { id: 'react-eco-router', name: 'React Router' },
        { id: 'react-eco-redux', name: 'Redux / Zustand 状态管理' },
        { id: 'react-eco-query', name: 'React Query / SWR' },
        { id: 'react-eco-form', name: '表单处理（Formik、React Hook Form）' },
      ],
    },
  ],

  // ============ MySQL ============
  'mysql': [
    {
      id: 'mysql-basic',
      name: '基础操作',
      children: [
        { id: 'mysql-ddl', name: 'DDL（CREATE、ALTER、DROP）' },
        { id: 'mysql-dml', name: 'DML（INSERT、UPDATE、DELETE）' },
        { id: 'mysql-dql', name: 'DQL（SELECT 查询）' },
        { id: 'mysql-dcl', name: 'DCL（GRANT、REVOKE）' },
      ],
    },
    {
      id: 'mysql-query',
      name: '查询进阶',
      children: [
        { id: 'mysql-where', name: 'WHERE 条件（=、>、<、LIKE、IN、BETWEEN）' },
        { id: 'mysql-order', name: 'ORDER BY 排序' },
        { id: 'mysql-group', name: 'GROUP BY 分组与 HAVING' },
        { id: 'mysql-join', name: 'JOIN 连接（INNER、LEFT、RIGHT、FULL）' },
        { id: 'mysql-subquery', name: '子查询' },
        { id: 'mysql-union', name: 'UNION 与 UNION ALL' },
        { id: 'mysql-limit', name: 'LIMIT 分页' },
      ],
    },
    {
      id: 'mysql-functions',
      name: '常用函数',
      children: [
        { id: 'mysql-func-string', name: '字符串函数（CONCAT、SUBSTRING、REPLACE 等）' },
        { id: 'mysql-func-num', name: '数值函数（ROUND、ABS、SUM、AVG、COUNT、MAX、MIN）' },
        { id: 'mysql-func-date', name: '日期函数（NOW、DATE_FORMAT、DATEDIFF 等）' },
        { id: 'mysql-func-flow', name: '流程控制（IF、CASE WHEN）' },
      ],
    },
    {
      id: 'mysql-advanced',
      name: '进阶',
      children: [
        { id: 'mysql-adv-index', name: '索引（主键、唯一、普通、联合索引）' },
        { id: 'mysql-adv-transaction', name: '事务与 ACID' },
        { id: 'mysql-adv-view', name: '视图（View）' },
        { id: 'mysql-adv-procedure', name: '存储过程与函数' },
        { id: 'mysql-adv-trigger', name: '触发器' },
        { id: 'mysql-adv-optimize', name: 'SQL 优化与执行计划' },
      ],
    },
  ],

  // ============ 算法与数据结构 ============
  'algorithms': [
    {
      id: 'algo-ds-basic',
      name: '基础数据结构',
      children: [
        { id: 'algo-ds-array', name: '数组与链表' },
        { id: 'algo-ds-stack', name: '栈（Stack）' },
        { id: 'algo-ds-queue', name: '队列（Queue）与双端队列' },
        { id: 'algo-ds-hash', name: '哈希表（Hash Table）' },
        { id: 'algo-ds-string', name: '字符串操作' },
      ],
    },
    {
      id: 'algo-ds-tree',
      name: '树与图',
      children: [
        { id: 'algo-tree-binary', name: '二叉树与遍历（前/中/后/层序）' },
        { id: 'algo-tree-bst', name: '二叉搜索树（BST）' },
        { id: 'algo-tree-heap', name: '堆（Heap）与优先队列' },
        { id: 'algo-tree-trie', name: '字典树（Trie）' },
        { id: 'algo-graph', name: '图的表示与遍历（BFS、DFS）' },
        { id: 'algo-graph-shortest', name: '最短路径（Dijkstra、Floyd）' },
      ],
    },
    {
      id: 'algo-sort',
      name: '排序算法',
      children: [
        { id: 'algo-sort-bubble', name: '冒泡排序' },
        { id: 'algo-sort-select', name: '选择排序' },
        { id: 'algo-sort-insert', name: '插入排序' },
        { id: 'algo-sort-quick', name: '快速排序' },
        { id: 'algo-sort-merge', name: '归并排序' },
        { id: 'algo-sort-heap', name: '堆排序' },
        { id: 'algo-sort-bucket', name: '桶排序与计数排序' },
      ],
    },
    {
      id: 'algo-advanced',
      name: '算法思想',
      children: [
        { id: 'algo-thought-dp', name: '动态规划（DP）' },
        { id: 'algo-thought-greedy', name: '贪心算法' },
        { id: 'algo-thought-backtrack', name: '回溯算法' },
        { id: 'algo-thought-divide', name: '分治算法' },
        { id: 'algo-thought-binary', name: '二分查找' },
        { id: 'algo-thought-sliding', name: '滑动窗口' },
        { id: 'algo-thought-twopoints', name: '双指针技巧' },
      ],
    },
  ],

  // ============ Git ============
  'git': [
    {
      id: 'git-basic',
      name: '基础操作',
      children: [
        { id: 'git-init-clone', name: 'git init 与 git clone' },
        { id: 'git-add-commit', name: 'git add 与 git commit' },
        { id: 'git-status-log', name: 'git status 与 git log' },
        { id: 'git-diff', name: 'git diff 比较差异' },
        { id: 'git-reset', name: 'git reset 与 git revert' },
      ],
    },
    {
      id: 'git-branch',
      name: '分支管理',
      children: [
        { id: 'git-branch-basic', name: 'git branch 分支创建与删除' },
        { id: 'git-checkout', name: 'git checkout 与 git switch' },
        { id: 'git-merge', name: 'git merge 合并' },
        { id: 'git-rebase', name: 'git rebase 变基' },
        { id: 'git-stash', name: 'git stash 暂存' },
        { id: 'git-cherry-pick', name: 'git cherry-pick' },
      ],
    },
    {
      id: 'git-remote',
      name: '远程仓库',
      children: [
        { id: 'git-remote-basic', name: 'git remote 管理远程仓库' },
        { id: 'git-push', name: 'git push 推送' },
        { id: 'git-pull', name: 'git pull 与 git fetch' },
        { id: 'git-pr', name: 'Pull Request / Merge Request' },
        { id: 'git-conflict', name: '冲突解决' },
      ],
    },
    {
      id: 'git-workflow',
      name: '工作流',
      children: [
        { id: 'git-flow-gitflow', name: 'Git Flow' },
        { id: 'git-flow-github', name: 'GitHub Flow' },
        { id: 'git-flow-trunk', name: 'Trunk-Based Development' },
        { id: 'git-tag', name: 'git tag 版本标签' },
      ],
    },
  ],

  // ============ Docker ============
  'docker': [
    {
      id: 'docker-basic',
      name: '基础概念',
      children: [
        { id: 'docker-image', name: '镜像（Image）与容器（Container）' },
        { id: 'docker-registry', name: '仓库（Registry）与 Docker Hub' },
        { id: 'docker-vs-vm', name: '容器 vs 虚拟机' },
      ],
    },
    {
      id: 'docker-container',
      name: '容器操作',
      children: [
        { id: 'docker-run', name: 'docker run 运行容器' },
        { id: 'docker-ps', name: 'docker ps 查看容器' },
        { id: 'docker-exec', name: 'docker exec 进入容器' },
        { id: 'docker-logs', name: 'docker logs 查看日志' },
        { id: 'docker-stop', name: 'start/stop/restart/rm 容器管理' },
      ],
    },
    {
      id: 'docker-image',
      name: '镜像管理',
      children: [
        { id: 'docker-images', name: 'docker images 查看镜像' },
        { id: 'docker-pull', name: 'docker pull 拉取镜像' },
        { id: 'docker-build', name: 'Dockerfile 与 docker build' },
        { id: 'docker-push', name: 'docker push 推送镜像' },
        { id: 'docker-rmi', name: 'docker rmi 删除镜像' },
      ],
    },
    {
      id: 'docker-dockerfile',
      name: 'Dockerfile',
      children: [
        { id: 'dockerfile-from', name: 'FROM 基础镜像' },
        { id: 'dockerfile-run', name: 'RUN 执行命令' },
        { id: 'dockerfile-copy', name: 'COPY 与 ADD 复制文件' },
        { id: 'dockerfile-workdir', name: 'WORKDIR 工作目录' },
        { id: 'dockerfile-env', name: 'ENV 环境变量' },
        { id: 'dockerfile-expose', name: 'EXPOSE 暴露端口' },
        { id: 'dockerfile-cmd', name: 'CMD 与 ENTRYPOINT' },
        { id: 'dockerfile-opt', name: '多阶段构建与优化' },
      ],
    },
    {
      id: 'docker-compose',
      name: 'Docker Compose',
      children: [
        { id: 'compose-yml', name: 'docker-compose.yml 配置' },
        { id: 'compose-up', name: 'docker-compose up/down' },
        { id: 'compose-service', name: '服务定义与依赖' },
        { id: 'compose-network', name: '网络与数据卷配置' },
      ],
    },
  ],

  // ============ Linux ============
  'linux': [
    {
      id: 'linux-basic',
      name: '基础命令',
      children: [
        { id: 'linux-file-nav', name: '文件导航（ls、cd、pwd）' },
        { id: 'linux-file-op', name: '文件操作（cp、mv、rm、mkdir、touch）' },
        { id: 'linux-file-view', name: '文件查看（cat、more、less、head、tail）' },
        { id: 'linux-find', name: 'find 与 locate 查找' },
        { id: 'linux-grep', name: 'grep 文本搜索' },
      ],
    },
    {
      id: 'linux-file',
      name: '文件与权限',
      children: [
        { id: 'linux-permission', name: 'chmod 权限设置' },
        { id: 'linux-chown', name: 'chown 与 chgrp' },
        { id: 'linux-link', name: '软链接与硬链接' },
        { id: 'linux-tar', name: 'tar 打包压缩' },
        { id: 'linux-unzip', name: 'zip/unzip、gzip' },
      ],
    },
    {
      id: 'linux-process',
      name: '进程与系统',
      children: [
        { id: 'linux-ps', name: 'ps 与 top/htop 进程查看' },
        { id: 'linux-kill', name: 'kill 终止进程' },
        { id: 'linux-jobs', name: '前台/后台进程与 jobs' },
        { id: 'linux-cron', name: 'crontab 定时任务' },
        { id: 'linux-service', name: 'systemctl 服务管理' },
        { id: 'linux-env', name: '环境变量与 .bashrc' },
      ],
    },
    {
      id: 'linux-network',
      name: '网络相关',
      children: [
        { id: 'linux-ifconfig', name: 'ifconfig/ip addr 网络接口' },
        { id: 'linux-ping', name: 'ping 与 traceroute' },
        { id: 'linux-netstat', name: 'netstat/ss 端口查看' },
        { id: 'linux-curl', name: 'curl 与 wget' },
        { id: 'linux-ssh', name: 'SSH 远程登录' },
        { id: 'linux-firewall', name: 'iptables/firewalld 防火墙' },
      ],
    },
    {
      id: 'linux-shell',
      name: 'Shell 脚本',
      children: [
        { id: 'shell-basic', name: '脚本基础（变量、注释、执行）' },
        { id: 'shell-control', name: 'if/else、for、while 控制流' },
        { id: 'shell-function', name: '函数定义与调用' },
        { id: 'shell-params', name: '命令行参数' },
        { id: 'shell-pipe', name: '管道与重定向' },
      ],
    },
  ],

  // ============ SQL ============
  'sql': [
    {
      id: 'sql-basic',
      name: '基础查询',
      children: [
        { id: 'sql-select', name: 'SELECT 基础查询' },
        { id: 'sql-where', name: 'WHERE 条件过滤' },
        { id: 'sql-order', name: 'ORDER BY 排序' },
        { id: 'sql-limit', name: 'LIMIT 限制结果' },
      ],
    },
    {
      id: 'sql-conditions',
      name: '条件运算符',
      children: [
        { id: 'sql-op-compare', name: '比较运算符（=、!=、>、<、>=、<=）' },
        { id: 'sql-op-logical', name: '逻辑运算符（AND、OR、NOT）' },
        { id: 'sql-op-like', name: 'LIKE 模糊查询' },
        { id: 'sql-op-in', name: 'IN 与 NOT IN' },
        { id: 'sql-op-between', name: 'BETWEEN 范围查询' },
        { id: 'sql-op-null', name: 'IS NULL 与 IS NOT NULL' },
      ],
    },
    {
      id: 'sql-aggregate',
      name: '聚合与分组',
      children: [
        { id: 'sql-func-count', name: 'COUNT 计数' },
        { id: 'sql-func-sum', name: 'SUM 求和' },
        { id: 'sql-func-avg', name: 'AVG 平均值' },
        { id: 'sql-func-max', name: 'MAX 与 MIN' },
        { id: 'sql-group-by', name: 'GROUP BY 分组' },
        { id: 'sql-having', name: 'HAVING 分组过滤' },
      ],
    },
    {
      id: 'sql-join',
      name: '多表连接',
      children: [
        { id: 'sql-join-inner', name: 'INNER JOIN 内连接' },
        { id: 'sql-join-left', name: 'LEFT JOIN 左连接' },
        { id: 'sql-join-right', name: 'RIGHT JOIN 右连接' },
        { id: 'sql-join-full', name: 'FULL JOIN 全连接' },
        { id: 'sql-join-self', name: '自连接' },
      ],
    },
    {
      id: 'sql-advanced',
      name: '进阶内容',
      children: [
        { id: 'sql-subquery', name: '子查询' },
        { id: 'sql-union', name: 'UNION 与 UNION ALL' },
        { id: 'sql-case', name: 'CASE WHEN 条件表达式' },
        { id: 'sql-window', name: '窗口函数（ROW_NUMBER、RANK、OVER）' },
        { id: 'sql-cte', name: 'CTE 公用表表达式（WITH）' },
      ],
    },
  ],

  // ============ Redis ============
  'redis': [
    {
      id: 'redis-basic',
      name: '基础数据类型',
      children: [
        { id: 'redis-string', name: 'String（字符串）' },
        { id: 'redis-hash', name: 'Hash（哈希）' },
        { id: 'redis-list', name: 'List（列表）' },
        { id: 'redis-set', name: 'Set（集合）' },
        { id: 'redis-zset', name: 'ZSet（有序集合）' },
      ],
    },
    {
      id: 'redis-commands',
      name: '常用命令',
      children: [
        { id: 'redis-key', name: 'KEYS、EXISTS、DEL、EXPIRE、TTL' },
        { id: 'redis-string-cmd', name: 'SET、GET、INCR、DECR、MSET、MGET' },
        { id: 'redis-hash-cmd', name: 'HSET、HGET、HDEL、HGETALL、HINCRBY' },
        { id: 'redis-list-cmd', name: 'LPUSH、RPUSH、LPOP、RPOP、LRANGE' },
        { id: 'redis-set-cmd', name: 'SADD、SREM、SMEMBERS、SISMEMBER、SINTER' },
        { id: 'redis-zset-cmd', name: 'ZADD、ZRANGE、ZRANK、ZREM、ZSCORE' },
      ],
    },
    {
      id: 'redis-advanced',
      name: '进阶功能',
      children: [
        { id: 'redis-pubsub', name: 'Pub/Sub 发布订阅' },
        { id: 'redis-transaction', name: '事务（MULTI、EXEC、WATCH）' },
        { id: 'redis-lua', name: 'Lua 脚本' },
        { id: 'redis-pipeline', name: 'Pipeline 管道' },
        { id: 'redis-stream', name: 'Stream 数据流' },
      ],
    },
    {
      id: 'redis-persistence',
      name: '持久化与高可用',
      children: [
        { id: 'redis-rdb', name: 'RDB 持久化' },
        { id: 'redis-aof', name: 'AOF 持久化' },
        { id: 'redis-replication', name: '主从复制' },
        { id: 'redis-sentinel', name: 'Sentinel 哨兵' },
        { id: 'redis-cluster', name: 'Cluster 集群' },
      ],
    },
  ],

  // ============ 机器学习 ============
  'machine-learning': [
    {
      id: 'ml-basic',
      name: '基础概念',
      children: [
        { id: 'ml-intro', name: '机器学习定义与分类' },
        { id: 'ml-supervised', name: '监督学习、无监督学习、强化学习' },
        { id: 'ml-data', name: '训练集、验证集、测试集' },
        { id: 'ml-overfit', name: '过拟合与欠拟合' },
        { id: 'ml-eval', name: '评估指标（准确率、精确率、召回率、F1）' },
      ],
    },
    {
      id: 'ml-preprocess',
      name: '数据预处理',
      children: [
        { id: 'ml-missing', name: '缺失值处理' },
        { id: 'ml-encode', name: '特征编码（独热编码、标签编码）' },
        { id: 'ml-scale', name: '特征缩放（归一化、标准化）' },
        { id: 'ml-split', name: '数据集划分' },
        { id: 'ml-feature', name: '特征工程与特征选择' },
      ],
    },
    {
      id: 'ml-supervised',
      name: '监督学习算法',
      children: [
        { id: 'ml-linear-reg', name: '线性回归' },
        { id: 'ml-logistic-reg', name: '逻辑回归' },
        { id: 'ml-knn', name: 'K近邻（KNN）' },
        { id: 'ml-decision-tree', name: '决策树' },
        { id: 'ml-random-forest', name: '随机森林' },
        { id: 'ml-svm', name: '支持向量机（SVM）' },
        { id: 'ml-naive-bayes', name: '朴素贝叶斯' },
        { id: 'ml-xgboost', name: 'XGBoost/LightGBM 集成学习' },
      ],
    },
    {
      id: 'ml-unsupervised',
      name: '无监督学习',
      children: [
        { id: 'ml-kmeans', name: 'K-Means 聚类' },
        { id: 'ml-hierarchical', name: '层次聚类' },
        { id: 'ml-dbscan', name: 'DBSCAN 密度聚类' },
        { id: 'ml-pca', name: 'PCA 主成分分析' },
        { id: 'ml-cluster-eval', name: '聚类评估指标' },
      ],
    },
  ],
};

// 根据技能类型生成默认技能树（用于没有明确技能树的技能）
export function generateDefaultTree(skillId: string, skillName: string, skillType?: string): SkillTree {
  const prefix = skillId.substring(0, 8);

  if (skillType === 'coding') {
    return [
      {
        id: `${prefix}-basic`,
        name: '基础入门',
        children: [
          { id: `${prefix}-env`, name: '环境搭建与配置' },
          { id: `${prefix}-syntax`, name: '基础语法' },
          { id: `${prefix}-datatype`, name: '数据类型与变量' },
          { id: `${prefix}-control`, name: '控制流（条件、循环）' },
        ],
      },
      {
        id: `${prefix}-core`,
        name: '核心概念',
        children: [
          { id: `${prefix}-func`, name: '函数与方法' },
          { id: `${prefix}-datastruct`, name: '数据结构使用' },
          { id: `${prefix}-error`, name: '错误与异常处理' },
          { id: `${prefix}-mod`, name: '模块与包管理' },
        ],
      },
      {
        id: `${prefix}-advanced`,
        name: '进阶提升',
        children: [
          { id: `${prefix}-oop`, name: '面向对象编程' },
          { id: `${prefix}-async`, name: '异步与并发编程' },
          { id: `${prefix}-io`, name: '文件与网络 I/O' },
          { id: `${prefix}-test`, name: '测试与调试' },
        ],
      },
      {
        id: `${prefix}-practice`,
        name: '实战应用',
        children: [
          { id: `${prefix}-project`, name: '完成实战项目' },
          { id: `${prefix}-optimize`, name: '性能优化' },
          { id: `${prefix}-deploy`, name: '部署与运维' },
        ],
      },
    ];
  }

  if (skillType === 'theory') {
    return [
      {
        id: `${prefix}-intro`,
        name: '基础理论',
        children: [
          { id: `${prefix}-concept`, name: '基本概念与术语' },
          { id: `${prefix}-history`, name: '发展历史与背景' },
          { id: `${prefix}-principle`, name: '核心原理' },
        ],
      },
      {
        id: `${prefix}-deep`,
        name: '深入理解',
        children: [
          { id: `${prefix}-model`, name: '理论模型与框架' },
          { id: `${prefix}-formula`, name: '关键公式与推导' },
          { id: `${prefix}-analysis`, name: '分析方法论' },
        ],
      },
      {
        id: `${prefix}-apply`,
        name: '应用与实践',
        children: [
          { id: `${prefix}-case`, name: '经典案例分析' },
          { id: `${prefix}-research`, name: '前沿研究动态' },
          { id: `${prefix}-paper`, name: '阅读相关论文' },
        ],
      },
    ];
  }

  if (skillType === 'tool') {
    return [
      {
        id: `${prefix}-setup`,
        name: '安装配置',
        children: [
          { id: `${prefix}-install`, name: '工具安装' },
          { id: `${prefix}-config`, name: '基础配置' },
          { id: `${prefix}-ui`, name: '界面熟悉' },
        ],
      },
      {
        id: `${prefix}-basic`,
        name: '基础操作',
        children: [
          { id: `${prefix}-create`, name: '创建与管理项目' },
          { id: `${prefix}-common`, name: '常用功能操作' },
          { id: `${prefix}-shortcut`, name: '快捷键与效率技巧' },
        ],
      },
      {
        id: `${prefix}-advanced`,
        name: '高级功能',
        children: [
          { id: `${prefix}-custom`, name: '自定义与扩展' },
          { id: `${prefix}-integrate`, name: '与其他工具集成' },
          { id: `${prefix}-troubleshoot`, name: '故障排查' },
        ],
      },
    ];
  }

  if (skillType === 'practical') {
    return [
      {
        id: `${prefix}-prep`,
        name: '准备工作',
        children: [
          { id: `${prefix}-theory`, name: '相关理论知识' },
          { id: `${prefix}-safety`, name: '安全规范与注意事项' },
          { id: `${prefix}-tools`, name: '工具与材料准备' },
        ],
      },
      {
        id: `${prefix}-basic`,
        name: '基础实操',
        children: [
          { id: `${prefix}-demo`, name: '跟随示范练习' },
          { id: `${prefix}-repeat`, name: '反复基础练习' },
          { id: `${prefix}-check`, name: '操作检查与纠错' },
        ],
      },
      {
        id: `${prefix}-advanced`,
        name: '进阶实操',
        children: [
          { id: `${prefix}-project`, name: '独立完成实操项目' },
          { id: `${prefix}-optimize`, name: '操作优化与提速' },
          { id: `${prefix}-teach`, name: '能指导他人操作' },
        ],
      },
    ];
  }

  // 默认通用学习路径
  return [
    {
      id: `${prefix}-intro`,
      name: '入门阶段',
      children: [
        { id: `${prefix}-what`, name: `${skillName} 是什么` },
        { id: `${prefix}-why`, name: `为什么学习 ${skillName}` },
        { id: `${prefix}-start`, name: '如何入门' },
      ],
    },
    {
      id: `${prefix}-learn`,
      name: '学习阶段',
      children: [
        { id: `${prefix}-core`, name: '核心知识点' },
        { id: `${prefix}-practice`, name: '动手练习' },
        { id: `${prefix}-resource`, name: '推荐学习资源' },
      ],
    },
    {
      id: `${prefix}-master`,
      name: '精通阶段',
      children: [
        { id: `${prefix}-project`, name: '实战项目应用' },
        { id: `${prefix}-deep`, name: '深入原理理解' },
        { id: `${prefix}-share`, name: '总结与分享' },
      ],
    },
  ];
}

// 获取技能树（有明确树就用，没有就生成默认树）
export function getSkillTree(skillId: string, skillName: string, skillType?: string): SkillTree | null {
  if (SKILL_TREES[skillId]) return SKILL_TREES[skillId];
  return generateDefaultTree(skillId, skillName, skillType);
}

export default SKILL_TREES;