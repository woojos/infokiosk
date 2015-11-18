/**
 * Created by mwojcik on 15/11/15.
 */


var QuizApp = Backbone.View.extend({

    el: null,

    questions:null,
    _questionCountOnSession:0,
    _currentQuestionInSession:0,

    initialize: function(options) {
        this.el = options.el;
        this.questions = new QuestionCollection;
        this._questionCountOnSession = options.questionCountOnSession;
    },

    events: {
        'click .next-question': '_nextQuestion',
        'change input[type=radio]': '_showNextButton'
    },

    show: function() {
        this.el.show();
    },

    hide: function() {
        this.el.hide();
    },

    renderQuestion: function() {
        var question = new QuestionView({"model":this.questions.current()});
        this.el.html(question.render().el);
    },

    next: function() {

        console.log(this._currentQuestionInSession + ' > ' + this._questionCountOnSession);

        if (this._currentQuestionInSession >= this._questionCountOnSession) {
            return false;
        } else {
            this._currentQuestionInSession++;
            this.questions.next();
            return true;
        }

    },

    _nextQuestion: function() {
        console.log(this._currentQuestionInSession);
        app.router.navigate('#quiz/'+(this._currentQuestionInSession+1), {trigger:true});
    },

    _showNextButton: function() {
        $('button.next-question').show();
    },

    makeActivate: function() {
        this.show();
        this._currentQuestionInSession = 0;
    },

    makeInactive: function() {
        this.hide();
    },

    loadQuestions: function() {

        var q1 = new Question({
            "id":1,
            "text":"Czy lubisz frytki [1]?",
            "answers": [
                new Answer({
                    "id":1,
                    "text":"Tak",
                    "isGood":true
                }),
                new Answer({
                    "id":2,
                    "text":"Nie",
                    "isGood":false
                }),
                new Answer({
                    "id":3,
                    "text":"Może",
                    "isGood":false
                })
            ]
        });

        var q2 = new Question({
            "id":2,
            "text":"Czy Mikołaj jest fajny [2]?",
            "answers": [
                new Answer({
                    "id":4,
                    "text":"Tak",
                    "isGood":true
                }),
                new Answer({
                    "id":5,
                    "text":"Bardzo!!",
                    "isGood":false
                }),
                new Answer({
                    "id":6,
                    "text":"Super!!!",
                    "isGood":false
                })
            ]
        });

        var q3 = new Question({
            "id":3,
            "text":"Czy lubisz koty [3]?",
            "answers": [
                new Answer({
                    "id":7,
                    "text":"Tak",
                    "isGood":true
                }),
                new Answer({
                    "id":8,
                    "text":"Bardzo!!",
                    "isGood":false
                }),
                new Answer({
                    "id":9,
                    "text":"Super!!!",
                    "isGood":false
                })
            ]
        });


        this.questions.reset([q1, q2, q3]);
        this.questions.each(function(element){
           element.save();
        });

    }

});


var Question = Backbone.Model.extend({

    id:0,
    text:"",
    answers:null,

    initialize: function(options) {
        this.id = options.id;
        this.text = options.text;
        this.answers = new AnswerCollection;
        this.answers.reset(options.answers);
    }

});

var QuestionCollection = Backbone.Collection.extend({

    model: Question,
    localStorage: new Backbone.LocalStorage("question-local-storage"),
    _pointer:0,

    _current:0,

    reset: function(models, options) {
        options = options || {};
        this._pointer = 0;
        this._current = 0;
        Backbone.Collection.prototype.reset.call(this, models, options);
    },

    next: function() {
        if (this.length == this._pointer) {
            this._pointer = 0;
        }
        this._current = this._pointer;
        return this.at(this._pointer++);
    },

    current: function() {
        return this.at(this._current);
    }

});


var QuestionView = Backbone.View.extend({

    model:null,
    template:"",

    initialize: function(options) {
        this.template = _.template($('#question-template').html());
        this.model = options.model;
        this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});


var Answer = Backbone.Model.extend({

    id:0,
    text:"",
    isChecked:false,
    isGood:false,

    initialize: function(options) {
        this.id = options.id;
        this.text = options.text;
        this.isGood = options.isGood;
    }

});

var AnswerCollection = Backbone.Collection.extend({
   model:Answer
});