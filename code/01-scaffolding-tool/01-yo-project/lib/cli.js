#!/usr/bin/env node
'use strict';
const meow = require('meow');
const 01YoProject = require('./');

const cli = meow(`
Usage
  $ 01-yo-project [input]

Options
  --foo  Lorem ipsum. [Default: false]

Examples
  $ 01-yo-project
  unicorns
  $ 01-yo-project rainbows
  unicorns & rainbows
`);
