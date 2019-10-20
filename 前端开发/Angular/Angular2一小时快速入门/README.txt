项目地址：https://github.com/lizhonghui/angular2-demo

[Angular2入门](https://www.jianshu.com/p/c8d7885e2761?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)

AngularJS2 是一款开源的JavaScript MV*（MVC、MVW、MVVM）框架，目前由Google维护。

MVVM模式是Model-View-ViewMode（模型-视图-视图模型）模式的简称。MVVM模式利用框架内置的双向绑定技术对MVP（Model-View-Presenter）模式的变型，引入了专门的ViewModel（视图模型）来实现View和Model的粘合，让View和Model的进一步分离和解耦。MVW（Whatever）

## Angualr2新特性
- 移除了controller+scope设计，改用组件式开发（更容易开发）
- 性能更好（渲染更快，变化检测效率更高）
- 优先为移动应用设计
- 更加贴合未来的标准（如ES6/7、WebComponent）

## [Web Components 是什么？](https://www.cnblogs.com/linzhenjie/p/5486520.html)
Web Components是W3C定义的新标准，它给了前端开发者扩展浏览器标签的能力，可以自由的定制组件，更好的进行模块化开发，彻底解放了前端开发者的生产力。

## Web Components 架构
Web Components在 W3C 规范中的发展有几个模块：

- 模板元素
- Html Import
- Shadow DOM
- 自定义元素
- 装饰器

目前前四个模块足以支撑 Web Component，装饰器还没有一个完整的规范。

## Angular2的核心

![Angular2的核心](angular-core.png)

由上图可以看到，用户直接交互的是模板，也就是可见可交互的视图界面，它是组成组件的要素之一。组件是用来维护数据模型和功能逻辑的，它包括模板和组件类。路由控制组件的创建和销毁，从而完成界面的跳转。指令与模板相互关联，它最重要的功能是增强了模板的功能，也是对模板的一种语法拓展。服务是与逻辑功能相关的单元，它通过依赖注入的方式引入到组件内部，为组件类服务。

与用户直接交换的是模板，模板接收来自用户的操作，通过数据绑定与对应的组件内进行交换，组件内处理完后更新模板视图，来返回给用户，组件处于核心地位，指令是模板的扩展，服务是组件的扩展。

## 组件
Angular框架基于组件设计，组价是最小的执行单元。组件类似于HTML页面抽出的公共元素，但并不限于这些。一个应用程序是由这些组件组成的，他们之间有一定的关系。通过Angular的命令穿件的组件包括四个文件：HTML、CSS、Spec.ts、Component.ts。HTML和CSS文件用来展示模板视图；Component.ts是组件类，用来完成功能逻辑的；Spec.ts是放测试代码的。

 

import { Component, OnInit } from '@angular/core';
 
@Component({     //组件装饰器
  selector: 'app-preview-paper',   //别的组件使用该组件的标签名，也是该组件的唯一标识
  templateUrl: './preview-paper.component.html',   //模板对应的文件，也可以使用template标签，后面用反单引号括起来HTML代码，效果是一样的
  styleUrls: ['./preview-paper.component.css']     //CSS样式，修饰模板文件，可以引入多个css文件
}) 
export class PreviewPaperComponent implements OnInit {   //组件类的声明
 
  constructor() { }   //构造器
 
  ngOnInit() {   //该组件一初始化时要执行的内容
  }
  
}

declarations： 用于声明该模块下的组件、指令或管道，只有在声明之后才能使用。

exports： 用于导出该模块下的组件、指令或管道，通过导出，这些组件、指令或管道将能在其他模块中使用。(服务不需要exports)

imports： 用于导入其他模块，当模块引用其他模块之后，便可以通过引入模块的方式来使用被引用模块中的组件、指令和管道。

providers： 用于向该模块中注入服务，服务在注入该模块后，便可在该模块中使用。组件内使用时需要传入入到构造器。

bootstrap： 根模块的根组件 ，作为根模块的入口，只有根模块才有根组件。


1. 模块间分享组件
NgModule通过declares来申明了一些组件（component）和类组件（如directive和pipe，下文统称为组件）是隶属于自己模块的，而且这些组件和类组件必须且仅仅只能属于一个NgModule

当你要用到其他NgModule的组件，就需要import其他的模块了。但是这里注意，import的模块不是所有的组件都是可以使用的，import模块必须明确表明了它的哪些组件是可以外用的，这由exports数组来定义。

2. 模块间分享服务
在NgModule的元数据中还有一个属性叫providers，这个属性里一般是声明了一些service。一般情况下我们是希望这些service在模块内的组件中共享的，Angular确实也是如此设计的，因为providers中申明的services都是单例模式的。
但是如果我们要用到其他模块的服务，是否也是像模块间共享组件一样，通过import把模块引入进来就可以呢？确实如此。

在Angular的设计思想里，组件是私有化的，服务是公有化的。

当外来模块被import进来后，它的服务就被共享到你的模块中了。

每个NgModule都有injector，里面存放着通过providers声明过的service。如果通过imports导入了外来模块，那么外来模块的服务就都注入到了你所在模块的injectors中。


3. 懒加载下的服务共享
如果你的app中应用到了懒加载，那么情况就会更加复杂了。因为懒加载模块是在特定的情况下app需要用到的时候才会被加载进来，所以一般情况下懒加载模块下的serivce不会被imports到主模块中的，也就不会注入到root injector的，而是在root injector下重新开辟了一个child injector。如果你在主模块和懒加载模块都provide了同样的service，那么就会在两个模块中分别拥有不同的实例。而这往往是开发者不想看到的，因为服务的作用就是共享数据，而此时不知不觉有两个实例存在，每个实例单独维护一份数据，那么就会造成逻辑上的错误，更可怕的是，很多开发者并不知道这一点。所以记得在懒加载模块中不要注入跟主模块相同的服务，用主模块中的就好了。但是有时候你因为要用到某些特殊指令，又不得不导入相同的模块，比如路由模块，在主模块和懒加载模块甚至是一些特征模块中都需要导入，这个时候，就需要在主模块中用到forRoot了。那么forRoot到底起到一个什么作用呢？其实他们只是一个Angular模块中约定俗成的写法，主要是它们有一个返回类型ModuleWithProviders，其实就是想把module和providers给区分开来，它的意思就是告诉导入模块可以共享被导入模块中的组件（被exports出的组件），但是服务注入一次就好了，以后要是再有同样的服务需要注入就忽略之，不要创建两个不同实例的服务。（导入懒加载模块并调用forRoot静态方法来提供我们的服务：SharedModule.forRoot()）


4. 服务在组件中私有化
在Angular的@Component里也有个providers，但是如果你在组件级别注入了service，那么这个service就只能在该组件和它的子组件中使用了，别的组件即使在同一个模块中也不能使用这个service。

@Injectable 装饰器会指出这些服务或其它类是用来注入的。它还能用于为这些服务提供配置项。

provides依赖注入除了可以作用在组件，也可以作用在模块上，注入到模块内的服务可以在应用全局或某个NgModule范围内使用，注入到组件的服务只能在该组件以及其子组件上使用。

服务在每个注入器的范围内是单例的。 在任何一个注入器中，最多只会有同一个服务的一个实例。

Angular DI 是一个 多级注入系统，这意味着各级注入器都可以创建它们自己的服务实例。

使用NgModel双向数据绑定时，需要导入FormModule模块

使用@Directive自定义指令时，需要导入 ElementRef和Renderer模块

[] 属性绑定
() 事件绑定
[()] 双向绑定

父子通讯

父传子通过属性
子传父通过事件

@Input  子组件传入参数
@Output EventEmitter类型的子组件传出参数
