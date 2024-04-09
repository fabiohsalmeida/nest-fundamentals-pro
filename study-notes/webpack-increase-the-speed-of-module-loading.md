# Increase the module loading speed
We are going to use webpack

## Configure Webpack

```js
// create file at root namaed webpack-hmr.config.js
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function(options, webpack) {
    return {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100']
            })
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin({
                paths: [/\.js$/,/\.d\.ts$/]
            }),
            new RunScriptWebpackPlugin({
                name: options.output.filename,
                autoRestart: false
            })
        ]
    }
}
```

## Fix main.js

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//here
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));
//and here
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
//end
}
bootstrap();
```

## Include the script into package.json

```js
{//inside of scripts, here it changes the start:dev script
    "start:dev": "nest build --webpack --webpackPath webpack-hmr.config.js --watch"
}
```