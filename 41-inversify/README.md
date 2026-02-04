# InversifyJS

用于学习 InversifyJS 框架

- [几种依赖注入的使用场景 - InversifyJS为例](https://juejin.cn/post/7599581204860813338?searchId=20260129174702994EF29E1F1017E6583C)
- [依赖注入的艺术：编写可扩展 JavaScript 代码的秘密](https://juejin.cn/post/7333421776459923465?searchId=20260127102011C9D7CD7EB5885DF2B803#heading-0)

# 为什么需要 InversifyJS

- 解耦：InversifyJS 可以帮助你将应用程序的不同组件解耦，使它们之间的依赖关系更加清晰。
- 可测试性：由于依赖关系被注入到类中，你可以轻松地替换这些依赖项，从而使你的代码更易于测试。
- 可维护性：InversifyJS 可以帮助你组织和管理你的代码，使它更易于维护。

基于依赖倒置原则，分离接口、实现。并通过container统一管理类的实例化与生命周期过程。

container 可以简单理解为一个map，存储 key 与 实例的对应关系。

container.get 代理了各个类的实例化过程，所以只要在container上注册的时候修改一下对应的类，就可以快速实现功能的切换
