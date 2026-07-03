import { generateWithAi, type AiProviderConfig } from './localAiService';
import type { UserContext } from './aiChatEngine';

// ============ 类型定义 ============

export type QuestionType = 'choice' | 'multi-choice' | 'fill' | 'short' | 'coding';

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  knowledgePoint: string;
  skillId: string;
  skillName: string;
};

export type Quiz = {
  id: string;
  title: string;
  skillId: string;
  skillName: string;
  projectId?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  questionCount: number;
  questions: QuizQuestion[];
  createdAt: string;
  timeLimit?: number;
};

export type UserAnswer = {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  score?: number;
  aiFeedback?: string;
};

export type QuizResult = {
  quizId: string;
  answers: UserAnswer[];
  totalScore: number;
  maxScore: number;
  correctCount: number;
  totalCount: number;
  timeSpent: number;
  completedAt: string;
  aiTeaching?: string;
  weakPoints?: string[];
  strongPoints?: string[];
};

// ============ 内置出题引擎（离线可用） ============

function generateId(): string {
  return 'q_' + Math.random().toString(36).slice(2, 10);
}

type RawQuestion = {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  knowledgePoint: string;
};

const BUILTIN_QUESTION_BANK: Record<string, RawQuestion[]> = {
  'JavaScript': [
    { type: 'choice', question: '以下哪个方法可以将数组的所有元素拼接成一个字符串？', options: ['join()', 'concat()', 'slice()', 'splice()'], correctAnswer: 'join()', explanation: 'join() 方法将数组中所有元素连接成一个字符串并返回。concat() 用于合并数组，slice() 提取子数组，splice() 增删数组元素。', difficulty: 1, knowledgePoint: '数组方法' },
    { type: 'choice', question: 'const 声明的变量有什么特点？', options: ['可以重新赋值', '声明时必须初始化且不能重新赋值', '只能声明数字类型', '具有函数作用域'], correctAnswer: '声明时必须初始化且不能重新赋值', explanation: 'const 声明的是常量，必须在声明时初始化，且之后不能重新赋值。但如果是对象或数组，其内部属性/元素仍然可以修改。', difficulty: 1, knowledgePoint: '变量声明' },
    { type: 'choice', question: '以下代码输出什么？\nconsole.log(typeof null)', options: ['"null"', '"undefined"', '"object"', '"number"'], correctAnswer: '"object"', explanation: '这是 JavaScript 的一个历史遗留 bug：typeof null 返回 "object"。', difficulty: 2, knowledgePoint: '数据类型' },
    { type: 'choice', question: '关于闭包，以下说法正确的是？', options: ['闭包只能在全局作用域中创建', '闭包是指函数能够访问其词法作用域外的变量', '闭包会导致内存泄漏，应该完全避免使用', '闭包是指函数和其词法环境的组合，可以访问外部函数的变量'], correctAnswer: '闭包是指函数和其词法环境的组合，可以访问外部函数的变量', explanation: '闭包是函数及其词法环境的组合。内部函数可以访问外部函数作用域中的变量，即使外部函数已经执行完毕。', difficulty: 3, knowledgePoint: '闭包' },
    { type: 'choice', question: '以下哪个不是 JavaScript 的基本数据类型？', options: ['string', 'number', 'array', 'boolean'], correctAnswer: 'array', explanation: '基本数据类型有 7 种：string、number、boolean、undefined、null、symbol、bigint。array 是引用类型。', difficulty: 1, knowledgePoint: '数据类型' },
    { type: 'choice', question: 'Promise.all() 在什么情况下会 reject？', options: ['所有 Promise 都 reject 时', '任意一个 Promise reject 时', '第一个 Promise reject 时', '超过一半的 Promise reject 时'], correctAnswer: '任意一个 Promise reject 时', explanation: 'Promise.all() 只要有任意一个 Promise reject，整体就会立即 reject。', difficulty: 3, knowledgePoint: '异步编程' },
    { type: 'choice', question: '以下代码的输出是什么？\nsetTimeout(() => console.log(1), 0);\nconsole.log(2);', options: ['1 然后 2', '2 然后 1', '同时输出', '不确定'], correctAnswer: '2 然后 1', explanation: 'setTimeout 是宏任务，会被放到任务队列中，等待同步代码执行完毕后才执行。所以先输出 2，再输出 1。', difficulty: 2, knowledgePoint: '事件循环' },
    { type: 'multi-choice', question: '以下哪些是 JavaScript 中的循环语句？（多选）', options: ['for', 'while', 'switch', 'do...while', 'forEach'], correctAnswer: 'for\nwhile\ndo...while', explanation: 'for、while、do...while 是循环语句。switch 是分支选择语句，forEach 是数组方法。', difficulty: 1, knowledgePoint: '流程控制' },
    { type: 'multi-choice', question: '关于箭头函数，以下说法正确的有？（多选）', options: ['箭头函数没有自己的 this', '箭头函数不能作为构造函数使用', '箭头函数有 arguments 对象', '箭头函数不能使用 yield 关键字', '箭头函数可以使用 new 调用'], correctAnswer: '箭头函数没有自己的 this\n箭头函数不能作为构造函数使用\n箭头函数不能使用 yield 关键字', explanation: '箭头函数没有自己的 this、arguments、super 或 new.target，不能用作构造函数，不能使用 yield。', difficulty: 2, knowledgePoint: '函数' },
    { type: 'fill', question: '使用 ______ 关键字可以声明一个块级作用域且可重新赋值的变量。', correctAnswer: 'let', explanation: 'let 声明块级作用域的可重新赋值变量。const 声明常量。var 声明函数作用域变量。', difficulty: 1, knowledgePoint: '变量声明' },
    { type: 'fill', question: 'JS 中用于将 JSON 字符串解析为对象的方法是 JSON.______()。', correctAnswer: 'parse', explanation: 'JSON.parse() 用于解析 JSON 字符串。JSON.stringify() 则相反，将对象序列化为字符串。', difficulty: 1, knowledgePoint: 'JSON处理' },
    { type: 'short', question: '请简述 == 和 === 的区别，并各举一个例子说明。', correctAnswer: '== 是抽象相等，会进行类型转换后再比较；=== 是严格相等，不进行类型转换，类型不同直接返回 false。例如：1 == "1" 为 true，但 1 === "1" 为 false。', explanation: '推荐优先使用 === 进行比较，代码更清晰可靠。', difficulty: 2, knowledgePoint: '运算符' },
    { type: 'short', question: '什么是事件冒泡？如何阻止事件冒泡？', correctAnswer: '事件冒泡是指当一个元素上的事件被触发后，事件会沿着 DOM 树向上传播，依次触发父元素的同类型事件。可以使用 event.stopPropagation() 方法来阻止事件冒泡。', explanation: '事件冒泡是 DOM 事件流的三个阶段之一（捕获-目标-冒泡）。', difficulty: 3, knowledgePoint: 'DOM事件' },
    { type: 'choice', question: 'Array.prototype.map() 方法的返回值是什么？', options: ['undefined', '原数组的引用', '一个新数组', '布尔值'], correctAnswer: '一个新数组', explanation: 'map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一次提供的函数后的返回值。原数组不会被修改。', difficulty: 1, knowledgePoint: '数组方法' },
    { type: 'fill', question: 'ES6 中用于解构赋值的两个符号是 ______ 和 {}。', correctAnswer: '[]', explanation: '数组解构使用 []，对象解构使用 {}。解构赋值可以快速从数组或对象中提取值赋给变量。', difficulty: 2, knowledgePoint: '解构赋值' },
  ],

  'Python': [
    { type: 'choice', question: 'Python 中用于定义函数的关键字是？', options: ['function', 'def', 'func', 'define'], correctAnswer: 'def', explanation: 'Python 使用 def 关键字来定义函数。', difficulty: 1, knowledgePoint: '函数' },
    { type: 'choice', question: '以下哪个不是 Python 的内置数据类型？', options: ['list', 'tuple', 'array', 'dict'], correctAnswer: 'array', explanation: 'Python 内置数据类型包括 list、tuple、dict、set 等。array 不是内置类型，需要通过 array 模块或 numpy 使用。', difficulty: 1, knowledgePoint: '数据类型' },
    { type: 'choice', question: 'Python 中的列表和元组的主要区别是什么？', options: ['列表有序，元组无序', '列表可变，元组不可变', '列表只能存数字，元组可以存任意类型', '列表用()定义，元组用[]定义'], correctAnswer: '列表可变，元组不可变', explanation: '列表（list）是可变的，用 [] 定义；元组（tuple）是不可变的，用 () 定义。两者都是有序序列。', difficulty: 1, knowledgePoint: '数据结构' },
    { type: 'choice', question: '以下代码的输出是什么？\nprint([x**2 for x in range(5)])', options: ['[0, 1, 2, 3, 4]', '[1, 4, 9, 16, 25]', '[0, 1, 4, 9, 16]', '[0, 2, 4, 6, 8]'], correctAnswer: '[0, 1, 4, 9, 16]', explanation: '这是列表推导式，range(5) 生成 0-4，x**2 是平方运算。', difficulty: 2, knowledgePoint: '列表推导式' },
    { type: 'choice', question: 'Python 中用于处理异常的关键字组合是？', options: ['try-except', 'catch-throw', 'error-handle', 'if-error'], correctAnswer: 'try-except', explanation: 'Python 使用 try-except 语句处理异常，还可以搭配 finally 和 else 使用。', difficulty: 2, knowledgePoint: '异常处理' },
    { type: 'choice', question: '以下哪个是 Python 的列表推导式？', options: ['[x for x in range(10)]', '{x: x*2 for x in range(5)}', '(x for x in range(10))', '以上都是'], correctAnswer: '[x for x in range(10)]', explanation: '[] 是列表推导式，{} 是字典/集合推导式，() 是生成器表达式。', difficulty: 2, knowledgePoint: '推导式' },
    { type: 'multi-choice', question: '以下哪些是 Python 中的可变数据类型？（多选）', options: ['list', 'tuple', 'dict', 'str', 'set'], correctAnswer: 'list\ndict\nset', explanation: 'list、dict、set 是可变的。str 和 tuple 是不可变的。', difficulty: 2, knowledgePoint: '数据类型' },
    { type: 'fill', question: 'Python 中使用 ______ 关键字来定义类。', correctAnswer: 'class', explanation: 'Python 使用 class 关键字定义类。', difficulty: 1, knowledgePoint: '面向对象' },
    { type: 'fill', question: '读取文件时，推荐使用 ______ 语句，它会自动管理文件的打开和关闭。', correctAnswer: 'with', explanation: 'with 语句（上下文管理器）可以确保文件在使用完毕后自动关闭。', difficulty: 2, knowledgePoint: '文件操作' },
    { type: 'fill', question: 'Python 中用于表示空值的关键字是 ______。', correctAnswer: 'None', explanation: 'None 是 Python 中的空值对象，表示没有值。它的类型是 NoneType。', difficulty: 1, knowledgePoint: '数据类型' },
    { type: 'short', question: '什么是 Python 的装饰器（Decorator）？请举一个简单的应用场景。', correctAnswer: '装饰器是一种修改或增强函数/类行为的设计模式，本质上是接收函数作为参数并返回新函数的高阶函数。常见应用场景：日志记录、性能计时、权限验证、缓存等。', explanation: '装饰器使用 @decorator_name 语法糖，符合开闭原则。', difficulty: 4, knowledgePoint: '装饰器' },
    { type: 'choice', question: 'Python 中 len([1, 2, [3, 4]]) 的结果是？', options: ['2', '3', '4', '5'], correctAnswer: '3', explanation: 'len() 只计算最外层列表的元素个数。列表 [1, 2, [3, 4]] 有 3 个元素：1、2 和 [3, 4]。', difficulty: 2, knowledgePoint: '内置函数' },
  ],

  'Java': [
    { type: 'choice', question: 'Java 程序的入口方法是？', options: ['start()', 'main()', 'init()', 'run()'], correctAnswer: 'main()', explanation: 'Java 程序的入口是 public static void main(String[] args) 方法。', difficulty: 1, knowledgePoint: '基础语法' },
    { type: 'choice', question: '以下哪个不是 Java 的基本数据类型？', options: ['int', 'boolean', 'String', 'char'], correctAnswer: 'String', explanation: 'String 是引用类型（类），不是基本数据类型。Java 的基本类型有 8 种：byte、short、int、long、float、double、boolean、char。', difficulty: 1, knowledgePoint: '数据类型' },
    { type: 'choice', question: 'Java 中用于实现接口的关键字是？', options: ['extends', 'implements', 'interface', 'abstract'], correctAnswer: 'implements', explanation: '类使用 implements 关键字实现接口。extends 用于类继承类或接口继承接口。', difficulty: 1, knowledgePoint: '面向对象' },
    { type: 'choice', question: '关于 Java 的 final 关键字，以下说法错误的是？', options: ['final 修饰的类不能被继承', 'final 修饰的方法不能被重写', 'final 修饰的变量不能被修改', 'final 修饰的引用类型变量，其指向的对象内容也不能修改'], correctAnswer: 'final 修饰的引用类型变量，其指向的对象内容也不能修改', explanation: 'final 修饰引用类型变量时，引用不能改变（不能指向其他对象），但对象的内容是可以修改的。', difficulty: 2, knowledgePoint: '关键字' },
    { type: 'choice', question: '以下哪个集合是有序且允许重复元素的？', options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'], correctAnswer: 'ArrayList', explanation: 'ArrayList 是有序的（按插入顺序）且允许重复元素。HashSet 和 TreeSet 不允许重复。HashMap 是键值对存储。', difficulty: 2, knowledgePoint: '集合框架' },
    { type: 'multi-choice', question: '以下哪些是 Java 的访问修饰符？（多选）', options: ['public', 'private', 'protected', 'static', 'default（包访问权限）'], correctAnswer: 'public\nprivate\nprotected\ndefault（包访问权限）', explanation: 'Java 有 4 种访问级别：public、protected、default（包访问，不写修饰符）、private。static 不是访问修饰符。', difficulty: 2, knowledgePoint: '面向对象' },
    { type: 'fill', question: 'Java 中所有类的父类是 ______ 类。', correctAnswer: 'Object', explanation: 'java.lang.Object 是所有类的根类，所有 Java 类都直接或间接继承自 Object。', difficulty: 1, knowledgePoint: '面向对象' },
    { type: 'fill', question: 'Java 中用于创建对象的关键字是 ______。', correctAnswer: 'new', explanation: '使用 new 关键字调用构造方法来创建对象。', difficulty: 1, knowledgePoint: '面向对象' },
    { type: 'short', question: '请简述 Java 中 == 和 equals() 的区别。', correctAnswer: '== 比较的是两个引用是否指向同一个对象（内存地址）；equals() 方法比较的是对象的内容是否相等。对于基本数据类型，== 比较的是值。需要注意，如果类没有重写 equals() 方法，默认使用 Object 的 equals()，效果和 == 一样。', explanation: '比较对象内容应该使用 equals()，比较基本类型用 ==。', difficulty: 2, knowledgePoint: '对象比较' },
  ],

  'Go': [
    { type: 'choice', question: 'Go 语言中用于定义变量的关键字是？', options: ['var', 'let', 'const', 'def'], correctAnswer: 'var', explanation: 'Go 使用 var 关键字声明变量，也可以使用 := 短变量声明方式。', difficulty: 1, knowledgePoint: '变量声明' },
    { type: 'choice', question: 'Go 语言中函数可以返回多个值吗？', options: ['不可以', '可以，最多返回 2 个', '可以返回任意多个值', '只能通过指针返回多个值'], correctAnswer: '可以返回任意多个值', explanation: 'Go 语言支持函数返回多个值，这是 Go 的一个重要特性，常用于返回结果和错误。', difficulty: 1, knowledgePoint: '函数' },
    { type: 'choice', question: 'Go 中用于并发的关键字是？', options: ['async', 'await', 'go', 'thread'], correctAnswer: 'go', explanation: '使用 go 关键字启动一个 goroutine（轻量级协程），这是 Go 并发编程的核心。', difficulty: 2, knowledgePoint: '并发' },
    { type: 'choice', question: '以下哪个不是 Go 的数据类型？', options: ['int', 'string', 'array', 'class'], correctAnswer: 'class', explanation: 'Go 不是传统的面向对象语言，没有 class 关键字。Go 使用 struct（结构体）和接口来实现面向对象的特性。', difficulty: 1, knowledgePoint: '数据类型' },
    { type: 'fill', question: 'Go 中用于处理错误的内置类型是 ______。', correctAnswer: 'error', explanation: 'error 是 Go 的内置接口类型，用于表示错误状态。函数通常返回 error 作为最后一个返回值。', difficulty: 2, knowledgePoint: '错误处理' },
    { type: 'fill', question: 'Go 中用于 goroutine 之间通信的类型是 ______。', correctAnswer: 'channel', explanation: 'channel（通道）是 Go 中用于 goroutine 之间通信和同步的重要类型。', difficulty: 2, knowledgePoint: '并发' },
    { type: 'short', question: '请简述 Go 语言中 defer 关键字的作用和特点。', correctAnswer: 'defer 用于延迟执行函数调用，在当前函数返回前执行。多个 defer 语句遵循后进先出（LIFO）的顺序。常用于资源清理，如关闭文件、解锁等。', explanation: 'defer 是 Go 语言的一个特色特性，能确保资源被正确释放。', difficulty: 2, knowledgePoint: '流程控制' },
  ],

  'SQL': [
    { type: 'choice', question: '以下哪个 SQL 语句用于从数据库中查询数据？', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correctAnswer: 'SELECT', explanation: 'SELECT 用于查询数据，INSERT 插入数据，UPDATE 更新数据，DELETE 删除数据。', difficulty: 1, knowledgePoint: '基础语法' },
    { type: 'choice', question: '用于过滤查询结果的子句是？', options: ['GROUP BY', 'WHERE', 'ORDER BY', 'HAVING'], correctAnswer: 'WHERE', explanation: 'WHERE 用于在查询时过滤行。GROUP BY 用于分组，ORDER BY 用于排序，HAVING 用于过滤分组后的结果。', difficulty: 1, knowledgePoint: '查询' },
    { type: 'choice', question: '以下哪个 SQL 函数用于计算行数？', options: ['SUM()', 'AVG()', 'COUNT()', 'MAX()'], correctAnswer: 'COUNT()', explanation: 'COUNT() 计算行数。SUM() 求和，AVG() 求平均值，MAX() 求最大值。', difficulty: 1, knowledgePoint: '聚合函数' },
    { type: 'choice', question: 'INNER JOIN 和 LEFT JOIN 的主要区别是？', options: ['没有区别，只是语法不同', 'INNER JOIN 只返回匹配的行，LEFT JOIN 返回左表所有行', 'LEFT JOIN 只返回左表，不返回右表数据', 'INNER JOIN 返回所有表的所有行'], correctAnswer: 'INNER JOIN 只返回匹配的行，LEFT JOIN 返回左表所有行', explanation: 'INNER JOIN 只返回两表中匹配的行。LEFT JOIN 返回左表的所有行，右表匹配不到的地方用 NULL 填充。', difficulty: 2, knowledgePoint: '连接查询' },
    { type: 'multi-choice', question: '以下哪些是 SQL 中的聚合函数？（多选）', options: ['COUNT()', 'SUM()', 'UPPER()', 'AVG()', 'CONCAT()'], correctAnswer: 'COUNT()\nSUM()\nAVG()', explanation: 'COUNT、SUM、AVG 是聚合函数，用于对一组值进行计算。UPPER 和 CONCAT 是字符串函数。', difficulty: 2, knowledgePoint: '聚合函数' },
    { type: 'fill', question: '用于对查询结果进行排序的子句是 ______ BY。', correctAnswer: 'ORDER', explanation: 'ORDER BY 用于对查询结果进行排序，ASC 升序（默认），DESC 降序。', difficulty: 1, knowledgePoint: '查询' },
    { type: 'fill', question: '用于给列或表取别名的关键字是 ______。', correctAnswer: 'AS', explanation: 'AS 关键字用于给列名或表名指定别名，可以省略不写。', difficulty: 1, knowledgePoint: '基础语法' },
    { type: 'short', question: '请简述事务的 ACID 特性分别是什么。', correctAnswer: 'ACID 是事务的四个特性：A（Atomicity 原子性）：事务中的操作要么全部成功，要么全部失败；C（Consistency 一致性）：事务使数据从一个一致状态转移到另一个一致状态；I（Isolation 隔离性）：多个事务之间互不干扰；D（Durability 持久性）：事务提交后，数据永久保存。', explanation: 'ACID 是数据库事务的核心概念，保证数据的可靠性。', difficulty: 3, knowledgePoint: '事务' },
  ],

  'MySQL': [
    { type: 'choice', question: 'MySQL 中用于查看所有数据库的命令是？', options: ['SHOW DATABASES', 'LIST DATABASES', 'SELECT DATABASES', 'DISPLAY DATABASES'], correctAnswer: 'SHOW DATABASES', explanation: 'SHOW DATABASES 用于列出所有数据库。', difficulty: 1, knowledgePoint: '基础命令' },
    { type: 'choice', question: '以下哪个存储引擎是 MySQL 默认的、支持事务的？', options: ['MyISAM', 'InnoDB', 'Memory', 'CSV'], correctAnswer: 'InnoDB', explanation: 'InnoDB 是 MySQL 5.5 之后的默认存储引擎，支持事务、外键、行级锁。MyISAM 不支持事务。', difficulty: 2, knowledgePoint: '存储引擎' },
    { type: 'choice', question: 'MySQL 中用于获取当前日期和时间的函数是？', options: ['DATE()', 'NOW()', 'TIME()', 'YEAR()'], correctAnswer: 'NOW()', explanation: 'NOW() 返回当前日期和时间。DATE() 提取日期部分，TIME() 提取时间部分，YEAR() 提取年份。', difficulty: 1, knowledgePoint: '日期函数' },
    { type: 'fill', question: 'MySQL 中用于查看表结构的语句是 DESCRIBE 或简写 ______。', correctAnswer: 'DESC', explanation: 'DESC table_name 是 DESCRIBE table_name 的简写，用于查看表的结构信息。', difficulty: 1, knowledgePoint: '基础命令' },
    { type: 'fill', question: 'MySQL 中主键约束的关键字是 ______ KEY。', correctAnswer: 'PRIMARY', explanation: 'PRIMARY KEY 约束用于唯一标识表中的每一行记录，主键值必须唯一且非空。', difficulty: 1, knowledgePoint: '约束' },
    { type: 'short', question: '什么是索引？使用索引有什么优缺点？', correctAnswer: '索引是一种用于加速数据库查询的数据结构。优点：大大提高查询速度，加速表与表之间的连接。缺点：占用额外的存储空间，降低插入、更新、删除的速度（因为索引也要同步更新）。', explanation: '索引是数据库优化的重要手段，但需要合理使用，不是越多越好。', difficulty: 3, knowledgePoint: '索引' },
  ],

  'React': [
    { type: 'choice', question: 'React 中用于在函数组件中管理状态的 Hook 是？', options: ['useEffect', 'useState', 'useContext', 'useRef'], correctAnswer: 'useState', explanation: 'useState 用于函数组件的状态管理。useEffect 用于副作用，useContext 用于上下文，useRef 用于引用。', difficulty: 1, knowledgePoint: 'Hooks' },
    { type: 'choice', question: 'JSX 最终会被编译成什么？', options: ['HTML字符串', 'React.createElement() 调用', 'document.createElement() 调用', '模板字符串'], correctAnswer: 'React.createElement() 调用', explanation: 'JSX 最终会被 Babel 等工具编译为 React.createElement() 函数调用。', difficulty: 2, knowledgePoint: 'JSX' },
    { type: 'choice', question: '关于 React 的 key 属性，以下说法正确的是？', options: ['key 只在列表渲染时需要，没什么实际作用', 'key 帮助 React 识别哪些元素改变了，提升 diff 性能', 'key 可以用数组索引作为值，没有任何问题', 'key 是必须的，每个元素都要加'], correctAnswer: 'key 帮助 React 识别哪些元素改变了，提升 diff 性能', explanation: 'key 帮助 React 识别哪些元素改变了（添加/删除/重排），从而高效更新 DOM。尽量使用唯一稳定的 ID。', difficulty: 2, knowledgePoint: '列表渲染' },
    { type: 'choice', question: 'useEffect 的依赖数组为空数组 [] 时，effect 什么时候执行？', options: ['每次组件渲染后都执行', '只在组件挂载时执行一次', '只在组件卸载时执行', '从不执行'], correctAnswer: '只在组件挂载时执行一次', explanation: '依赖数组为空 [] 时，effect 只在组件挂载时执行一次，对应类组件的 componentDidMount。', difficulty: 2, knowledgePoint: 'Hooks' },
    { type: 'choice', question: 'useCallback 和 useMemo 的主要区别是？', options: ['useCallback 缓存函数，useMemo 缓存计算结果', 'useMemo 缓存函数，useCallback 缓存计算结果', '两者完全一样', 'useCallback 用于类组件，useMemo 用于函数组件'], correctAnswer: 'useCallback 缓存函数，useMemo 缓存计算结果', explanation: 'useCallback(fn, deps) 返回缓存的函数引用；useMemo(() => value, deps) 返回缓存的计算结果。', difficulty: 3, knowledgePoint: 'Hooks' },
    { type: 'multi-choice', question: '以下哪些是 React 的内置 Hook？（多选）', options: ['useState', 'useEffect', 'useComponent', 'useRef', 'useMemory'], correctAnswer: 'useState\nuseEffect\nuseRef', explanation: 'useState、useEffect、useRef 都是 React 内置 Hook。没有 useComponent 和 useMemory。', difficulty: 2, knowledgePoint: 'Hooks' },
    { type: 'fill', question: 'React 中父组件向子组件传递数据通过 ______ 属性实现。', correctAnswer: 'props', explanation: 'props 是父组件向子组件传递数据的方式，props 是只读的。', difficulty: 1, knowledgePoint: '组件通信' },
    { type: 'short', question: '什么是虚拟 DOM？React 使用虚拟 DOM 有什么优势？', correctAnswer: '虚拟 DOM 是用 JS 对象描述真实 DOM 结构的轻量级表示。当状态变化时，React 先在虚拟 DOM 中对比差异（diff 算法），然后只更新真实 DOM 中需要变化的部分，减少 DOM 操作，提升性能。', explanation: '虚拟 DOM 是 React 的核心特性之一，也使得跨平台（React Native）成为可能。', difficulty: 3, knowledgePoint: '虚拟DOM' },
  ],

  'TypeScript': [
    { type: 'choice', question: 'TypeScript 中声明一个字符串数组的正确写法是？', options: ['string[]', 'array<string>', 'str[]', 'Array.string'], correctAnswer: 'string[]', explanation: 'TypeScript 中数组类型有两种写法：string[] 或 Array<string>。推荐前者。', difficulty: 1, knowledgePoint: '类型基础' },
    { type: 'choice', question: 'interface 和 type 的主要区别是？', options: ['interface 只能定义对象类型，type 可以定义任意类型', 'interface 性能更好', 'type 不能定义函数类型', '完全一样，没有区别'], correctAnswer: 'interface 只能定义对象类型，type 可以定义任意类型', explanation: 'interface 主要用于定义对象形状，支持声明合并。type 更灵活，可以定义联合类型、交叉类型等。一般优先使用 interface。', difficulty: 2, knowledgePoint: '类型定义' },
    { type: 'choice', question: 'TypeScript 中 unknown 和 any 的区别是？', options: ['没有区别', 'unknown 可以赋值给任何类型，any 不行', 'any 可以赋值给任何类型，unknown 不行，需要类型断言或类型收缩', 'unknown 只能用于函数返回值'], correctAnswer: 'any 可以赋值给任何类型，unknown 不行，需要类型断言或类型收缩', explanation: 'any 会关闭类型检查，unknown 是类型安全的 any。使用 unknown 时必须先进行类型检查或断言才能操作。', difficulty: 3, knowledgePoint: '类型基础' },
    { type: 'fill', question: 'TypeScript 中表示任何类型的关键字是 ______。', correctAnswer: 'any', explanation: 'any 类型可以是任何值，相当于关闭类型检查。应尽量避免使用，可用 unknown 代替。', difficulty: 1, knowledgePoint: '类型基础' },
    { type: 'fill', question: 'TypeScript 中定义可选属性使用的符号是 ______。', correctAnswer: '?', explanation: '在属性名后加 ? 表示该属性是可选的，如：interface User { name: string; age?: number; }', difficulty: 1, knowledgePoint: '类型定义' },
    { type: 'short', question: '什么是泛型（Generics）？请说明它的一个使用场景。', correctAnswer: '泛型是指在定义函数、接口或类时，不预先指定具体类型，而在使用时再指定类型的特性。常用于数组、Promise、工具库等需要复用且保持类型安全的场景。例如：function identity<T>(arg: T): T { return arg; }', explanation: '泛型使得代码可以复用的同时保持类型安全，比 any 更可靠。', difficulty: 3, knowledgePoint: '泛型' },
  ],

  'HTML/CSS': [
    { type: 'choice', question: '以下哪个是 HTML5 新增的语义化标签？', options: ['<div>', '<span>', '<article>', '<table>'], correctAnswer: '<article>', explanation: '<article> 是 HTML5 新增的语义化标签。还有 header、nav、main、section、footer 等。', difficulty: 1, knowledgePoint: 'HTML语义化' },
    { type: 'choice', question: 'CSS 中 position: absolute 的元素相对于什么定位？', options: ['始终相对于浏览器窗口', '相对于最近的定位祖先元素（position 非 static）', '相对于父元素，无论父元素是什么定位', '相对于 body 元素'], correctAnswer: '相对于最近的定位祖先元素（position 非 static）', explanation: 'position: absolute 的元素相对于最近的定位（非 static）祖先元素定位。没有则相对于初始包含块。', difficulty: 2, knowledgePoint: '定位' },
    { type: 'choice', question: 'Flexbox 中，让主轴上的元素均匀分布，两端对齐的属性值是？', options: ['flex-start', 'center', 'space-between', 'space-around'], correctAnswer: 'space-between', explanation: 'justify-content: space-between 使元素均匀分布，两端对齐。space-around 是每个元素两侧有相等间距。', difficulty: 2, knowledgePoint: 'Flexbox' },
    { type: 'choice', question: 'CSS 中以下哪个选择器优先级最高？', options: ['类选择器 .class', 'ID 选择器 #id', '标签选择器 div', '通配符 *'], correctAnswer: 'ID 选择器 #id', explanation: '选择器优先级从高到低：行内样式 > ID 选择器 > 类/伪类/属性选择器 > 标签/伪元素选择器 > 通配符。', difficulty: 2, knowledgePoint: '选择器' },
    { type: 'fill', question: 'CSS 中设置元素不透明度的属性是 ______。', correctAnswer: 'opacity', explanation: 'opacity 设置元素透明度，0 到 1。如果只想背景透明，使用 rgba() 颜色值。', difficulty: 1, knowledgePoint: 'CSS属性' },
    { type: 'fill', question: 'CSS 中用于创建弹性布局的属性是 display: ______。', correctAnswer: 'flex', explanation: 'display: flex 创建弹性盒子布局，是现代 CSS 布局的重要方式。', difficulty: 1, knowledgePoint: 'Flexbox' },
    { type: 'short', question: '什么是 CSS 盒模型（Box Model）？标准盒模型和 IE 盒模型有什么区别？', correctAnswer: 'CSS 盒模型描述元素的大小计算方式，包括 content、padding、border、margin 四部分。标准盒模型（content-box）：width/height 只包含内容区；IE 盒模型（border-box）：width/height 包含内容+内边距+边框。可以用 box-sizing 属性切换。', explanation: '推荐使用 box-sizing: border-box，更容易控制元素实际尺寸。', difficulty: 2, knowledgePoint: '盒模型' },
  ],

  'Git': [
    { type: 'choice', question: '查看当前 Git 仓库状态的命令是？', options: ['git status', 'git log', 'git diff', 'git show'], correctAnswer: 'git status', explanation: 'git status 显示工作区和暂存区的状态。git log 查看提交历史，git diff 查看差异。', difficulty: 1, knowledgePoint: '基础命令' },
    { type: 'choice', question: 'git reset 和 git revert 的主要区别是？', options: ['功能一样，只是语法不同', 'git reset 会删除提交历史，git revert 会创建新的反向提交', 'git revert 只能回退一个提交', 'git reset 只能用在远程分支'], correctAnswer: 'git reset 会删除提交历史，git revert 会创建新的反向提交', explanation: 'git reset 回退到某个提交，修改历史；git revert 创建新提交来撤销改动，不修改历史。已推送远程的推荐用 revert。', difficulty: 3, knowledgePoint: '版本回退' },
    { type: 'choice', question: '将工作区的修改添加到暂存区的命令是？', options: ['git add', 'git commit', 'git push', 'git pull'], correctAnswer: 'git add', explanation: 'git add 将修改添加到暂存区。git commit 提交到本地仓库，git push 推送到远程，git pull 拉取远程。', difficulty: 1, knowledgePoint: '基础命令' },
    { type: 'fill', question: '将当前分支与另一个分支合并的命令是 git ______。', correctAnswer: 'merge', explanation: 'git merge <分支名> 将指定分支合并到当前分支。', difficulty: 2, knowledgePoint: '分支合并' },
    { type: 'fill', question: '创建并切换到新分支的命令是 git checkout -b 或 git switch ______。', correctAnswer: '-c', explanation: 'git switch -c <分支名> 创建并切换到新分支，等同于 git checkout -b。', difficulty: 2, knowledgePoint: '分支管理' },
    { type: 'short', question: '什么是 Git 工作流？请简述一种常见的 Git 工作流。', correctAnswer: 'Git 工作流是团队协作时使用 Git 的规范和流程。常见的有 Git Flow：包含 master、develop、feature、release、hotfix 五种分支类型。还有 GitHub Flow（更简单，只有 master + feature 分支）适合持续部署。', explanation: '选择合适的工作流取决于团队规模、发布频率、项目特点等。', difficulty: 3, knowledgePoint: '工作流' },
  ],

  'Vue': [
    { type: 'choice', question: 'Vue 3 中，组合式 API 的入口函数是？', options: ['data()', 'setup()', 'created()', 'mounted()'], correctAnswer: 'setup()', explanation: 'setup() 是 Vue 3 组合式 API 的入口。Vue 3.2+ 还支持 <script setup> 语法糖。', difficulty: 2, knowledgePoint: '组合式API' },
    { type: 'choice', question: 'Vue 中 v-if 和 v-show 的区别是？', options: ['功能完全相同，没有区别', 'v-if 是真正的条件渲染，v-show 只是切换 display 属性', 'v-show 不支持在 v-else 后使用', 'v-if 性能更好'], correctAnswer: 'v-if 是真正的条件渲染，v-show 只是切换 display 属性', explanation: 'v-if 为 false 时不渲染到 DOM；v-show 始终渲染，只通过 CSS 控制显示隐藏。频繁切换用 v-show。', difficulty: 1, knowledgePoint: '指令' },
    { type: 'choice', question: 'Vue 中用于监听数据变化的 API 是？', options: ['computed', 'watch', 'ref', 'reactive'], correctAnswer: 'watch', explanation: 'watch 用于监听数据变化并执行副作用。computed 是计算属性，ref/reactive 用于定义响应式数据。', difficulty: 2, knowledgePoint: '响应式' },
    { type: 'fill', question: 'Vue 中用于双向数据绑定的指令是 v-______。', correctAnswer: 'model', explanation: 'v-model 实现表单元素与数据的双向绑定，本质上是 v-bind:value 和 v-on:input 的语法糖。', difficulty: 1, knowledgePoint: '指令' },
    { type: 'fill', question: 'Vue 3 中用于定义基本类型响应式数据的 API 是 ______。', correctAnswer: 'ref', explanation: 'ref 用于定义基本类型的响应式数据，使用时需要 .value 访问。reactive 用于对象类型。', difficulty: 2, knowledgePoint: '响应式' },
    { type: 'short', question: 'Vue 的计算属性（computed）和方法（methods）有什么区别？', correctAnswer: '计算属性是基于它们的响应式依赖进行缓存的，只有相关依赖发生改变时才会重新计算。方法每次调用都会重新执行。对于复杂计算，计算属性性能更好；对于需要传参或每次都需要重新计算的，使用方法。', explanation: '合理使用计算属性可以提升性能，避免不必要的重复计算。', difficulty: 2, knowledgePoint: '计算属性' },
  ],

  'Node.js': [
    { type: 'choice', question: 'Node.js 中用于创建 HTTP 服务器的内置模块是？', options: ['http', 'server', 'web', 'net'], correctAnswer: 'http', explanation: 'http 模块是 Node.js 内置的 HTTP 模块，可以创建 HTTP 服务器和客户端。', difficulty: 1, knowledgePoint: '核心模块' },
    { type: 'choice', question: 'Node.js 的事件循环中，以下哪个先执行？', options: ['poll 轮询', 'setTimeout 定时器', 'process.nextTick', 'setImmediate'], correctAnswer: 'process.nextTick', explanation: 'process.nextTick 属于微任务，优先级最高，在当前阶段结束后立即执行。', difficulty: 4, knowledgePoint: '事件循环' },
    { type: 'choice', question: '以下哪个是 Node.js 的包管理器？', options: ['pip', 'npm', 'gem', 'cargo'], correctAnswer: 'npm', explanation: 'npm 是 Node.js 的包管理器。pip 是 Python 的，gem 是 Ruby 的，cargo 是 Rust 的。', difficulty: 1, knowledgePoint: '包管理' },
    { type: 'fill', question: 'CommonJS 中导入模块使用 ______() 函数。', correctAnswer: 'require', explanation: 'CommonJS 使用 require() 导入模块，module.exports 导出模块。ES Module 使用 import/export。', difficulty: 1, knowledgePoint: '模块系统' },
    { type: 'fill', question: 'Node.js 中用于处理文件路径的内置模块是 ______。', correctAnswer: 'path', explanation: 'path 模块提供了用于处理文件路径的工具函数，如 path.join、path.resolve 等。', difficulty: 2, knowledgePoint: '核心模块' },
    { type: 'short', question: '什么是 Node.js 的事件驱动和非阻塞 I/O？', correctAnswer: '事件驱动：当特定事件发生时执行回调函数，如请求到达、文件读取完成等。非阻塞 I/O：Node.js 在执行 I/O 操作（如读写文件、网络请求）时不会阻塞主线程，而是在操作完成后通过回调通知继续执行。这使得 Node.js 可以用单线程处理大量并发请求。', explanation: '事件驱动和非阻塞 I/O 是 Node.js 的核心特性，使其适合高并发场景。', difficulty: 3, knowledgePoint: '核心概念' },
  ],

  'Docker': [
    { type: 'choice', question: 'Docker 中用于构建镜像的文件是？', options: ['Dockerfile', 'docker-compose.yml', '.dockerignore', 'Makefile'], correctAnswer: 'Dockerfile', explanation: 'Dockerfile 是一个文本文件，包含了构建 Docker 镜像所需的所有指令。docker-compose.yml 用于编排多容器应用。', difficulty: 1, knowledgePoint: '镜像构建' },
    { type: 'choice', question: 'Docker 镜像和容器的关系是？', options: ['镜像和容器是一样的', '镜像是运行中的容器', '容器是镜像的运行实例', '镜像包含容器'], correctAnswer: '容器是镜像的运行实例', explanation: '镜像是静态的模板，容器是镜像的运行实例。可以用同一个镜像启动多个不同的容器。', difficulty: 1, knowledgePoint: '基础概念' },
    { type: 'choice', question: '以下哪个命令用于运行一个新的容器？', options: ['docker run', 'docker start', 'docker create', 'docker exec'], correctAnswer: 'docker run', explanation: 'docker run 创建并启动一个新容器。docker start 启动已停止的容器，docker create 只创建不启动，docker exec 在运行中的容器中执行命令。', difficulty: 1, knowledgePoint: '容器命令' },
    { type: 'fill', question: 'Docker Compose 使用的配置文件是 ______.yml。', correctAnswer: 'docker-compose', explanation: 'docker-compose.yml 是 Docker Compose 的配置文件，用于定义和运行多容器 Docker 应用。', difficulty: 1, knowledgePoint: 'Compose' },
    { type: 'fill', question: '查看正在运行的容器列表的命令是 docker ______。', correctAnswer: 'ps', explanation: 'docker ps 列出正在运行的容器。加 -a 参数可以查看所有容器（包括已停止的）。', difficulty: 1, knowledgePoint: '容器命令' },
    { type: 'short', question: '请简述 Docker 的优势和使用场景。', correctAnswer: 'Docker 的优势：环境一致性（开发、测试、生产环境一致）、快速部署、资源利用率高、易于扩展和迁移、版本控制。常见使用场景：微服务架构、持续集成/持续部署（CI/CD）、开发环境统一、应用快速交付等。', explanation: 'Docker 容器化技术已经成为现代软件开发和部署的标准配置。', difficulty: 2, knowledgePoint: '基础概念' },
  ],

  'Linux': [
    { type: 'choice', question: '查看当前所在目录的命令是？', options: ['ls', 'pwd', 'cd', 'dir'], correctAnswer: 'pwd', explanation: 'pwd（print working directory）显示当前工作目录。ls 列出目录内容，cd 切换目录。', difficulty: 1, knowledgePoint: '文件系统' },
    { type: 'choice', question: '以下哪个命令用于查看文件内容？', options: ['cat', 'mkdir', 'rm', 'mv'], correctAnswer: 'cat', explanation: 'cat 用于查看文件内容。mkdir 创建目录，rm 删除，mv 移动/重命名。', difficulty: 1, knowledgePoint: '文件操作' },
    { type: 'choice', question: '修改文件权限的命令是？', options: ['chmod', 'chown', 'chgrp', 'chage'], correctAnswer: 'chmod', explanation: 'chmod 修改文件权限。chown 修改所有者，chgrp 修改所属组。', difficulty: 2, knowledgePoint: '权限管理' },
    { type: 'choice', question: 'Linux 中 root 用户的 UID 是？', options: ['0', '1', '1000', '999'], correctAnswer: '0', explanation: 'root 用户的 UID（用户标识）是 0，拥有系统最高权限。普通用户 UID 通常从 1000 开始。', difficulty: 2, knowledgePoint: '用户管理' },
    { type: 'fill', question: '切换到 root 用户的命令是 su 或 ______。', correctAnswer: 'sudo', explanation: 'sudo 以 root 权限执行单条命令，su 切换到 root 用户（需要 root 密码）。', difficulty: 1, knowledgePoint: '用户管理' },
    { type: 'fill', question: '查看进程状态的常用命令是 ______ 或 ps。', correctAnswer: 'top', explanation: 'top 实时显示进程状态，ps 显示当前进程快照。htop 是 top 的增强版。', difficulty: 2, knowledgePoint: '进程管理' },
    { type: 'short', question: '请简述 Linux 文件权限的三种基本权限及其含义。', correctAnswer: 'Linux 文件有三种基本权限：r（read，读）：可以读取文件内容或列出目录内容；w（write，写）：可以修改文件内容或在目录中增删文件；x（execute，执行）：可以执行文件或进入目录。使用 chmod 命令修改权限，可用数字表示（r=4, w=2, x=1）。', explanation: '权限管理是 Linux 安全的基石，理解权限至关重要。', difficulty: 2, knowledgePoint: '权限管理' },
  ],

  '算法': [
    { type: 'choice', question: '以下哪种排序算法的平均时间复杂度是 O(n log n)？', options: ['冒泡排序', '快速排序', '插入排序', '选择排序'], correctAnswer: '快速排序', explanation: '快速排序平均时间复杂度 O(n log n)。冒泡、插入、选择排序的平均时间复杂度都是 O(n²)。', difficulty: 2, knowledgePoint: '排序算法' },
    { type: 'choice', question: '二叉搜索树的中序遍历结果有什么特点？', options: ['随机顺序', '升序排列', '降序排列', '层序排列'], correctAnswer: '升序排列', explanation: '二叉搜索树（BST）的中序遍历（左-根-右）结果是升序排列的。', difficulty: 2, knowledgePoint: '树' },
    { type: 'choice', question: '栈（Stack）的特点是？', options: ['先进先出（FIFO）', '后进先出（LIFO）', '随机访问', '双端操作'], correctAnswer: '后进先出（LIFO）', explanation: '栈是后进先出（Last In First Out）的数据结构，只能在栈顶进行插入和删除操作。队列是先进先出（FIFO）。', difficulty: 1, knowledgePoint: '数据结构' },
    { type: 'choice', question: '二分查找的前提条件是？', options: ['数据必须是有序的', '数据量必须很大', '数据类型必须是整数', '必须用链表存储'], correctAnswer: '数据必须是有序的', explanation: '二分查找要求数据必须是有序的。每次比较中间元素，将搜索范围缩小一半，时间复杂度 O(log n)。', difficulty: 2, knowledgePoint: '查找算法' },
    { type: 'multi-choice', question: '以下哪些是常用的数据结构？（多选）', options: ['数组', '链表', '栈', '队列', '编译器'], correctAnswer: '数组\n链表\n栈\n队列', explanation: '数组、链表、栈、队列都是基本数据结构。编译器是程序，不是数据结构。', difficulty: 1, knowledgePoint: '数据结构' },
    { type: 'fill', question: '哈希表的平均查找时间复杂度是 O(______)。', correctAnswer: '1', explanation: '哈希表（散列表）通过哈希函数直接计算位置，平均查找、插入、删除的时间复杂度都是 O(1)。', difficulty: 2, knowledgePoint: '数据结构' },
    { type: 'fill', question: '递归必须有 ______ 条件，否则会无限递归导致栈溢出。', correctAnswer: '终止', explanation: '递归必须有明确的终止条件（基线条件 base case），否则会一直递归下去，最终导致栈溢出。', difficulty: 2, knowledgePoint: '递归' },
    { type: 'short', question: '什么是动态规划（Dynamic Programming）？它的核心思想是什么？', correctAnswer: '动态规划是通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。核心思想：1. 将大问题拆解成子问题；2. 保存子问题的解（记忆化），避免重复计算；3. 从子问题的解逐步构建出原问题的解。常用于求最优解类问题，如最长公共子序列、背包问题等。', explanation: '动态规划的关键是找到状态转移方程，并用记忆化存储避免重复子问题的计算。', difficulty: 4, knowledgePoint: '动态规划' },
  ],
};

function findQuestionBankKey(skillName: string): string | null {
  if (BUILTIN_QUESTION_BANK[skillName]) return skillName;
  
  const lowerSkill = skillName.toLowerCase();
  for (const key of Object.keys(BUILTIN_QUESTION_BANK)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey === lowerSkill) return key;
    if (lowerSkill.includes(lowerKey) || lowerKey.includes(lowerSkill)) return key;
  }
  
  const aliases: Record<string, string> = {
    'js': 'JavaScript',
    'javascript': 'JavaScript',
    'py': 'Python',
    'python': 'Python',
    'ts': 'TypeScript',
    'typescript': 'TypeScript',
    'reactjs': 'React',
    'react.js': 'React',
    'vuejs': 'Vue',
    'vue.js': 'Vue',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'node.js': 'Node.js',
    'html': 'HTML/CSS',
    'css': 'HTML/CSS',
    'html5': 'HTML/CSS',
    'css3': 'HTML/CSS',
    'html/css': 'HTML/CSS',
    'mysql': 'MySQL',
    'sql': 'SQL',
    'git': 'Git',
    'docker': 'Docker',
    'linux': 'Linux',
    '算法与数据结构': '算法',
    '数据结构与算法': '算法',
    'algorithms': '算法',
    'algorithm': '算法',
  };
  
  for (const [alias, target] of Object.entries(aliases)) {
    if (lowerSkill === alias || lowerSkill.includes(alias)) {
      return target;
    }
  }
  
  return null;
}

