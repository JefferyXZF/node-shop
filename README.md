# 启动项目步骤

#### 第一步：克隆项目
git clone https://github.com/JefferyXZF/node-shop.git

#### 第二步：安装依赖
进入项目目录node-shop，执行：npm install 安装依赖

#### 第三步：安装数据库软件
使用mongoDB数据库，具体安装过程可以参照网上教程。
管理数据库，可以借助一个可视化软件叫“Studio 3T”，下载路径：https://studio3t.com/，对第四步的导入数据库很方便。

软件界面截图：

![1558447219686](/images/1558447219686.png)

#### 第四步：导入数据库
数据库文件在db目录下

- 新建数据库：xzfmall
- 将db目录下的json数据库文件导入（如果安装studio 3T软件，直接右键，选择“Import Collections"导入，选择json格式导入，一直下一步就完成了）

#### 第五步：启动项目
执行命令:
```
npm run start
```