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
        'quiz/:no' : 'quiz'
    },

    index: function() {

        this.app.quizApp.hide();

        this.app.sliderApp.show();
        this.app.sliderApp.start();
    },

    quizLoad: function() {
        this.app.quizApp.loadQuestions();
        this.navigate('#quiz/1', {trigger: true});
    },

    quiz: function(no) {
        this.app.sliderApp.hide();
        this.app.sliderApp.stop();
        this.app.quizApp.show();

        //this.app.quizApp.loadQuestions();
        this.app.quizApp.renderQuestion(no-1);
    }

});



var App = Backbone.View.extend({

    router: {},

    sliderApp: {},

    quizApp: {},

    initialize: function() {
        this.initSliderApp();
        this.initQuizApp();

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

        this.sliderApp.create();
    },

    initQuizApp: function() {
        this.quizApp = new QuizApp({
            'el' : $('#quiz')
        });
        this.quizApp.hide();
    }


});




$(document).ready(function(){

    app = new App;

});


