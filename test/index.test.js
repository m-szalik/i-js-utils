import assert from 'assert';
import {isNotBlank,isEmptyObject,setObjProperty,getObjProperty, isValidNIP, isValidREGON, isValidEmail, shallowCopy, shallowCopyExcept, isEquivalent, devOnly, objectToStr, strToObject} from '../src/index';


describe('function isNotBlank', () => {
    test("isNotBlank empty string", () => {
        assert(isNotBlank("") === false, 'Wrong result for empty string');
    });
    test("isNotBlank white string", () => {
        assert(isNotBlank("  ") === false, 'Wrong result for white string');
    });
    test("isNotBlank null or undefined", () => {
        assert(isNotBlank(null) === false, 'Wrong result for null');
        assert(isNotBlank(undefined) === false, 'Wrong result for undefined');
    });
    test("isNotBlank text", () => {
        assert(isNotBlank('text'), 'Wrong result for "text"');
    });
    test("isNotBlank object", () => {
        assert(isNotBlank({}), 'Wrong result for object');
    });
});

describe('function isEmptyObject', () => {
    test("isEmptyObject for null / undefined", () => {
        assert(isEmptyObject(null), 'Wrong result for null');
        assert(isEmptyObject(undefined), 'Wrong result for undefined');
    });
    test("isEmptyObject for {}", () => {
        assert(isEmptyObject({}), 'Wrong result for {}');
    });
    test("isEmptyObject for {prop:12}", () => {
        assert(isEmptyObject({prop: 12}) === false, 'Wrong result for {prop:12}');
    });
});

describe('functions setObjProperty & getObjProperty', () => {
    test("setObjProperty - target null", () => {
        try {
            setObjProperty(null, "a.b", 14);
        } catch (err) {
            return;
        }
        assert.fail('Exception was expected');
    });
    test("setObjProperty - value 17", () => {
        let target = {};
        setObjProperty(target, "a.b", 17);
        assert(target.a.b === 17, 'Wrong value');
    });
    test("getObjProperty - source null", () => {
        assert(getObjProperty(null, "a.b") === undefined, "Expecting undefined");
    });
    test("getObjProperty - value 119", () => {
        assert(getObjProperty({a: {b: 119}}, "a.b") === 119, "Value expected");
    });
});

describe('validators', () => {
    test("isValidNIP", () => {
        assert(isValidNIP('8196895375'));
        assert(!isValidNIP('98236'));
    });

    test("isValidREGON", () => {
        assert(!isValidREGON('12345678'));
        assert(isValidREGON('650404553')); // 9 digits
        assert(isValidREGON('19543451407739')); // 14 digits
    });

    test("isValidEmail", () => {
        assert(!isValidEmail('somebody@somewhere.a'));
        assert(isValidEmail('somebody@somewhere.dot'));
    });
});

describe('function shallowCopy', () => {
    test("copy without except", () => {
        let dst = {'my': 'myVal'};
        let res = shallowCopyExcept(dst, {'a': 'a', 'b': 'bb'});
        assert(res.my == 'myVal');
        assert(res.a == 'a');
        assert(res.b == 'bb');
        assert(res === dst);
    });

    test("copy with except", () => {
        let dst = {'my': 'myVal'};
        let res = shallowCopyExcept(dst, {'a': 'a', 'b': 'bb'}, ['b']);
        assert(res.my == 'myVal');
        assert(res.a == 'a');
        assert(res.b === undefined);
        assert(res === dst);
    });

    test("copy src is null ", () => {
        try {
            shallowCopyExcept({'my': 'myVal'}, null);
            assert(false);
        } catch (err) {
            /* ignore */
        }
    });


    test("copy without accept function", () => {
        let dst = {'my': 'myVal'};
        let res = shallowCopy(dst, {'a': 'a', 'b': 'bb'});
        assert(res.my == 'myVal');
        assert(res.a == 'a');
        assert(res.b == 'bb');
        assert(res === dst);
    });

    test("copy + accept function", () => {
        let dst = {'my': 'myVal'};
        let res = shallowCopy(dst, {'aa': 'a', 'b': 'bb', cc: 'cc'}, (key, sval) => key.length == 2);
        assert(res.my == 'myVal');
        assert(res.aa == 'a');
        assert(res.cc === 'cc');
        assert(res.b === undefined);
        assert(res === dst);
    });

    test("copy + keys array", () => {
        let dst = {'my': 'myVal'};
        let res = shallowCopy(dst, {'aa': 'a', 'b': 'bb', cc: 'cc'}, ['aa', 'cc']);
        assert(res.my == 'myVal');
        assert(res.aa == 'a');
        assert(res.cc === 'cc');
        assert(res.b === undefined);
        assert(res === dst);
    });
});

