import { customNew } from '.';

describe('自定义 new', () => {
    it('new', () => {
        class Foo {
            // property
            name: string;
            city: string;
            number: number;

            constructor(name: string, n: number) {
                this.name = name;
                this.city = '北京';
                this.number = n;
            }

            getNmae() {
                return this.name;
            }
        }

        const f = customNew<Foo>(Foo, '张雅昕', 100);
        expect(f.name).toBe('张雅昕');
        expect(f.city).toBe('北京');
        expect(f.number).toBe(100);
        expect(f.getNmae()).toBe('张雅昕');
    });
});
