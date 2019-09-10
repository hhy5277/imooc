## 命令行方式创建项目：
>mvn archetype:generate -DinteractiveMode=false -DgroupId=com.imooc -DartifactId=first-app-by-maven -Dversion=1.0.0-SNAPSHOT

Error occurred during initialization of VM java/lang/NoClassDefFoundError: java/lang/Object 可以看出是没有找到基础类库，

解决方案：

查看一下tools.jar及rt.jar 果然没有，果断重新解包出来，

这个错误的原因是没有找到tools.jar及rt.jar;

tools.jar是关于一些工具的类库

rt.jar包含了jdk的基础类库，也就是你在java doc里面看到的所有的类的class文件

解包方法，jdk每个版本unpack 位置不一样， 例如：

D:\Program Files\Java\jdk1.8.0_131\bin 下面有个unpack200 这个是1.8版本的，
D:\Program Files\Java\jdk1.8.0_131\jre\bin 下面也有个unpack200
当要解压tools.pack及rt.pack的时候，这样解压

报EOF reading band，重新安装JDK后解决
cd D:\Program Files\Java\jdk1.8.0_131\jre\lib 
..\bin\unpack200 -r -v  rt.pack rt.jar

cd D:\Program Files\Java\jdk1.8.0_131\lib  
../bin/unpack200 -r -v tools.pack tools.jar

测试一下 java-version 搞定


Windows
To unpack one .pack file (for example rt.pack), run:

"%JAVA_HOME%\bin\unpack200" -r -v rt.pack rt.jar
To recursively unpack all .pack files, from the JRE root run:

for /r %f in (*.pack) do "%JAVA_HOME%\bin\unpack200.exe" -r -q "%f" "%~pf%~nf.jar"


*nix
To unpack one .pack file (for example rt.pack), run:

/usr/bin/unpack200 -r -v rt.pack rt.jar
To recursively unpack all .pack files, from the JRE root run:

find -iname "*.pack" -exec sh -c "/usr/bin/unpack200 -r -q {} \$(echo {} | sed 's/\(.*\.\)pack/\1jar/')" \;


## 控制台请求路径日志打印


1、问题描述
我将我的 SpringBoot 版本由 2.0.5.RELEASE 升级到 2.1.3，发现在项目启动的时候，控制台不打印 API 了。
应该不是日志级别而是配置的问题，我尝试调整过日志级别，发现并没有卵用（其实是有用的，只不过样式变了，一开始没发觉）。
将版本再切换回 2.0.5.RELEASE, 就能正常打印 API 了。

2、解决方法
配置文件中更改 org.springframework.web 包的日志级别：

logging:
  level:
    org.springframework.web: TRACE
启动程序时将会在控制条打印出如下信息：

2019-03-04 02:20:47.554 TRACE 13549 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : 
    c.s.q.c.AccountBookController:
    {POST /accountBook/addAccountBook}: addAccountBook(AccountBookDTO,BindingResult,String)
    {GET /accountBook/overview}: overview(String)
    {GET /accountBook/loanDetail/{id}}: loanDetail(int)
    {POST /accountBook/repayment/{id}}: repayment(int)
2019-03-04 02:20:47.561 TRACE 13549 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : 
    c.s.q.c.PortalMessageController:
    {GET /message/xxx}: xxx()
    {GET /message/xxx}: xxx(String)
	
	
## Spring boot	配置文件

Spring boot 中通过profile属性指定配置文件

https://blog.csdn.net/yu0_zhang0/article/details/83784367	

配置文件详解

https://www.cnblogs.com/jtlgb/p/8532280.html