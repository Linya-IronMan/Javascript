import { getType } from './index';
describe('数据类型判断', () => {
    it('null', () => {
        expect(getType(null)).toEqual('null');
    });

    it('undefined', () => {
        expect(getType(undefined)).toEqual('undefined');
    });

    it('number', () => {
        expect(getType(100)).toEqual('number');
        expect(getType(NaN)).toEqual('number');
        expect(getType(Infinity)).toEqual('number');
        expect(getType(Infinity)).toEqual('number');
    });

    it('bigint', () => {
        expect(getType(BigInt(100))).toEqual('bigint');
    });
    it('string', () => {
        expect(getType('abc')).toBe('string');
    });

    it('boolean', () => {
        expect(getType(true)).toBe('boolean');
    });

    it('symbol', () => {
        expect(getType(Symbol())).toBe('symbol');
    });

    it('object', () => {
        expect(getType({})).toBe('object');
    });
    it('array', () => {
        expect(getType([])).toBe('array');
    });

    it('function', () => {
        expect(getType(function () {})).toBe('function');
    });

    it('map', () => {
        expect(getType(new Map())).toBe('map');
    });
    it('weakmap', () => {
        expect(getType(new WeakMap())).toBe('weakmap');
    });
    it('set', () => {
        expect(getType(new Set())).toBe('set');
    });
    it('weakset', () => {
        expect(getType(new WeakSet())).toBe('weakset');
    });

    it('date', () => {
        expect(getType(new Date())).toBe('date');
    });

    it('regexp', () => {
        expect(getType(new RegExp(''))).toBe('regexp');
    });
    it('error', () => {
        expect(getType(new Error(''))).toBe('error');
    });

    it('promise', () => {
        expect(getType(new Promise(() => {}))).toBe('promise');
    });
});
