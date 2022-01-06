react-native-aspect-image
=========================

**A React Native Image that keeps the source aspect ratio**

The `AspectImage` React Component is an `Image` that keeps the source aspect
ratio if one of its dimensions is unset.

Please note that one of its dimensions must be set, either explicitly by
`width`, `height`, or `flexBasis`, or implicitly by a positive `flexGrow`, an
`alignSelf: 'stretch'` or an `alignItens: 'stretch'` in the parent, otherwise
the image will be 0x0.


Install
-------

With npm:

```
npm install @hashiprobr/react-use-mount-and-update @hashiprobr/react-native-aspect-image
```

With yarn:

```
yarn add @hashiprobr/react-use-mount-and-update @hashiprobr/react-native-aspect-image
```

If using Expo, add the module to `webpack.config.js`:

``` js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync({
        ...env,
        babel: {
            dangerouslyAddModulePathsToTranspile: [
                '@hashiprobr/react-native-aspect-image',
            ]
        },
    }, argv);
    return config;
};
```

If `webpack.config.js` does not exist, create it with:

```
expo customize:web
```


Props
-----

| name        | description                                                                            |
|-------------|----------------------------------------------------------------------------------------|
| placeholder | the component shown while the source aspect ratio is being calculated (default `null`) |

[...Image props](https://reactnative.dev/docs/image#props)


Example
-------

``` js
import { Text } from 'react-native';

import AspectImage from '@hashiprobr/react-native-aspect-image';

export default function MyComponent() {
    return (
        <AspectImage
            style={{ flexGrow: 1 }}
            source={require('path/to/an/asset')}
            placeholder={<Text>loading</Text>}
        />
    );
}
```
