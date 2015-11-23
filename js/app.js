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
        'user-form' : 'userForm'
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

    userForm: function() {
        this._switchOffAll();
        this.app.userFormApp.makeActive();
    },

    _switchOffAll: function() {
        this.app.quizApp.makeInactive();
        this.app.sliderApp.makeInactive();
        this.app.userFormApp.makeInactive();
    }

});



var App = Backbone.View.extend({

    router: {},

    sliderApp: {},

    quizApp: {},

    userFormApp: {},

    initialize: function() {
        this.initSliderApp();
        this.initQuizApp();
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
        }.bind(this);

        this.sliderApp.create();
    },

    initQuizApp: function() {
        this.quizApp = new QuizApp({
            'el' : $('#quiz'),
            'questionCountOnSession' : 2
        });

        this.quizApp.loadQuestions();
        this.quizApp.makeInactive();
    },

    initUserForm: function() {
        this.userFormApp = new UserFormApp({
            'el' : $('#user-form')
        });
        this.userFormApp.onSave = function (that) {
            this.router.navigate('', {trigger: true});
        }.bind(this);
        this.userFormApp.makeInactive();
    },


    saveResult: function() {
        var userData = this.userFormApp.getUser();

    }


});




$(document).ready(function(){

    app = new App;

});


