class MyHelper extends Helper {
    // before/after hooks
    _before() {
        // remove if not used
    }

    _after() {
        // remove if not used
    }

    // add custom methods here
    // If you need to access other helpers
    // use: this.helpers['helperName']
    async doAwesomeThings(){
        console.log('YES IT WORKS');
    }
}

export = MyHelper;