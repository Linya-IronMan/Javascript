let a = {
    num: 1,
    valueOf() {
        return this.num++;
    },
};
if (a == 1 && a == 2 && a == 3) {
    console.log('Hello World!');
}