describe('function isEquivalent', () => {
    test("Numbers equal", () => {
        assert(isEquivalent(10, 10), "10!=10");
    });

    test("Numbers not equal", () => {
        assert(!isEquivalent(10, 62), "10==62");
    });

    test("Strings equal", () => {
        assert(isEquivalent('ABC', 'ABC'), "ABC!=ABC");
    });

    test("Strings not equal", () => {
        assert(!isEquivalent('ABC', 'XY'), "ABC==XY");
    });

    test("Arrays equal", () => {
        assert(isEquivalent([1, 2, 3], [1, 2, 3]), "[1,2,3]!=[1,2,3]");
    });

    test("Arrays not equal (1)", () => {
        assert(!isEquivalent([1, 2, 3], [1, 9, 3]), "[1,2,3]==[1,9,3]");
    });

    test("Arrays not equal (2)", () => {
        assert(!isEquivalent([1, 2, 3], [1, 3, 3]), "[1,2,3]==[1,3,2]");
    });

    test("Arrays not equal (3)", () => {
        assert(!isEquivalent([1, 2, 3], [1, 2, 3, 4]), "[1,2,3]==[12,3,4]");
    });

    test("Objects equal", () => {
        assert(isEquivalent({x: 1, y: {a: 5}}, {x: 1, y: {a: 5}}), "objects should be equal");
    });

    test("Objects not equal", () => {
        assert(!isEquivalent({x: 1, y: {a: 5}}, {x: 1, y: {a: null}}), "objects should be not equal");
    });

    test("Mixed: undefined != null", () => {
        assert(!isEquivalent(undefined, null), "undefined==null");
    });

    test("Mixed types: '3' != 3", () => {
        assert(!isEquivalent('3', 3), "'3'==3");
    });
});

describe('function devOnly', () => {
    const container = {devMode: false};
    let env;
    beforeAll(() => {
        env = process.env.NODE_ENV;
    });
    afterAll(() => {
        process.env.NODE_ENV = env;
    });
    beforeEach(() => {
        container.devMode = false;
    });

    test('devOnly - on (test)', () => {
        process.env.NODE_ENV = 'test';
        devOnly(() => {  container.devMode = true;  });
        expect(container.devMode).toBe(true);
    });

    test('devOnly - on (development)', () => {
        process.env.NODE_ENV = 'development';
        devOnly(() => {  container.devMode = true;  });
        expect(container.devMode).toBe(true);
    });

    test('devOnly - off (production)', () => {
        process.env.NODE_ENV = 'production';
        devOnly(() => {  container.devMode = true;  });
        expect(container.devMode).toBe(false);
    });
});

describe('function objectToStr / strToObject', () => {
    test('objectToStr - null or undefined (test)', () => {
        expect(objectToStr(null)).toBe(null);
        expect(objectToStr(undefined)).toBe(undefined);
    });

    test('strToObject - null or undefined (test)', () => {
        expect(strToObject(null)).toBe(null);
        expect(strToObject(undefined)).toBe(undefined);
    });

    test('objectToStr', () => {
        let obj = {key0:'value0', key1:7172};
        let str = objectToStr(obj, ',', ':=');
        expect(str).toBe('aaa');
    });

    test('objectToStr', () => {
        let obj = strToObject('k=1#a=ala', '#');
        expect(obj.k).toBe('1');
        expect(obj.a).toBe('ala');
    });

});