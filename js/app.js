/**
 * Created by mwojcik on 15/11/15.
 * http://bxslider.com/options
 */

var AppRouter = Backbone.Router.extend({

    app:null,

    initialize: function(options) {
        this.app = options.app;
    },

    routes: {
        '': 'index',
        'quiz' : 'quizLoad',
        'quiz/:no' : 'quiz',
        'user-form' : 'userForm',
        'memory' : 'memory'
    },

    index: function() {
        this._switchOffAll();
        this.app.sliderApp.makeActivate();

    },

    quizLoad: function() {
        this._switchOffAll();
        this.app.quizApp.makeActivate();
        this.navigate('#quiz/1', {trigger: true});
    },

    quiz: function(no) {

        this.app.quizApp.questions.fetch();

        if (this.app.quizApp.next()) {
            this.app.quizApp.renderQuestion();
        } else {
            this.navigate('user-form', {trigger: true});
        }
    },

    memory: function() {
        this._switchOffAll();
        this.app.memoryApp.makeActivate();
    },

    userForm: function() {
        this._switchOffAll();
        this.app.userFormApp.makeActive();
    },

    _switchOffAll: function() {
        this.app.quizApp.makeInactive();
        this.app.sliderApp.makeInactive();
        this.app.userFormApp.makeInactive();
        this.app.memoryApp.makeInactive();
    }

});



var App = Backbone.View.extend({

    router: {},

    sliderApp: {},

    quizApp: {},

    userFormApp: {},

    memoryApp: {},

    baseURL: 'http://127.0.0.1:8888/',

    initialize: function() {
        this.initSliderApp();
        this.initQuizApp();
        this.initMemoryApp();
        this.initUserForm();

        this.router = new AppRouter({'app':this});
        Backbone.history.start();
    },

    initSliderApp: function() {
        this.sliderApp = new SliderApp({
            'el' : $('#slider'),
            'auto' : true,
            'speed' : 500,
            'pause' : 2000,
            'images' : [
                'img/img1.jpg',
                'img/img2.jpg',
                'img/img3.jpg'
            ]
        });

        this.sliderApp.onUserAction = function() {
            this.router.navigate('quiz', {trigger: true});
            //this.router.navigate('memory', {trigger: true});
        }.bind(this);

        this.sliderApp.create();
    },

    initQuizApp: function() {
        this.quizApp = new QuizApp({
            'el' : $('#quiz'),
            'questionCountOnSession' : 2
        });

        this.quizApp.loadQuestions(this.baseURL);
        this.quizApp.makeInactive();
    },

    initUserForm: function() {
        this.userFormApp = new UserFormApp({
            'el' : $('#user-form')
        });
        this.userFormApp.onSave = function (that) {
            this.saveResult();
            this.router.navigate('', {trigger: true});
        }.bind(this);
        this.userFormApp.makeInactive();
    },

    initMemoryApp: function() {
        this.memoryApp = new MemoryApp({
            'el' : $('#memory'),
            'images' : [
                'img/memory/17699259cb2d70c6882adc285ab8d519658b5dd7.png',
                'img/memory/17699263b01721074bf094aa3bc695aa19c8d573.png',
                'img/memory/176992554c2ca340cc2ea8c0606ecd320824756e.png',
                'img/memory/176992568b759acd78f7cbe98b6e4a7baa90e717.png',
                'img/memory/176992601ca0f28ba4a8f7b41f99ee026d7aaed8.png',
                'img/memory/176992615db99bb0fd652a2e6041388b2839a634.png',
                'img/memory/176992640c06707c66a5c0b08a2549c69745dc2c.png',
                'img/memory/1769925708af4fb3c954b1d856da1f4d4dcd548a.png',
                'img/memory/1769925824ea93cbb77ba9e95c1a4cec7f89b80c.png',
                'img/memory/17699262833250fa3063b708c41042005fda437d.png',
            ]
        });

        this.memoryApp.create();
        this.memoryApp.shuffleImages();
    },

    saveResult: function() {
        var userData = this.userFormApp.getDataToSave();
        var questions = this.quizApp.getDataToSave();

        var saveObject = {};
        saveObject.userData = userData;
        saveObject.questions = questions;

        console.log(questions);
        $.ajax({
            type: "POST",
            url: this.baseURL + 'save',
            data: JSON.stringify(saveObject),
            dataType: 'json'
        });

    }


});




$(document).ready(function(){

    app = new App;

});


