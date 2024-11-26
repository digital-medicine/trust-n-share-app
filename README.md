# Building and running
TODO

### Important note regarding react-native-healthkit
The index.js of the package must be edited:

```js
const NativeModules = require('react-native').NativeModules
export const HealthKit = Object.assign({}, AppleHealthKit, {
  isAvailable: NativeModules.AppleHealthKit.isAvailable,
  initHealthKit: NativeModules.AppleHealthKit.initHealthKit,
  getStepCount: NativeModules.AppleHealthKit.getStepCount,

  Constants: {
    Activities,
    Observers,
    Permissions,
    Units,
  },
})
```

This can be disregarded when [this PR](https://github.com/agencyenterprise/react-native-health/pull/396) is merged.
