安装Angular CLI

npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm install -g @angular/cli

步骤一：

ng new my-app
cd my-app
ng serve

步骤二：

ng new my-app --skip-install
cd my-app
cnpm install
ng serve


npm install -g @angualr/cli

ng help

ng version

ng new my-app

ng new demo01 -d (--dry-run)

ng new demo01 -si (--skip install) --routing

npm install

ng serve

ng serve --port 4201

ng g component test

ng g service test -m app.module(服务不会自动注册，手动注册到APPModule)

ng test

ng build --aot

ng build -prod

du -h dist/

ls -alh dist/

