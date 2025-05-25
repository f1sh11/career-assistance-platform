## 💡 开发启动指南

本项目使用了 Yarn Workspaces，因此请确保你已经安装了 Yarn：

```bash
npm install -g yarn

yarn install
即可自动安装主项目和 mbti-personality-test-app-main 的所有依赖。

npm run dev --workspace=mbti-personality-test-app-main
单独运行mbti

普通运行：
yarn dev 
yarn server
yarn dev:mbti