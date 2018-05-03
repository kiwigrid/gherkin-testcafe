#!/usr/bin/env node

"use strict";

const main = require("./src/runner");
const { argv } = require("./src/args").help();

main(argv);
