(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{591:function(s,a,t){"use strict";t.r(a);var e=t(8),_=Object(e.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h3",{attrs:{id:"_1-字符集"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-字符集"}},[s._v("#")]),s._v(" 1. 字符集")]),s._v(" "),t("h4",{attrs:{id:"_1-1-出错场景"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-出错场景"}},[s._v("#")]),s._v(" 1.1 出错场景")]),s._v(" "),t("p",[t("code",[s._v("MySQL5.7")]),s._v("中默认字符集是"),t("code",[s._v("latin1")])]),s._v(" "),t("p",[s._v("查看字符集的命令")]),s._v(" "),t("div",{staticClass:"language-sql extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sql"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SHOW")]),s._v(" VARIABLES "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("LIKE")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'character_%'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("p",[s._v("比如下述插入就会出现字符集的问题")]),s._v(" "),t("div",{staticClass:"language-sql extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sql"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("create")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("DATABASE")]),s._v(" dbtest1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("use")]),s._v(" dbtest1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("create")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("table")]),s._v(" student "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("\n    name "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("VARCHAR")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("15")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    age "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("INSERT")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("INTO")]),s._v(" student "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("value")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'小明'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("18")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\t"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# [HY000][1366] Incorrect string value: '\\xE5\\xB0\\x8F\\xE6\\x98\\x8E' for column 'name' at row 1")]),s._v("\n")])])]),t("h4",{attrs:{id:"_1-2-问题解决"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-问题解决"}},[s._v("#")]),s._v(" 1.2 问题解决")]),s._v(" "),t("p",[t("code",[s._v("windows")]),s._v("下修改"),t("code",[s._v("my.ini")]),s._v("文件，在"),t("code",[s._v("Linux")]),s._v("下是"),t("code",[s._v("my.cnf")]),s._v("文件")]),s._v(" "),t("div",{staticClass:"language-ini extra-class"},[t("pre",{pre:!0,attrs:{class:"language-ini"}},[t("code",[t("span",{pre:!0,attrs:{class:"token selector"}},[s._v("[mysql]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("default-character-set")]),t("span",{pre:!0,attrs:{class:"token attr-value"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v("utf8")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token selector"}},[s._v("[mysqld]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("character-set-server")]),t("span",{pre:!0,attrs:{class:"token attr-value"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v("utf8")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("collation-server")]),t("span",{pre:!0,attrs:{class:"token attr-value"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("=")]),s._v("utf8_general_ci")]),s._v("\n")])])]),t("p",[s._v("修改完成之后，重启"),t("code",[s._v("mysql")]),s._v("，会发现仍然不生效，这是因为我们的修改对于已经创建的数据库是不起作用的，可以新创建一个数据库，这个新建的数据库默认就是"),t("code",[s._v("utf8")]),s._v("编码了，并且可以插入中文")]),s._v(" "),t("h3",{attrs:{id:"_2-图形化工具"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-图形化工具"}},[s._v("#")]),s._v(" 2. 图形化工具")]),s._v(" "),t("p",[t("a",{attrs:{href:"https://www.navicat.com.cn/download/navicat-premium",target:"_blank",rel:"noopener noreferrer"}},[s._v("Navicat"),t("OutboundLink")],1)]),s._v(" "),t("p",[t("a",{attrs:{href:"https://github.com/dbeaver/dbeaver",target:"_blank",rel:"noopener noreferrer"}},[s._v("Dbeaver"),t("OutboundLink")],1),s._v("(推荐使用)")]),s._v(" "),t("h3",{attrs:{id:"_3-忘记密码"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-忘记密码"}},[s._v("#")]),s._v(" 3. 忘记密码")]),s._v(" "),t("ol",[t("li",[t("p",[s._v("通过任务管理器或者服务管理，关掉"),t("code",[s._v("mysqld")]),s._v("(服务进程)")])]),s._v(" "),t("li",[t("p",[s._v("通过命令行+特殊参数开启"),t("code",[s._v("mysqld")])]),s._v(" "),t("div",{staticClass:"language-shell extra-class"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("mysqld --defaults-file"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"xx/my.ini"')]),s._v(" --skip-grant-tables\n")])])])]),s._v(" "),t("li",[t("p",[s._v("此时，"),t("code",[s._v("mysqld")]),s._v("服务进程已经打开，并且不需要权限检查")])]),s._v(" "),t("li",[t("p",[t("code",[s._v("mysql -uroot")]),s._v("无密码登陆服务器，另启动一个客户端进行")])]),s._v(" "),t("li",[t("p",[s._v("修改权限表")]),s._v(" "),t("div",{staticClass:"language-sql extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sql"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("USE")]),s._v(" mysql"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("UPDATE")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("user")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("SET")]),s._v(" anthentication_string"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("password"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'新密码'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("WHERE")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("user")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'root'")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("AND")]),s._v(" Host"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'localhost'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\nFLUSH "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("privileges")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])])]),s._v(" "),t("li",[t("p",[s._v("通过任务管理器，关掉"),t("code",[s._v("mysqld")]),s._v("服务进程")])]),s._v(" "),t("li",[t("p",[s._v("再次通过服务管理，打开"),t("code",[s._v("mysql")]),s._v("服务，可以使用修改后的新密码登陆")])])]),s._v(" "),t("h3",{attrs:{id:"_4-sql分类"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-sql分类"}},[s._v("#")]),s._v(" 4. SQL分类")]),s._v(" "),t("p",[t("code",[s._v("SQL")]),s._v("语言从功能上主要分为如下三大类")]),s._v(" "),t("ol",[t("li",[t("code",[s._v("DDL(Data Definition Languages)")]),s._v("数据定义语言，这些语句定义了不同的数据库、表、视图、索引等数据库对象，还可以用来创建、删除、修改和数据表的结构\n"),t("ul",[t("li",[s._v("主要的语句关键字包括"),t("code",[s._v("CREATE")]),s._v("、"),t("code",[s._v("DROP")]),s._v("、"),t("code",[s._v("ALTER")]),s._v("、"),t("code",[s._v("RENAME")]),s._v("、"),t("code",[s._v("TRUNCATE")]),s._v("等")])])]),s._v(" "),t("li",[t("code",[s._v("DML(Data Manipulation Languages)")]),s._v("数据操作语言，用于添加、删除、更新和查询数据库记录，并检查数据u完整性\n"),t("ul",[t("li",[s._v("主要的语句关键字包括"),t("code",[s._v("INSERT")]),s._v("、"),t("code",[s._v("DELECT")]),s._v("、"),t("code",[s._v("UPDATE")]),s._v("、"),t("code",[s._v("SELECT")]),s._v("等")]),s._v(" "),t("li",[t("code",[s._v("SELECT")]),s._v("是"),t("code",[s._v("SQL")]),s._v("语言的基础，最为重要")])])]),s._v(" "),t("li",[t("code",[s._v("DCL(Data Control Languages)")]),s._v("数据控制语言，用于定义数据库、表、字段、用户的访问权限和安全级别\n"),t("ul",[t("li",[s._v("主要语句关键字包括"),t("code",[s._v("GRANT")]),s._v("、"),t("code",[s._v("REVOKE")]),s._v("、"),t("code",[s._v("COMMIT")]),s._v("、"),t("code",[s._v("ROLLBACK")]),s._v("、"),t("code",[s._v("SAVEPOINT")]),s._v("等")])])])]),s._v(" "),t("h3",{attrs:{id:"_5-规则与规范"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-规则与规范"}},[s._v("#")]),s._v(" 5. 规则与规范")]),s._v(" "),t("h4",{attrs:{id:"_5-1-基本规则"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-1-基本规则"}},[s._v("#")]),s._v(" 5.1 基本规则")]),s._v(" "),t("ul",[t("li",[t("code",[s._v("SQL")]),s._v("可以写在一行或者多行。为了提高可读性，各子句分行写，必要时使用缩进")]),s._v(" "),t("li",[s._v("每条命令以"),t("code",[s._v(";")]),s._v("或"),t("code",[s._v("\\g")]),s._v("或"),t("code",[s._v("\\G")]),s._v("结束")]),s._v(" "),t("li",[s._v("关键字不能被缩写也不能分行")]),s._v(" "),t("li",[s._v("关于标点符号\n"),t("ul",[t("li",[s._v("必须保证所有的"),t("code",[s._v("()")]),s._v("、"),t("code",[s._v("''")]),s._v("、"),t("code",[s._v('""')]),s._v("是成对出现的")]),s._v(" "),t("li",[s._v("必须使用英文状态下的半角输入方式")]),s._v(" "),t("li",[s._v("字符串和日期时间类型的数据可以使用单引号"),t("code",[s._v("''")]),s._v("来表示")]),s._v(" "),t("li",[s._v("列的别名，尽量使用双引号"),t("code",[s._v('""')]),s._v("，而且不建议省略"),t("code",[s._v("as")])])])])]),s._v(" "),t("h4",{attrs:{id:"_5-2-大小写规范"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-2-大小写规范"}},[s._v("#")]),s._v(" 5.2 大小写规范")]),s._v(" "),t("ul",[t("li",[t("code",[s._v("MySQL")]),s._v("在"),t("code",[s._v("windows")]),s._v("环境下是大小写不敏感的")]),s._v(" "),t("li",[t("code",[s._v("MySQL")]),s._v("在"),t("code",[s._v("Linux")]),s._v("环境下是大小写敏感的\n"),t("ul",[t("li",[s._v("数据库名、表名、表的别名、变量名是严格区分大小写的")]),s._v(" "),t("li",[s._v("关键字、函数名、列名(或字段名)、列的别名(字段的别名)是忽略大小写的")])])]),s._v(" "),t("li",[s._v("推荐采用统一的书写规范\n"),t("ul",[t("li",[s._v("数据库名、表名、表别名、字段名、字段别名等都小写")]),s._v(" "),t("li",[t("code",[s._v("SQL")]),s._v("关键字、函数名、绑定变量等都大写")])])])]),s._v(" "),t("h4",{attrs:{id:"_5-3-注释"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-3-注释"}},[s._v("#")]),s._v(" 5.3 注释")]),s._v(" "),t("ol",[t("li",[t("p",[s._v("第一种方式："),t("code",[s._v("MySQL")]),s._v("专属")]),s._v(" "),t("div",{staticClass:"language-sql extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sql"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 这是一条注释")]),s._v("\n")])])])]),s._v(" "),t("li",[t("p",[s._v("第二种方式：多行注释")]),s._v(" "),t("div",{staticClass:"language-sql extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sql"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/*\n\t这是一条多行注释\n*/")]),s._v("\n")])])])]),s._v(" "),t("li",[t("p",[s._v("标准格式")]),s._v(" "),t("div",{staticClass:"language-sql extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sql"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("-- 注意'--'后需要有空格")]),s._v("\n")])])])])]),s._v(" "),t("h4",{attrs:{id:"_5-4-命名规则"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-4-命名规则"}},[s._v("#")]),s._v(" 5.4 命名规则")]),s._v(" "),t("ul",[t("li",[s._v("数据库、表名不得超过30个字符，变量名限制为29个")]),s._v(" "),t("li",[s._v("必须只能包含"),t("code",[s._v("A-Z")]),s._v("、"),t("code",[s._v("a-z")]),s._v("、"),t("code",[s._v("0-9")]),s._v("、"),t("code",[s._v("_")]),s._v("共63个字符")]),s._v(" "),t("li",[s._v("数据库名、表名、字段名等对象名中间不要包含空格")]),s._v(" "),t("li",[s._v("同一个"),t("code",[s._v("MySQL")]),s._v("软件中，数据库不能同名;同一个库中，表不能给重名；同一张表中，字段不能重名")]),s._v(" "),t("li",[s._v("必须保证你的字段没有和保留字、数据库系统或常用方法冲突。如果坚持使用，请在"),t("code",[s._v("SQL")]),s._v("语句中使用`(着重号)引起来")]),s._v(" "),t("li",[s._v("保持字段名和类型的一致性，在命名字段并为其指定数据类型的时候一定要保持一致性。假如数据类型在一个表里是整型，另一张表中此字段也必须是整型")])]),s._v(" "),t("h3",{attrs:{id:"_6-导入数据库"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_6-导入数据库"}},[s._v("#")]),s._v(" 6. 导入数据库")]),s._v(" "),t("ol",[t("li",[t("p",[s._v("使用命令导入(在命令行中)")]),s._v(" "),t("div",{staticClass:"language-sql extra-class"},[t("pre",{pre:!0,attrs:{class:"language-sql"}},[t("code",[s._v("source 文件全路径名\n")])])])]),s._v(" "),t("li",[t("p",[s._v("图形化工具导入")])])])])}),[],!1,null,null,null);a.default=_.exports}}]);