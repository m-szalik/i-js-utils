# i-js-utils


[![Build Status](https://travis-ci.org/m-szalik/i-js-utils.svg?branch=master)](https://travis-ci.org/m-szalik/i-js-utils)
[![npm version](https://badge.fury.io/js/i-js-utils.svg)](https://badge.fury.io/js/i-js-utils)
[![codecov](https://codecov.io/gh/m-szalik/i-js-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/m-szalik/i-js-utils)


`import {isEmptyObject, isNotBlank, setObjProperty, getObjProperty, isValidNIP, isValidREGON, isValidEmail, devOnly} from 'i-react-utils';`

`bool isEmptyObject(object)` - true if object has no it's own properties

`bool isNotBlank(string)` - true if string is not blank

`void setObjProperty(obj, propertyPath, value)` - set object property for `propertyPath` equal to `a.b` result is `{a:{b:value}}`

`object getObjProperty(obj, propertyPath)` - get property value. See description for `setObjProperty(obj, propertyPath, value)`

`void devOnly(callback)` - execute `callback` only when running in development mode

`bool isValidNIP(string)`

`bool isValidREGON(string)`

`bool isValidEmail(string)`

`object strToObject(str, propSplit, valueSplit)`

`string objectToStr(obj, propJoin, valueJoin)`
