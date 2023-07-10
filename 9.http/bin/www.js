#! /usr/bin/env node

import { program } from "commander";
import Server from "../src/index.js";

const commands = {
  port: {
    option: "-p, --port <port>",
    default: 3000,
    description: "启动的端口号",
    usage: "xz-server --port 3000",
  },
  directory: {
    option: "-d, --directory <dirname>",
    default: process.cwd(),
    description: "设置服务器的启动目录",
    usage: "xz-server --directory /usr/xxx",
  },
};

const usages = [];

Object.entries(commands).forEach(([_, opt]) => {
  program.option(opt.option, opt.description, opt.default);
  usages.push(opt.usage);
});

program.on("--help", function () {
  console.log("Examples:");
  usages.map((item) => console.log(' ' + item));
});

program.parse(process.argv);
console.log(program.opts())

new Server(program.opts()).start();
