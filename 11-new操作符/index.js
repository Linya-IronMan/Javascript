function Foo(name) {
    this.name = name;
    this.city = 'Beijing';
}

Foo.prototype.getName = function () {
    return this.name;
};

const f = new Foo('林崖');
f.getName();
