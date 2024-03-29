import LRUCache from './_LRU';

describe('LRU Cache', () => {
    it('get set', () => {
        const lru = new LRUCache(2);
        lru.set('1', 100);
        lru.set('2', 200);
        expect(lru.get('1')).toBe(100);
        expect(lru.get('2')).toBe(200);
    });

    it('set 超出容量', () => {
        const lru = new LRUCache(2);
        lru.set('1', 100);
        lru.set('2', 200);
        lru.set('1', 101);
        lru.set('3', 300);
        expect(lru.get('1')).toBe(101);
        expect(lru.get('2')).toBeNull();
        expect(lru.get('3')).toBe(300);
    });

    it('get 超出容量', () => {
        const lru = new LRUCache(2);
        lru.set('1', 100);
        lru.set('2', 200);
        lru.get('1');
        lru.set('3', 300);
        expect(lru.get('1')).toBe(100);
        expect(lru.get('2')).toBeNull();
        expect(lru.get('3')).toBe(300);
    });
});