function builtinGenerateQuiz(
  skillId: string,
  skillName: string,
  difficulty: number,
  count: number,
  skillCategory?: string,
): Quiz {
  const difficultyLevel = Math.min(5, Math.max(1, Math.round(difficulty))) as 1 | 2 | 3 | 4 | 5;
  let rawQuestions: RawQuestion[] = [];

  const bankKey = findQuestionBankKey(skillName);
  if (bankKey) {
    const bank = BUILTIN_QUESTION_BANK[bankKey];
    rawQuestions = bank.filter(
      (q) => Math.abs(q.difficulty - difficultyLevel) <= 1,
    );
    if (rawQuestions.length === 0) {
      rawQuestions = bank;
    }
    rawQuestions = shuffleArray([...rawQuestions]).slice(0, count);
  }

  const questions: QuizQuestion[] = rawQuestions.map((q) => ({
    id: generateId(),
    ...q,
    skillId,
    skillName,
  }));

  if (questions.length < count) {
    const filler = generateFillerQuestions(skillId, skillName, difficultyLevel, count - questions.length, skillCategory);
    questions.push(...filler);
  }

  return {
    id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    title: `${skillName} 能力测验`,
    skillId,
    skillName,
    difficulty: difficultyLevel,
    questionCount: questions.length,
    questions,
    createdAt: new Date().toISOString(),
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateFillerQuestions(
  skillId: string,
  skillName: string,
  difficulty: 1 | 2 | 3 | 4 | 5,
  count: number,
  skillCategory?: string,
): QuizQuestion[] {
  const result: QuizQuestion[] = [];
  const templates = getCategoryQuestions(skillName, skillCategory || '');

  const shuffled = shuffleArray([...templates]);
  for (let i = 0; i < count; i++) {
    const tpl = shuffled[i % shuffled.length]();
    result.push({
      id: generateId(),
      ...tpl,
      difficulty,
      skillId,
      skillName,
    });
  }

  return result;
}

function getCategoryQuestions(skillName: string, category: string): (() => RawQuestion)[] {
  const bank: Record<string, (() => RawQuestion)[]> = {
    '编程语言': [
      () => ({
        type: 'choice', question: `在${skillName}中，以下哪种说法关于变量作用域是正确的？`,
        options: ['局部变量只能在其定义的函数/块内访问', '局部变量在整个程序中都能访问', '全局变量只能在函数内访问', '变量作用域不影响程序运行'],
        correctAnswer: '局部变量只能在其定义的函数/块内访问', explanation: '作用域决定了变量的可访问范围。局部变量只在定义它的函数或代码块内有效，全局变量则在整个程序中都可访问。', difficulty: 1, knowledgePoint: '变量作用域',
      }),
      () => ({
        type: 'choice', question: `关于${skillName}中的函数，以下说法正确的是？`,
        options: ['函数可以提高代码复用性', '函数必须返回一个值', '函数不能接收参数', '函数只能定义在文件顶部'],
        correctAnswer: '函数可以提高代码复用性', explanation: '函数是组织代码的基本单位，可以将重复逻辑封装起来复用，提高代码可读性和可维护性。', difficulty: 1, knowledgePoint: '函数',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，以下哪种是正确的错误/异常处理思路？`,
        options: ['捕获可能出错的代码并进行处理', '忽略所有错误，程序自己会处理', '遇到错误直接终止程序', '用注释把错误代码注释掉'],
        correctAnswer: '捕获可能出错的代码并进行处理', explanation: '良好的异常处理是健壮程序的基础。应该捕获可能出错的代码，进行适当的处理或提示用户，而不是忽略或直接崩溃。', difficulty: 2, knowledgePoint: '异常处理',
      }),
      () => ({
        type: 'choice', question: `关于${skillName}中的数据类型，以下说法正确的是？`,
        options: ['基本类型和引用类型在内存中的存储方式不同', '所有数据类型都存储在栈中', '字符串和数字在内存中完全一样', '数据类型不影响程序行为'],
        correctAnswer: '基本类型和引用类型在内存中的存储方式不同', explanation: '基本类型（如数字、布尔）通常存储在栈中，按值传递；引用类型（如对象、数组）存储在堆中，按引用传递。理解这点对避免 bug 很重要。', difficulty: 2, knowledgePoint: '数据类型',
      }),
      () => ({
        type: 'choice', question: `在${skillName}中，循环结构的主要作用是？`,
        options: ['重复执行一段代码直到满足条件', '定义变量', '处理异常', '导入外部模块'],
        correctAnswer: '重复执行一段代码直到满足条件', explanation: '循环结构（for、while等）用于重复执行代码块，是编程中最基本的控制流之一。注意避免无限循环。', difficulty: 1, knowledgePoint: '控制流',
      }),
      () => ({
        type: 'multi-choice', question: `学习${skillName}时，以下哪些是编程的基本概念？（多选）`,
        options: ['变量和数据类型', '条件判断和循环', '函数和模块', '编译器和操作系统', '面向对象编程'],
        correctAnswer: '变量和数据类型\n条件判断和循环\n函数和模块\n面向对象编程', explanation: '变量、控制流、函数、OOP 是编程语言的核心概念。编译器和操作系统是独立的计算机系统知识。', difficulty: 1, knowledgePoint: '编程基础',
      }),
      () => ({
        type: 'fill', question: `在${skillName}中，用于存储数据的命名容器称为 ______。`,
        correctAnswer: '变量', explanation: '变量是编程语言中最基本的概念，用于在程序中存储和引用数据。', difficulty: 1, knowledgePoint: '变量',
      }),
      () => ({
        type: 'fill', question: `${skillName}中，接收输入参数并可被重复调用的代码块称为 ______。`,
        correctAnswer: '函数', explanation: '函数是一段可复用的代码块，可以接收参数、执行操作并返回结果。', difficulty: 1, knowledgePoint: '函数',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}中面向对象编程的三大特性。`,
        correctAnswer: '封装（Encapsulation）：将数据和操作数据的方法绑定在一起，隐藏内部实现细节；继承（Inheritance）：子类可以继承父类的属性和方法，实现代码复用；多态（Polymorphism）：同一接口的不同实现，不同对象对同一消息有不同响应。', explanation: '封装、继承、多态是面向对象编程的核心特性，理解它们有助于设计更好的程序结构。', difficulty: 3, knowledgePoint: '面向对象',
      }),
    ],

    '前端开发': [
      () => ({
        type: 'choice', question: `在前端开发中，${skillName}主要用于解决什么问题？`,
        options: ['构建用户界面和交互体验', '管理数据库', '配置服务器', '编写操作系统'],
        correctAnswer: '构建用户界面和交互体验', explanation: '前端技术的核心职责是构建用户可见的界面和交互体验，包括页面结构、样式和动态行为。', difficulty: 1, knowledgePoint: '前端基础',
      }),
      () => ({
        type: 'choice', question: `关于${skillName}中的组件化思想，以下说法正确的是？`,
        options: ['将界面拆分为独立可复用的组件', '把所有代码写在一个文件里', '组件之间不能互相通信', '组件化会增加代码量，不推荐使用'],
        correctAnswer: '将界面拆分为独立可复用的组件', explanation: '组件化是现代前端的核心思想，将复杂界面拆分为独立、可复用、可组合的组件，提高开发效率和可维护性。', difficulty: 2, knowledgePoint: '组件化',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，什么是状态管理？`,
        options: ['管理组件/应用中的数据及其变化', '管理CSS样式', '管理文件目录结构', '管理网络请求'],
        correctAnswer: '管理组件/应用中的数据及其变化', explanation: '状态管理是前端开发的核心概念，指管理应用中的数据（状态）以及数据变化时的更新机制。复杂应用通常需要专门的状态管理方案。', difficulty: 2, knowledgePoint: '状态管理',
      }),
      () => ({
        type: 'choice', question: `前端开发中，响应式布局的核心目标是？`,
        options: ['页面能自适应不同屏幕尺寸', '让页面加载更快', '让代码更简洁', '让动画更流畅'],
        correctAnswer: '页面能自适应不同屏幕尺寸', explanation: '响应式布局通过 CSS 媒体查询、弹性布局等技术，使页面在手机、平板、桌面等不同设备上都能良好展示。', difficulty: 1, knowledgePoint: '响应式设计',
      }),
      () => ({
        type: 'multi-choice', question: `使用${skillName}开发前端时，以下哪些是常见的优化手段？（多选）`,
        options: ['减少HTTP请求，合并资源文件', '使用懒加载/按需加载', '压缩CSS和JS文件', '把所有图片都转成Base64', '使用CDN加速静态资源'],
        correctAnswer: '减少HTTP请求，合并资源文件\n使用懒加载/按需加载\n压缩CSS和JS文件\n使用CDN加速静态资源', explanation: '前端性能优化手段包括减少请求、懒加载、压缩资源、CDN等。不是所有图片都适合转Base64（小图适合，大图反而增加体积）。', difficulty: 2, knowledgePoint: '性能优化',
      }),
      () => ({
        type: 'fill', question: `在前端开发中，HTML负责页面结构，CSS负责样式，______ 负责交互行为。`,
        correctAnswer: 'JavaScript', explanation: '前端三剑客：HTML（结构）、CSS（样式）、JavaScript（行为），三者分工协作构建完整的网页。', difficulty: 1, knowledgePoint: '前端基础',
      }),
      () => ({
        type: 'fill', question: `${skillName}开发中，浏览器渲染页面的过程叫 DOM树的构建和 ______。`,
        correctAnswer: '渲染', explanation: '浏览器将HTML解析为DOM树，CSS解析为CSSOM，两者合并为渲染树，最后布局和绘制到屏幕上。', difficulty: 2, knowledgePoint: '浏览器渲染',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}开发中，虚拟DOM（或类似概念）的作用和优势。`,
        correctAnswer: '虚拟DOM是用JavaScript对象描述真实DOM结构的轻量表示。当状态变化时，先在虚拟DOM上计算差异（diff），然后只更新真实DOM中需要变化的部分，减少直接DOM操作，提升性能。同时也使得跨平台渲染成为可能。', explanation: '虚拟DOM是现代前端框架的重要概念，理解它有助于写出更高效的代码。', difficulty: 3, knowledgePoint: '虚拟DOM',
      }),
    ],

    '后端开发': [
      () => ({
        type: 'choice', question: `在后端开发中，${skillName}主要负责什么？`,
        options: ['处理业务逻辑、数据存储和API服务', '设计网页样式', '管理用户浏览器', '制作动画效果'],
        correctAnswer: '处理业务逻辑、数据存储和API服务', explanation: '后端负责处理业务逻辑、数据持久化、身份认证、API接口等服务器端工作，是应用的核心。', difficulty: 1, knowledgePoint: '后端基础',
      }),
      () => ({
        type: 'choice', question: `关于RESTful API，以下说法正确的是？`,
        options: ['使用HTTP动词（GET/POST/PUT/DELETE）表示操作', '每个接口必须返回HTML', 'API必须有图形界面', 'RESTful只支持JSON格式'],
        correctAnswer: '使用HTTP动词（GET/POST/PUT/DELETE）表示操作', explanation: 'RESTful API 是一种API设计规范，使用HTTP动词表示操作类型，URL表示资源，是无状态、统一的接口风格。', difficulty: 2, knowledgePoint: 'API设计',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，中间件（Middleware）的作用是？`,
        options: ['在请求和响应之间插入处理逻辑', '管理数据库连接', '编译前端代码', '生成API文档'],
        correctAnswer: '在请求和响应之间插入处理逻辑', explanation: '中间件是一种管道模式，在请求到达业务逻辑之前或响应返回之前执行通用逻辑，如认证、日志、CORS等。', difficulty: 2, knowledgePoint: '中间件',
      }),
      () => ({
        type: 'choice', question: `后端开发中，MVC架构模式的M、V、C分别代表什么？`,
        options: ['Model-View-Controller（模型-视图-控制器）', 'Memory-Variable-Code', 'Main-Visual-CSS', 'Module-Version-Config'],
        correctAnswer: 'Model-View-Controller（模型-视图-控制器）', explanation: 'MVC是经典的软件架构模式：Model处理数据和业务逻辑，View负责展示，Controller处理用户输入和流程控制。', difficulty: 2, knowledgePoint: '架构模式',
      }),
      () => ({
        type: 'multi-choice', question: `使用${skillName}开发后端时，常见的安全措施包括？（多选）`,
        options: ['输入验证和参数过滤', '使用HTTPS加密传输', '密码哈希存储', '把数据库密码写在代码里', '实施身份认证和授权'],
        correctAnswer: '输入验证和参数过滤\n使用HTTPS加密传输\n密码哈希存储\n实施身份认证和授权', explanation: '后端安全至关重要：验证输入防注入、HTTPS防窃听、哈希存密码、认证授权防越权。绝不能把密码硬编码在代码中。', difficulty: 2, knowledgePoint: '安全实践',
      }),
      () => ({
        type: 'fill', question: `后端开发中，HTTP状态码 200 表示 ______，404 表示未找到资源。`,
        correctAnswer: '成功', explanation: 'HTTP状态码：2xx成功，3xx重定向，4xx客户端错误，5xx服务器错误。200是最常见的成功状态码。', difficulty: 1, knowledgePoint: 'HTTP协议',
      }),
      () => ({
        type: 'fill', question: `${skillName}开发中，客户端发请求到服务器，服务器处理后返回 ______。`,
        correctAnswer: '响应', explanation: 'HTTP是请求-响应模型：客户端发送请求（Request），服务器处理并返回响应（Response），包含状态码、头和体。', difficulty: 1, knowledgePoint: 'HTTP协议',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}中，同步和异步处理的区别，以及异步处理在后端开发中的意义。`,
        correctAnswer: '同步处理：代码按顺序执行，前一步完成才执行下一步，会阻塞等待。异步处理：不等待操作完成就继续执行，操作完成后通过回调/Promise等方式通知。在后端开发中，异步处理可以同时处理多个请求，避免I/O操作（如数据库查询、网络请求）阻塞线程，提高并发性能。', explanation: '异步编程是现代后端开发的重要能力，尤其在高并发场景下。', difficulty: 3, knowledgePoint: '异步编程',
      }),
    ],

    '数据库': [
      () => ({
        type: 'choice', question: `关于${skillName}，关系型数据库和非关系型数据库的主要区别是？`,
        options: ['关系型使用表格结构存储，非关系型使用文档/键值等灵活结构', '关系型更快', '非关系型只能存文本', '两者完全一样'],
        correctAnswer: '关系型使用表格结构存储，非关系型使用文档/键值等灵活结构', explanation: '关系型数据库（如MySQL）使用表格、行、列存储数据，支持SQL和事务。非关系型（如MongoDB、Redis）使用文档、键值等灵活结构，更易扩展。', difficulty: 2, knowledgePoint: '数据库分类',
      }),
      () => ({
        type: 'choice', question: `在${skillName}中，什么是索引（Index）？`,
        options: ['加速查询的数据结构', '一种数据备份方式', '数据库的版本号', '用于排序的工具'],
        correctAnswer: '加速查询的数据结构', explanation: '索引类似于书的目录，是一种加速查询的数据结构（通常是B+树）。合理使用索引可以大幅提升查询速度，但会占用存储空间并降低写入速度。', difficulty: 2, knowledgePoint: '索引',
      }),
      () => ({
        type: 'choice', question: `数据库事务的ACID特性中，"I"代表什么？`,
        options: ['Isolation（隔离性）', 'Integer（整数）', 'Index（索引）', 'Insert（插入）'],
        correctAnswer: 'Isolation（隔离性）', explanation: 'ACID：原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）、持久性（Durability）。隔离性指多个事务之间互不干扰。', difficulty: 2, knowledgePoint: '事务',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，主键（Primary Key）的作用是？`,
        options: ['唯一标识表中的每一行记录', '加密数据', '排序数据', '连接两个表'],
        correctAnswer: '唯一标识表中的每一行记录', explanation: '主键是表中唯一标识每条记录的字段，值不能重复且不能为空。它也是其他表外键关联的基础。', difficulty: 1, knowledgePoint: '主键',
      }),
      () => ({
        type: 'multi-choice', question: `在${skillName}中，以下哪些是数据库优化的常见手段？（多选）`,
        options: ['合理创建索引', '优化查询语句', '使用缓存', '把所有数据存在一个表里', '读写分离'],
        correctAnswer: '合理创建索引\n优化查询语句\n使用缓存\n读写分离', explanation: '数据库优化包括索引优化、SQL优化、缓存、读写分离、分库分表等。把所有数据存一个表会导致性能下降。', difficulty: 2, knowledgePoint: '性能优化',
      }),
      () => ({
        type: 'fill', question: `在${skillName}中，用于从表中检索数据的SQL关键字是 ______。`,
        correctAnswer: 'SELECT', explanation: 'SELECT 是最基本的数据查询语句，配合 FROM、WHERE、ORDER BY 等子句使用。', difficulty: 1, knowledgePoint: 'SQL基础',
      }),
      () => ({
        type: 'fill', question: `${skillName}中，表与表之间的关联通常通过 ______ 键实现。`,
        correctAnswer: '外', explanation: '外键（Foreign Key）用于建立表与表之间的关联关系，保证数据的参照完整性。', difficulty: 2, knowledgePoint: '外键',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}中数据库范式（Normalization）的作用，以及反范式设计的适用场景。`,
        correctAnswer: '数据库范式用于减少数据冗余、避免异常，常见的有第一到第三范式。但在读多写少、需要频繁JOIN的场景下，为了提升查询性能，可以适当反范式（增加冗余字段），以空间换时间。', explanation: '范式和反范式各有优劣，实际项目中需要根据场景权衡。', difficulty: 3, knowledgePoint: '数据库设计',
      }),
    ],

    '人工智能': [
      () => ({
        type: 'choice', question: `在${skillName}领域，训练集和测试集的作用分别是？`,
        options: ['训练集用于训练模型，测试集用于评估模型性能', '训练集用于测试，测试集用于训练', '两者完全一样', '只有训练集就够了'],
        correctAnswer: '训练集用于训练模型，测试集用于评估模型性能', explanation: '训练集用于让模型学习数据中的规律，测试集用于评估模型在未见过数据上的表现，防止过拟合。', difficulty: 1, knowledgePoint: '数据集划分',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，什么是过拟合（Overfitting）？`,
        options: ['模型在训练集上表现好但泛化能力差', '模型训练速度太慢', '模型参数太少', '数据集太大'],
        correctAnswer: '模型在训练集上表现好但泛化能力差', explanation: '过拟合指模型过度学习了训练数据中的噪声和细节，导致在新数据上表现不佳。解决方法包括正则化、Dropout、数据增强、早停等。', difficulty: 2, knowledgePoint: '过拟合',
      }),
      () => ({
        type: 'choice', question: `关于梯度下降法，以下说法正确的是？`,
        options: ['通过沿梯度反方向更新参数来最小化损失函数', '是一种数据预处理方法', '用于生成训练数据', '只适用于线性模型'],
        correctAnswer: '通过沿梯度反方向更新参数来最小化损失函数', explanation: '梯度下降是机器学习中最基本的优化算法，通过计算损失函数对参数的梯度，沿梯度反方向更新参数，逐步找到最优解。', difficulty: 3, knowledgePoint: '优化算法',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，损失函数（Loss Function）的作用是？`,
        options: ['衡量模型预测值与真实值之间的差异', '加速模型训练', '减少数据量', '美化数据可视化'],
        correctAnswer: '衡量模型预测值与真实值之间的差异', explanation: '损失函数衡量模型预测的准确程度，训练过程就是最小化损失函数的过程。常见的有MSE（回归）、交叉熵（分类）等。', difficulty: 2, knowledgePoint: '损失函数',
      }),
      () => ({
        type: 'multi-choice', question: `学习${skillName}需要掌握哪些基础知识？（多选）`,
        options: ['线性代数和微积分', '概率论与统计学', '编程能力（如Python）', '法律知识', '数据预处理技能'],
        correctAnswer: '线性代数和微积分\n概率论与统计学\n编程能力（如Python）\n数据预处理技能', explanation: 'AI需要数学基础（线代、概率、微积分）、编程能力和数据处理技能。法律知识虽然有用但不是AI的核心基础。', difficulty: 2, knowledgePoint: '基础知识',
      }),
      () => ({
        type: 'fill', question: `${skillName}中，将原始数据转换为模型可用的格式的过程称为数据 ______。`,
        correctAnswer: '预处理', explanation: '数据预处理包括清洗、归一化、特征提取、缺失值处理等，是机器学习流程中耗时但关键的步骤。', difficulty: 1, knowledgePoint: '数据预处理',
      }),
      () => ({
        type: 'fill', question: `在${skillName}中，模型的 ______ 是指其在未见过的新数据上的表现能力。`,
        correctAnswer: '泛化能力', explanation: '泛化能力是衡量模型好坏的关键指标，过拟合的模型泛化能力差。', difficulty: 2, knowledgePoint: '模型评估',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}中监督学习和无监督学习的区别，并各举一个例子。`,
        correctAnswer: '监督学习：使用带标签的数据训练模型，目标是学习输入到输出的映射。如分类（垃圾邮件检测）、回归（房价预测）。无监督学习：使用无标签数据，目标是发现数据中的结构或模式。如聚类（用户分群）、降维（PCA）。', explanation: '监督和无监督是机器学习的两大基本范式，理解它们的区别是AI入门的基础。', difficulty: 2, knowledgePoint: '学习范式',
      }),
    ],

    'DevOps': [
      () => ({
        type: 'choice', question: `${skillName}在DevOps中的作用是什么？`,
        options: ['实现开发运维自动化，提升交付效率', '设计用户界面', '编写业务逻辑', '管理数据库'],
        correctAnswer: '实现开发运维自动化，提升交付效率', explanation: 'DevOps的核心是开发和运维的协作与自动化，通过工具链实现持续集成、持续部署、自动化测试和监控。', difficulty: 1, knowledgePoint: 'DevOps理念',
      }),
      () => ({
        type: 'choice', question: `关于CI/CD（持续集成/持续部署），以下说法正确的是？`,
        options: ['自动构建、测试和部署代码，减少手动操作', '每次部署都需要手动操作', 'CI/CD只用于测试，不用于部署', 'CI/CD会降低代码质量'],
        correctAnswer: '自动构建、测试和部署代码，减少手动操作', explanation: 'CI/CD通过自动化流水线，在代码提交后自动构建、测试、部署，减少人为错误，加快交付速度。', difficulty: 2, knowledgePoint: 'CI/CD',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，基础设施即代码（IaC）的核心理念是？`,
        options: ['用代码定义和管理基础设施', '手动配置每台服务器', '基础设施不需要管理', '用图形界面配置'],
        correctAnswer: '用代码定义和管理基础设施', explanation: 'IaC用代码（如Terraform、Ansible）描述基础设施配置，实现版本控制、可复现、可审计的基础设施管理。', difficulty: 2, knowledgePoint: 'IaC',
      }),
      () => ({
        type: 'choice', question: `DevOps实践中，监控和告警的主要目的是？`,
        options: ['及时发现和响应系统问题', '让界面更好看', '替代开发人员工作', '增加服务器数量'],
        correctAnswer: '及时发现和响应系统问题', explanation: '监控实时收集系统指标（CPU、内存、响应时间等），告警在异常发生时通知运维人员，保障系统稳定性。', difficulty: 2, knowledgePoint: '监控运维',
      }),
      () => ({
        type: 'multi-choice', question: `使用${skillName}进行DevOps实践时，以下哪些是关键原则？（多选）`,
        options: ['自动化优先', '基础设施即代码', '持续监控和反馈', '手动配置所有服务器', '快速迭代和频繁部署'],
        correctAnswer: '自动化优先\n基础设施即代码\n持续监控和反馈\n快速迭代和频繁部署', explanation: 'DevOps强调自动化、IaC、持续反馈和快速迭代。手动配置是DevOps要消除的反模式。', difficulty: 2, knowledgePoint: 'DevOps原则',
      }),
      () => ({
        type: 'fill', question: `在${skillName}中，将应用程序及其依赖打包在一起的技术称为 ______ 化。`,
        correctAnswer: '容器', explanation: '容器化（如Docker）将应用和依赖打包成标准化单元，确保在不同环境中一致运行。', difficulty: 1, knowledgePoint: '容器化',
      }),
      () => ({
        type: 'fill', question: `DevOps中，代码从提交到部署的自动化流程称为 ______ 流水线。`,
        correctAnswer: 'CI/CD', explanation: 'CI/CD流水线自动执行构建、测试、部署流程，是DevOps的核心实践。', difficulty: 2, knowledgePoint: 'CI/CD',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}在DevOps实践中，蓝绿部署和滚动部署的区别。`,
        correctAnswer: '蓝绿部署：维护两套完整环境（蓝和绿），新版本部署到备用环境，验证通过后切换流量，可快速回滚但需要双倍资源。滚动部署：逐步替换旧版本实例为新版本，资源占用少但回滚较慢，适合无状态服务。', explanation: '部署策略的选择取决于应用特点、资源预算和回滚需求。', difficulty: 3, knowledgePoint: '部署策略',
      }),
    ],

    '数据分析': [
      () => ({
        type: 'choice', question: `在${skillName}中，数据分析的基本流程是？`,
        options: ['数据收集 → 清洗 → 分析 → 可视化 → 决策', '直接看数据就能得出结论', '只收集数据不需要分析', '先做可视化再收集数据'],
        correctAnswer: '数据收集 → 清洗 → 分析 → 可视化 → 决策', explanation: '数据分析的标准流程包括数据收集、清洗预处理、分析建模、可视化展示、辅助决策，每一步都不可省略。', difficulty: 1, knowledgePoint: '分析流程',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，数据清洗的主要目的是？`,
        options: ['处理缺失值、异常值和重复数据，提高数据质量', '让数据看起来更美观', '减少数据量以加快处理', '加密敏感数据'],
        correctAnswer: '处理缺失值、异常值和重复数据，提高数据质量', explanation: '脏数据会导致错误的分析结论。数据清洗包括处理缺失值、异常值、重复数据、格式统一等，是分析前必不可少的步骤。', difficulty: 2, knowledgePoint: '数据清洗',
      }),
      () => ({
        type: 'choice', question: `关于${skillName}中的数据可视化，以下说法正确的是？`,
        options: ['好的可视化能帮助发现数据中的规律和趋势', '可视化只是为了好看', '数据越多图表越复杂越好', '只有柱状图和饼图两种'],
        correctAnswer: '好的可视化能帮助发现数据中的规律和趋势', explanation: '数据可视化是将数据转化为直观图表的过程，帮助人们快速理解数据、发现规律、做出决策。选择合适的图表类型很关键。', difficulty: 1, knowledgePoint: '数据可视化',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，什么是描述性统计？`,
        options: ['用统计量描述数据的基本特征', '预测未来趋势', '只画图表不做计算', '一种编程语言'],
        correctAnswer: '用统计量描述数据的基本特征', explanation: '描述性统计用均值、中位数、方差、分位数等统计量描述数据的集中趋势、离散程度和分布形态，是数据分析的第一步。', difficulty: 2, knowledgePoint: '统计学基础',
      }),
      () => ({
        type: 'multi-choice', question: `使用${skillName}进行数据分析时，常见的分析维度包括？（多选）`,
        options: ['趋势分析', '对比分析', '结构分析', '凭感觉分析', '异常检测'],
        correctAnswer: '趋势分析\n对比分析\n结构分析\n异常检测', explanation: '常见分析维度包括趋势（时间变化）、对比（组间差异）、结构（占比分布）、异常（偏离正常）。凭感觉分析不是数据分析。', difficulty: 2, knowledgePoint: '分析方法',
      }),
      () => ({
        type: 'fill', question: `${skillName}中，用来衡量数据集中趋势的最常用统计量是 ______。`,
        correctAnswer: '平均值', explanation: '平均值（均值）是最常用的集中趋势度量，还有中位数和众数。中位数对异常值更鲁棒。', difficulty: 1, knowledgePoint: '统计学基础',
      }),
      () => ({
        type: 'fill', question: `数据分析中，偏离正常范围的数据值称为 ______ 值。`,
        correctAnswer: '异常', explanation: '异常值（Outlier）是明显偏离其他数据点的值，可能是数据错误，也可能是真实的有价值信息，需要仔细判断。', difficulty: 1, knowledgePoint: '数据清洗',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}中，相关性和因果关系的区别。`,
        correctAnswer: '相关性指两个变量之间存在统计上的关联关系（如同时增大或减小），但并不意味着一个导致了另一个。因果关系指一个变量的变化直接导致了另一个变量的变化（A导致B）。相关不等于因果，需要通过实验或更深入的分析来验证因果关系。', explanation: '混淆相关和因果是数据分析中的常见错误，理解两者的区别至关重要。', difficulty: 3, knowledgePoint: '统计思维',
      }),
    ],

    '移动开发': [
      () => ({
        type: 'choice', question: `${skillName}在移动开发中主要解决什么问题？`,
        options: ['构建移动应用的用户界面和功能', '管理后端数据库', '配置服务器', '编写操作系统'],
        correctAnswer: '构建移动应用的用户界面和功能', explanation: '移动开发技术负责构建手机应用，包括UI界面、交互逻辑、设备能力调用、网络通信等。', difficulty: 1, knowledgePoint: '移动开发基础',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，移动应用的生命周期管理主要关注什么？`,
        options: ['应用从启动到退出的各状态切换', '电池续航时间', '网络连接质量', '屏幕亮度'],
        correctAnswer: '应用从启动到退出的各状态切换', explanation: '移动应用有特定的生命周期（前台、后台、暂停、恢复、销毁等），需要在各个状态正确管理资源，避免内存泄漏和异常。', difficulty: 2, knowledgePoint: '生命周期',
      }),
      () => ({
        type: 'choice', question: `移动开发中，原生开发和跨平台开发的主要区别是？`,
        options: ['原生用平台语言开发性能最好，跨平台一套代码多端运行', '原生开发更快', '跨平台开发不需要写代码', '两者完全一样'],
        correctAnswer: '原生用平台语言开发性能最好，跨平台一套代码多端运行', explanation: '原生开发（如Swift/Kotlin）性能最佳但需各平台单独开发。跨平台（如Flutter/React Native）一套代码运行多平台，开发效率高但性能略低。', difficulty: 2, knowledgePoint: '开发模式',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，移动应用性能优化的重点是？`,
        options: ['减少内存使用、优化渲染、控制电量消耗', '增加更多功能', '使用更亮的颜色', '加大安装包体积'],
        correctAnswer: '减少内存使用、优化渲染、控制电量消耗', explanation: '移动设备资源有限，性能优化重点在内存管理、流畅渲染（60fps）、电量控制和网络优化。', difficulty: 2, knowledgePoint: '性能优化',
      }),
      () => ({
        type: 'multi-choice', question: `使用${skillName}进行移动开发时，以下哪些是常见考虑因素？（多选）`,
        options: ['不同屏幕尺寸适配', '网络状态变化处理', '本地数据存储', '电池和性能优化', '服务器CPU型号'],
        correctAnswer: '不同屏幕尺寸适配\n网络状态变化处理\n本地数据存储\n电池和性能优化', explanation: '移动开发需考虑屏幕适配、网络变化、本地存储、性能电量等。服务器CPU型号与移动端开发关系不大。', difficulty: 2, knowledgePoint: '移动开发要点',
      }),
      () => ({
        type: 'fill', question: `${skillName}中，应用在手机后台运行时，需要妥善管理 ______ 以避免泄漏。`,
        correctAnswer: '内存', explanation: '移动应用在后台时系统可能随时回收资源，需要正确保存状态和释放内存，避免内存泄漏导致崩溃。', difficulty: 2, knowledgePoint: '资源管理',
      }),
      () => ({
        type: 'fill', question: `移动开发中，一套代码同时支持iOS和Android的开发方式称为 ______ 平台开发。`,
        correctAnswer: '跨', explanation: '跨平台开发（如Flutter、React Native）可以用一套代码同时编译到iOS和Android，提高开发效率。', difficulty: 1, knowledgePoint: '跨平台开发',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}在移动开发中，热更新（Hot Update）的概念和优势。`,
        correctAnswer: '热更新指不通过应用商店审核，直接在应用内下载并加载新的代码或资源包来更新应用。优势：快速修复bug和发布功能，无需等待商店审核（通常需数天）；无需用户手动更新；可以灰度发布逐步验证。需注意安全性和平台政策限制。', explanation: '热更新是移动开发中提升迭代效率的重要手段，但需遵守各平台政策。', difficulty: 3, knowledgePoint: '热更新',
      }),
    ],

    '网络安全': [
      () => ({
        type: 'choice', question: `在${skillName}领域，OWASP Top 10 是什么？`,
        options: ['最常见的十大Web应用安全风险列表', '十种杀毒软件排名', '十个安全编程语言', '十种加密算法'],
        correctAnswer: '最常见的十大Web应用安全风险列表', explanation: 'OWASP Top 10是OWASP组织发布的Web应用最常见安全风险排行榜，包括注入、XSS、CSRF等，是Web安全的重要参考。', difficulty: 2, knowledgePoint: '安全标准',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，SQL注入攻击的原理是？`,
        options: ['通过在输入中插入恶意SQL语句来操作数据库', '物理攻击服务器', '删除数据库文件', '修改前端页面样式'],
        correctAnswer: '通过在输入中插入恶意SQL语句来操作数据库', explanation: 'SQL注入是将恶意SQL代码插入到用户输入中，使后端执行非预期的SQL命令。防御方法是使用参数化查询和输入验证。', difficulty: 2, knowledgePoint: 'Web安全',
      }),
      () => ({
        type: 'choice', question: `关于对称加密和非对称加密，以下说法正确的是？`,
        options: ['对称加密使用相同密钥加解密，非对称使用公钥加密私钥解密', '对称加密更安全', '非对称加密速度更快', '两者完全相同'],
        correctAnswer: '对称加密使用相同密钥加解密，非对称使用公钥加密私钥解密', explanation: '对称加密（如AES）速度快但密钥管理难；非对称加密（如RSA）安全性高但速度慢，常用于密钥交换和数字签名。', difficulty: 2, knowledgePoint: '加密技术',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，XSS（跨站脚本攻击）的防御手段是？`,
        options: ['对用户输入进行过滤和转义', '使用更复杂的密码', '关闭服务器', '增加防火墙'],
        correctAnswer: '对用户输入进行过滤和转义', explanation: 'XSS是攻击者注入恶意脚本到网页中。防御方法包括输入验证、输出编码转义、设置CSP（内容安全策略）、使用HttpOnly Cookie。', difficulty: 2, knowledgePoint: 'Web安全',
      }),
      () => ({
        type: 'multi-choice', question: `${skillName}领域中，常见的安全认证方式有哪些？（多选）`,
        options: ['用户名密码认证', '双因素认证（2FA）', '生物特征认证', '123456默认密码', 'OAuth令牌认证'],
        correctAnswer: '用户名密码认证\n双因素认证（2FA）\n生物特征认证\nOAuth令牌认证', explanation: '认证方式从简单到复杂包括密码、2FA、生物识别、OAuth等。使用默认弱密码是最不安全的做法。', difficulty: 2, knowledgePoint: '身份认证',
      }),
      () => ({
        type: 'fill', question: `${skillName}中，通过伪装成可信来源来骗取用户敏感信息的攻击方式称为 ______ 攻击。`,
        correctAnswer: '钓鱼', explanation: '钓鱼攻击（Phishing）通过伪装成可信的网站或邮件，诱导用户泄露账号密码等敏感信息。', difficulty: 1, knowledgePoint: '社会工程学',
      }),
      () => ({
        type: 'fill', question: `在${skillName}中，______ 测试是模拟攻击来发现系统安全漏洞的方法。`,
        correctAnswer: '渗透', explanation: '渗透测试（Penetration Testing）是在授权条件下模拟真实攻击，发现并利用系统漏洞，帮助组织提升安全水平。', difficulty: 2, knowledgePoint: '安全测试',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}中，纵深防御（Defense in Depth）的概念及其重要性。`,
        correctAnswer: '纵深防御是指不依赖单一安全措施，而是部署多层防御机制，即使一层被突破其他层仍能提供保护。包括：网络层（防火墙）、应用层（输入验证、WAF）、数据层（加密）、物理层、人员安全意识等。重要性：没有任何单一安全措施是完美的，多层防御可以提高攻击者的成本和难度，降低被攻破的风险。', explanation: '纵深防御是安全领域的基本原则，安全是一个体系而非单一措施。', difficulty: 3, knowledgePoint: '安全原则',
      }),
    ],

    '计算机基础': [
      () => ({
        type: 'choice', question: `在${skillName}中，时间复杂度O(n²)表示什么？`,
        options: ['算法运行时间与输入规模的平方成正比', '算法运行时间是输入规模的2倍', '算法需要2n步完成', '算法非常高效'],
        correctAnswer: '算法运行时间与输入规模的平方成正比', explanation: '大O表示法描述算法在最坏情况下的时间增长趋势。O(n²)意味着输入翻倍时，运行时间变为原来的4倍。', difficulty: 2, knowledgePoint: '复杂度分析',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，数组（Array）和链表（Linked List）的主要区别是？`,
        options: ['数组内存连续支持随机访问，链表内存不连续但插入删除快', '数组更快', '链表只能存数字', '两者完全一样'],
        correctAnswer: '数组内存连续支持随机访问，链表内存不连续但插入删除快', explanation: '数组内存连续，O(1)随机访问但插入删除O(n)。链表通过指针连接，插入删除O(1)但访问O(n)。选择取决于使用场景。', difficulty: 2, knowledgePoint: '数据结构',
      }),
      () => ({
        type: 'choice', question: `关于TCP和UDP协议，以下说法正确的是？`,
        options: ['TCP面向连接可靠传输，UDP无连接不保证可靠', 'TCP更快', 'UDP更安全', '两者完全相同'],
        correctAnswer: 'TCP面向连接可靠传输，UDP无连接不保证可靠', explanation: 'TCP通过三次握手建立连接，保证数据有序可靠到达。UDP无连接，速度快但不保证可靠性，适合实时音视频等场景。', difficulty: 2, knowledgePoint: '网络协议',
      }),
      () => ({
        type: 'choice', question: `${skillName}中，进程和线程的主要区别是？`,
        options: ['进程是资源分配单位，线程是CPU调度单位，一个进程可包含多个线程', '进程比线程大所以更快', '线程是虚拟的', '进程和线程完全一样'],
        correctAnswer: '进程是资源分配单位，线程是CPU调度单位，一个进程可包含多个线程', explanation: '进程有独立内存空间，创建开销大但隔离性好。线程共享进程内存，创建开销小但需要同步。', difficulty: 2, knowledgePoint: '操作系统',
      }),
      () => ({
        type: 'multi-choice', question: `${skillName}中，以下哪些是基本的数据结构？（多选）`,
        options: ['数组', '链表', '栈和队列', '编译器', '哈希表'],
        correctAnswer: '数组\n链表\n栈和队列\n哈希表', explanation: '数组、链表、栈、队列、哈希表、树、图都是基本数据结构。编译器是程序，不是数据结构。', difficulty: 1, knowledgePoint: '数据结构',
      }),
      () => ({
        type: 'fill', question: `${skillName}中，算法的 ______ 复杂度描述其运行时间随输入规模的增长趋势。`,
        correctAnswer: '时间', explanation: '时间复杂度描述运行时间增长趋势，空间复杂度描述内存占用增长趋势。', difficulty: 1, knowledgePoint: '复杂度分析',
      }),
      () => ({
        type: 'fill', question: `在${skillName}中，后进先出（LIFO）的数据结构称为 ______。`,
        correctAnswer: '栈', explanation: '栈是后进先出（Last In First Out）的数据结构。队列是先进先出（FIFO）。', difficulty: 1, knowledgePoint: '数据结构',
      }),
      () => ({
        type: 'short', question: `请简述${skillName}中，递归算法的特点和使用时需要注意的问题。`,
        correctAnswer: '递归是函数调用自身来解决问题的方法，特点是代码简洁、思路清晰，适合分治、树遍历等问题。注意问题：1. 必须有明确的终止条件（base case），否则会栈溢出；2. 每层递归的参数必须向终止条件收敛；3. 递归深度过大可能导致栈溢出，可用尾递归优化或改为迭代；4. 递归可能有重复计算，可用记忆化优化。', explanation: '递归是计算机科学的重要概念，理解递归对学习算法和数据结构至关重要。', difficulty: 3, knowledgePoint: '递归',
      }),
    ],
  };

  return bank[category] || bank['计算机基础'];
}

// ============ AI 智能出题 ============

const QUIZ_GENERATE_SYSTEM_PROMPT = `你是一名专业的出题老师，擅长根据指定技能和难度生成高质量的测验题目。

请严格按照以下 JSON 格式输出题目，不要输出任何其他文字：
{
  "title": "测验标题",
  "questions": [
    {
      "type": "choice",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": "正确答案（选择题填选项完整文本）",
      "explanation": "详细解析，说明为什么正确以及错误选项的问题",
      "difficulty": 3,
      "knowledgePoint": "知识点名称"
    }
  ]
}

题型说明：
- choice: 单选题，必须有4个选项，correctAnswer 填正确选项的完整文本
- multi-choice: 多选题，必须有5个选项，correctAnswer 每行一个正确选项
- fill: 填空题，correctAnswer 填写正确答案
- short: 简答题，correctAnswer 填写参考答案要点
- coding: 编程题，correctAnswer 填写参考代码或解题思路

要求：
1. 题目难度要与指定等级匹配
2. 题目要有实际应用价值
3. 解析要详细，能帮助用户理解
4. 知识点分布要均匀
5. 所有输出必须是合法的 JSON 格式`;

export async function generateQuiz(
  skillId: string,
  skillName: string,
  difficulty: number,
  count: number,
  aiConfig: AiProviderConfig,
  projectContext?: string,
  skillCategory?: string,
): Promise<Quiz> {
  if (!aiConfig.enabled || aiConfig.provider === 'builtin') {
    return builtinGenerateQuiz(skillId, skillName, difficulty, count, skillCategory);
  }

  try {
    const prompt = `请为技能"${skillName}"（类别：${skillCategory || '通用'}）生成一份测验，难度等级 ${difficulty}/5，共 ${count} 道题。

题型分布：
- 单选题：${Math.ceil(count * 0.4)} 道
- 多选题：${Math.floor(count * 0.2)} 道
- 填空题：${Math.floor(count * 0.2)} 道
- 简答题：${Math.max(1, count - Math.ceil(count * 0.4) - Math.floor(count * 0.2) - Math.floor(count * 0.2))} 道

${projectContext ? `项目背景：${projectContext}\n题目请结合该项目的实际需求。` : ''}

要求：题目必须和 ${skillName} 的具体知识点直接相关，不要出泛泛的学习方法题。

请输出严格的 JSON 格式。`;

    const response = await generateWithAi(prompt, aiConfig, QUIZ_GENERATE_SYSTEM_PROMPT);
    const parsed = parseQuizJson(response, skillId, skillName, difficulty);
    return parsed;
  } catch (err) {
    console.warn('AI出题失败，使用内置题库:', err);
    return builtinGenerateQuiz(skillId, skillName, difficulty, count, skillCategory);
  }
}

function parseQuizJson(jsonStr: string, skillId: string, skillName: string, difficulty: number): Quiz {
  let clean = jsonStr.trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) clean = jsonMatch[0];

  try {
    const data = JSON.parse(clean);
    const questions: QuizQuestion[] = (data.questions || []).map((q: any, idx: number) => ({
      id: generateId(),
      type: q.type || 'choice',
      question: q.question || '',
      options: q.options,
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      difficulty: (q.difficulty || Math.min(5, Math.max(1, Math.round(difficulty)))) as 1 | 2 | 3 | 4 | 5,
      knowledgePoint: q.knowledgePoint || '综合',
      skillId,
      skillName,
    }));

    return {
      id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title: data.title || `${skillName} 能力测验`,
      skillId,
      skillName,
      difficulty: Math.min(5, Math.max(1, Math.round(difficulty))) as 1 | 2 | 3 | 4 | 5,
      questionCount: questions.length,
      questions,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('解析 AI 出题结果失败:', err);
    return builtinGenerateQuiz(skillId, skillName, difficulty, 5);
  }
}

// ============ AI 批改 ============

const GRADE_SYSTEM_PROMPT = `你是一名严格公正的阅卷老师，请对用户的答题进行评分和解析。

请严格按照以下 JSON 格式输出结果，不要输出任何其他文字：
{
  "score": 85,
  "maxScore": 100,
  "answers": [
    {
      "questionId": "题目ID",
      "isCorrect": true,
      "score": 10,
      "maxScore": 10,
      "aiFeedback": "详细的反馈和解析"
    }
  ],
  "overallFeedback": "整体评价和改进建议",
  "weakPoints": ["薄弱知识点1", "薄弱知识点2"],
  "strongPoints": ["掌握较好的知识点1"]
}

评分标准：
- 选择题：完全正确得满分，错误得0分
- 多选题：全对得满分，部分对得一半分，错选得0分
- 填空题：意思对即可得分
- 简答题：按要点给分，观点清晰、举例恰当得高分
- 编程题：按功能完整性、代码质量给分

要求：
1. 评分要客观公正
2. 反馈要具体，指出问题所在
3. 解析要清晰，帮助用户理解
4. 薄弱点和优势点分析要准确`;

export async function gradeQuiz(
  quiz: Quiz,
  userAnswers: Record<string, string>,
  aiConfig: AiProviderConfig,
): Promise<QuizResult> {
  const answers: UserAnswer[] = quiz.questions.map((q) => {
    const userAns = userAnswers[q.id] || '';
    return {
      questionId: q.id,
      answer: userAns,
    };
  });

  if (!aiConfig.enabled || aiConfig.provider === 'builtin') {
    return builtinGradeQuiz(quiz, answers);
  }

  try {
    const prompt = JSON.stringify({
      quizTitle: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        knowledgePoint: q.knowledgePoint,
        userAnswer: userAnswers[q.id] || '',
      })),
    });

    const response = await generateWithAi(prompt, aiConfig, GRADE_SYSTEM_PROMPT);
    const result = parseGradeJson(response, quiz, answers);
    return result;
  } catch (err) {
    console.warn('AI批改失败，使用内置批改:', err);
    return builtinGradeQuiz(quiz, answers);
  }
}

function builtinGradeQuiz(quiz: Quiz, answers: UserAnswer[]): QuizResult {
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;

  const graded = answers.map((ua) => {
    const question = quiz.questions.find((q) => q.id === ua.questionId);
    if (!question) return { ...ua, isCorrect: false, score: 0, aiFeedback: '题目不存在' };

    const baseScore = 100 / quiz.questionCount;
    maxScore += baseScore;

    let isCorrect = false;
    let score = 0;
    let feedback = '';

    const userAns = ua.answer.trim().toLowerCase();
    const correctAns = question.correctAnswer.trim().toLowerCase();

    if (question.type === 'choice') {
      isCorrect = userAns === correctAns || !!(question.options?.some(
        (opt) => opt.toLowerCase() === userAns && opt === question.correctAnswer
      ));
      score = isCorrect ? baseScore : 0;
      feedback = isCorrect
        ? `回答正确！${question.explanation}`
        : `回答错误。正确答案是：${question.correctAnswer}。${question.explanation}`;
    } else if (question.type === 'multi-choice') {
      const userOptions = userAns.split(/[\n,，;；]/).map((s) => s.trim()).filter(Boolean);
      const correctOptions = correctAns.split(/[\n,，;；]/).map((s) => s.trim()).filter(Boolean);
      const correctCount = userOptions.filter((o) => correctOptions.includes(o)).length;
      const wrongCount = userOptions.filter((o) => !correctOptions.includes(o)).length;
      if (wrongCount === 0 && correctCount === correctOptions.length) {
        isCorrect = true;
        score = baseScore;
      } else if (wrongCount === 0 && correctCount > 0) {
        score = (baseScore * correctCount) / correctOptions.length * 0.8;
      }
      feedback = isCorrect
        ? `全部正确！${question.explanation}`
        : `部分正确或错误。正确答案有 ${correctOptions.length} 项。${question.explanation}`;
    } else if (question.type === 'fill') {
      isCorrect = userAns === correctAns ||
        correctAns.includes(userAns) ||
        (userAns.length > 0 && correctAns.includes(userAns.slice(0, Math.min(5, userAns.length))));
      score = isCorrect ? baseScore : 0;
      feedback = isCorrect
        ? `回答正确！${question.explanation}`
        : `答案不准确。参考答案：${question.correctAnswer}。${question.explanation}`;
    } else {
      const keywords = question.correctAnswer.split(/[，。,.;；\s]+/).filter((s) => s.length >= 2);
      const matchCount = keywords.filter((k) => userAns.includes(k.toLowerCase())).length;
      const matchRate = keywords.length > 0 ? matchCount / keywords.length : 0;
      isCorrect = matchRate >= 0.6;
      score = baseScore * Math.min(1, matchRate);
      feedback = matchRate >= 0.8
        ? `回答很好！要点基本覆盖。${question.explanation}`
        : matchRate >= 0.5
          ? `回答尚可，但不够全面。${question.explanation}`
          : `回答需要加强。参考要点：${question.correctAnswer}。${question.explanation}`;
    }

    if (isCorrect) correctCount++;

    return {
      ...ua,
      isCorrect,
      score: Math.round(score * 10) / 10,
      aiFeedback: feedback,
    };
  });

  totalScore = Math.round(graded.reduce((sum, a) => sum + (a.score || 0), 0) * 10) / 10;
  maxScore = Math.round(maxScore * 10) / 10;

  const weakPoints = graded
    .filter((a) => !a.isCorrect)
    .map((a) => quiz.questions.find((q) => q.id === a.questionId)?.knowledgePoint)
    .filter(Boolean) as string[];

  const strongPoints = graded
    .filter((a) => a.isCorrect)
    .map((a) => quiz.questions.find((q) => q.id === a.questionId)?.knowledgePoint)
    .filter(Boolean) as string[];

  return {
    quizId: quiz.id,
    answers: graded,
    totalScore,
    maxScore,
    correctCount,
    totalCount: quiz.questionCount,
    timeSpent: 0,
    completedAt: new Date().toISOString(),
    weakPoints: [...new Set(weakPoints)].slice(0, 5),
    strongPoints: [...new Set(strongPoints)].slice(0, 5),
    aiTeaching: generateBuiltinTeaching(totalScore, maxScore, weakPoints, strongPoints, quiz.skillName),
  };
}

function parseGradeJson(jsonStr: string, quiz: Quiz, answers: UserAnswer[]): QuizResult {
  let clean = jsonStr.trim();
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) clean = jsonMatch[0];

  try {
    const data = JSON.parse(clean);
    const gradedAnswers = answers.map((ua) => {
      const aiAnswer = (data.answers || []).find((a: any) => a.questionId === ua.questionId);
      return {
        ...ua,
        isCorrect: aiAnswer?.isCorrect ?? false,
        score: aiAnswer?.score ?? 0,
        aiFeedback: aiAnswer?.aiFeedback || '',
      };
    });

    const totalScore = Math.round((data.score || 0) * 10) / 10;
    const maxScore = data.maxScore || 100;

    return {
      quizId: quiz.id,
      answers: gradedAnswers,
      totalScore,
      maxScore,
      correctCount: gradedAnswers.filter((a) => a.isCorrect).length,
      totalCount: quiz.questionCount,
      timeSpent: 0,
      completedAt: new Date().toISOString(),
      weakPoints: data.weakPoints || [],
      strongPoints: data.strongPoints || [],
      aiTeaching: data.overallFeedback || '',
    };
  } catch (err) {
    console.error('解析 AI 批改结果失败:', err);
    return builtinGradeQuiz(quiz, answers);
  }
}

// ============ AI 教学辅导 ============

function generateBuiltinTeaching(
  score: number,
  maxScore: number,
  weakPoints: string[],
  strongPoints: string[],
  skillName: string,
): string {
  const rate = maxScore > 0 ? score / maxScore : 0;
  const percent = Math.round(rate * 100);

  let level = '';
  let advice = '';

  if (rate >= 0.9) {
    level = '优秀';
    advice = `你对${skillName}的掌握非常扎实！建议继续挑战更高难度的内容，可以尝试复杂的实战项目来进一步提升。`;
  } else if (rate >= 0.75) {
    level = '良好';
    advice = `整体掌握不错，但还有提升空间。建议重点复习薄弱知识点，通过更多练习来巩固。`;
  } else if (rate >= 0.6) {
    level = '及格';
    advice = `基础还需要加强。建议系统地回顾一下${skillName}的核心概念，多做练习题。`;
  } else {
    level = '需要努力';
    advice = `目前基础还比较薄弱，建议从基础概念开始重新学习，一步一个脚印地打牢基础。`;
  }

  let weakPointAdvice = '';
  if (weakPoints.length > 0) {
    weakPointAdvice = `\n\n需要重点加强的知识点：\n${weakPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
  }

  let strongPointMention = '';
  if (strongPoints.length > 0) {
    strongPointMention = `\n\n掌握较好的知识点：${strongPoints.join('、')}`;
  }

  return `成绩：${percent}%（${level}）\n\n${advice}${weakPointAdvice}${strongPointMention}\n\n学习建议：\n1. 针对错题进行复盘，理解每个错误的原因\n2. 结合项目实践加深理解\n3. 定期复习，避免遗忘\n4. 可以挑战更高难度的测验来检验提升效果`;
}

const TEACHING_SYSTEM_PROMPT = `你是一名耐心的AI学习导师，根据用户的测验结果提供个性化的学习建议和辅导。

请从以下几个方面给出建议：
1. 整体评价（鼓励为主）
2. 薄弱知识点分析（具体、可操作）
3. 掌握较好的方面（肯定成绩）
4. 下一步学习计划（分阶段、可执行）
5. 推荐的学习资源和方法

语气要亲切、鼓励，避免打击用户积极性。建议要具体、可操作，避免空泛。`;

export async function aiTeach(
  quiz: Quiz,
  result: QuizResult,
  userContext: UserContext,
  aiConfig: AiProviderConfig,
): Promise<string> {
  if (!aiConfig.enabled || aiConfig.provider === 'builtin') {
    return result.aiTeaching || generateBuiltinTeaching(result.totalScore, result.maxScore, result.weakPoints || [], result.strongPoints || [], quiz.skillName);
  }

  try {
    const prompt = `用户技能水平：${JSON.stringify({
      skillName: quiz.skillName,
      score: result.totalScore,
      maxScore: result.maxScore,
      correctRate: `${result.correctCount}/${result.totalCount}`,
      weakPoints: result.weakPoints,
      strongPoints: result.strongPoints,
      wrongAnswers: result.answers
        .filter((a) => !a.isCorrect)
        .map((a) => {
          const q = quiz.questions.find((qq) => qq.id === a.questionId);
          return {
            question: q?.question,
            userAnswer: a.answer,
            feedback: a.aiFeedback,
            knowledgePoint: q?.knowledgePoint,
          };
        }),
    })}

用户整体学习情况：
- 学习总时长：${Math.round(userContext.stats.totalStudyTime / 60)} 分钟
- 完成任务数：${userContext.stats.completedTasks}
- 连续学习天数：${userContext.stats.streakDays} 天

请给出个性化的学习辅导建议。`;

    const response = await generateWithAi(prompt, aiConfig, TEACHING_SYSTEM_PROMPT);
    return response;
  } catch (err) {
    console.warn('AI教学失败，使用内置教学:', err);
    return result.aiTeaching || generateBuiltinTeaching(result.totalScore, result.maxScore, result.weakPoints || [], result.strongPoints || [], quiz.skillName);
  }
}
