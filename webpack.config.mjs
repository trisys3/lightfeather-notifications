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

import webpack from 'webpack';
import chalk from 'chalk';

const {red} = chalk;

export default config;

if(file === process.argv[1]) {
  build();
}

async function build(watch) {
  let info;
  try {
    info = await new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        const info = stats.toJson();
        err ??= info.errors;

        if(err) {
          return reject(err);
        }

        return resolve(info);
      });
    });
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

  if(info.warnings) {
    console.warn(info.warnings);
  }

  console.log(info);
}
