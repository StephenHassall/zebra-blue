//module.exports = Test;

class Test {
    constructor (name) {
        this._name = name;
    }

    get name() { return UpperCase.do(this._name); }
}

class Test2 {
    constructor (name) {
        this._name = name;
    }

    get name() { return UpperCase.do(this._name); }
}

class UpperCase {
    static do(value) { return value.toUpperCase(); }
}

module.exports = {
    Test: Test,
    Test2: Test2
}
