## 广场模块（无服务端）

### 使用node app.js启动服务端，然后访问提示的端口即可

### 功能简介

展示所有用户发布的内容，可以点赞、评论，查看该用户的所有动态，可以让用户之间相互监督鼓励、成为更好的自己！

* 利用localStorage作为数据库
* 广场页等宽瀑布流展示数据，对图片资源懒加载，滚动到底部加载更多
* 广场页发布内容并更新数据库和页面，将新发布内容作为第一条展示
* 点击用户名查询该用户所有动态并跳转到个人发布页展示
* 点击评论按钮查询该内容的所有评论并跳转到详情页
* 详情页发布评论并更新数据库和页面，将新发布内容作为第一条展示
* 点赞按钮实现点赞（未数据更新）
* 移动端和PC端响应式布局

#### 广场页

将每个用户发表的内容以瀑布流的方式呈现（背景可以做成动画，根据时间变化）；页面包含内容编辑发布；每条内容（点击可跳转到内容详情页）包含图片、用户头像和昵称（点击可跳转到个人主页）、点赞数、评论数；

#### 内容详情页

主要是对评论功能细化包含评论具体内容和发表评论功能

#### 个人主页

显示该用户所有已发布的内容

### 程序结构

主要集中于前端，包含html、css、js

#### js

主要包含各个页面的js文件，负责接收请求、查找数据、动态往页面上渲染节点。

主要包含以下文件：

* js文件夹：
  * square.js ：负责广场页发送请求
  * userPost.js ：负责用户动态页发送请求
  * detailContent.js：负责详情页发送请求
  * animation.js：负责动画效果
  * topBar.js ：负责导航栏效果
  * dataShow.js ：负责处理请求、查找数据、生成节点
  * masonryLayout.js ：负责渲染节点

#### css

主要用于设置静态节点的样式以及响应式样式

主要包含以下文件：

* css文件夹：
  * square.css ：负责设定广场页样式
  * userPost.css ：负责设定用户动态页样式
  * detailContent.css：负责设定详情页样式
  * animation.css：负责设定动画样式
  * topBar.css ：负责设定导航栏样式

#### html(view)

主要用于展示通过js获取的数据

* html(view)文件夹：
  * square.html ：广场页
  * userPost.html ：用户动态页
  * detailContent.html：详情页

#### 其他

主要包含以下文件：

* assets文件夹：资源文件
