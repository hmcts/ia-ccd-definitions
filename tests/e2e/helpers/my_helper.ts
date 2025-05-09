 class MyHelper extends Helper {
    // before/after hooks
    // _before() {
    //     // remove if not used
    // }
    //
    // _after() {
    //     // remove if not used
    // }


    // This is an typescript example of a custom helper//
    // be aware that it seems that there is a bug that helper mrthods are not displaying in I


     // add custom methods here
    // If you need to access other helpers
    // use: this.helpers['helperName']
    doSomething(){
           console.log('Hello');
    }
}
export = MyHelper