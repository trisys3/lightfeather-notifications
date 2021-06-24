#! /usr/bin/env node

const {url: fileUrl} = import.meta;

const {pathname: file} = new URL(fileUrl);

const config = {
  mode: 'development',
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
  build();
}

async function build(watch) {
  let info;
  try {
    info = await new Promise((resolve, reject) =>
      webpack(config, (err, stats) => {
        const info = stats.toJson();

        if(info.errors?.length) {
          err ??= info.errors;
        }

        if(err) {
          return reject(err);
        }

        return resolve(info);
    }));
  } catch(errors) {
    if(!Array.isArray(errors)) {
      if(errors) {
        errors = [errors];
      } else {
        errors = [];
      }
    }

    for(const err of errors) {
      console.error(red(err.stack ?? err));
      if(err.details) {
        console.error(red(err.details));
      }
    }

    return;
  }

  const {warnings, hash, time, outputPath: outputAbs} = info;

  const outputPath = relative(process.cwd(), outputAbs);

  if(info.warnings?.length) {
    console.warn(yellow(info.warnings));
  }

  const seconds = (time / 1000).toFixed(1);

  console.log(`Bundle ${magenta(hash)} built to ${green(`${outputPath}/`)} in ${cyan(seconds)} seconds`);
}
