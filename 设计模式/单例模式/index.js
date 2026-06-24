class SingleTon {
    #instance;
    constructor() {}
    static getInstance() {
        console.log('instance', this.instance);
        if (this.instance) {
            return this.instance;
        } else {
            this.instance = new SingleTon();
            return this.instance;
        }
    }
    fn1() {}
}

const s = SingleTon.getInstance();

const s1 = SingleTon.getInstance();

console.info(s === s1); // true
