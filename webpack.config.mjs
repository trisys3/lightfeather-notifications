#! /usr/bin/env node

const {url: fileUrl} = import.meta;

const {pathname: file} = new URL(fileUrl);

const watching = process.argv.includes('-w') || process.argv.includes('--watch');

const config = {
  mode: 'development',
  watch: watching,
  entry: {app: './app.js'},
  output: {filename: 'app.js'},
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: '/node_modules/',
      use: {
        loader: 'babel-loader',
        options: {cacheDirectory: '.cache/babel/'},
      },
    }],
  },
};

import {relative} from 'path';
import webpack from 'webpack';
import chalk from 'chalk';

const {red, magenta, cyan, green, yellow} = chalk;

export default config;

if(file === process.argv[1]) {
  webpack(config, callback);
}

function callback(err, stats) {
  const {warnings, hash, time, outputPath: outputAbs, errors} = stats.toJson();
  err ??= errors;

  const outputPath = relative(process.cwd(), outputAbs);

  if(errors?.length) {
    for(const err of errors) {
      console.error(red(err.stack ?? err));
      if(err.details) {
        console.error(red(err.details));
      }
    }

    return;
  }

  if(warnings?.length) {
    for(const warning of warnings) {
      console.warn(yellow(warnings));
    }
  }

  const seconds = (time / 1000).toFixed(1);

  console.log(`Bundle ${magenta(hash)} built to ${green(`${outputPath}/`)} in ${cyan(seconds)} seconds`);
}
