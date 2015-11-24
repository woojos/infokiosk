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

        //console.log(this._currentQuestionInSession + ' > ' + this._questionCountOnSession);

        if (this._currentQuestionInSession >= this._questionCountOnSession) {
            return false;
        } else {
            this._currentQuestionInSession++;
            this.questions.next();
            return true;
        }

    },

    _nextQuestion: function() {
        //console.log(this._currentQuestionInSession);
        app.router.navigate('#quiz/'+(this._currentQuestionInSession+1), {trigger:true});
    },

    _showNextButton: function() {
        $('button.next-question').show();
    },

    makeActivate: function() {
        console.log('Make quiz active');
        this.show();
        this._currentQuestionInSession = 0;
        this.questions.invoke('set', {"isAnswered": false});
    },

    makeInactive: function() {
        this.hide();
    },

    getDataToSave: function() {
        return this.questions.answeredQuestions().toJSON();
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

        var q4 = new Question({
            "id":4,
            "text":"Czy lubisz psy [4]?",
            "answers": [
                new Answer({
                    "id":10,
                    "text":"Tak",
                    "isGood":true
                }),
                new Answer({
                    "id":11,
                    "text":"Bardzo!!",
                    "isGood":false
                }),
                new Answer({
                    "id":12,
                    "text":"Super!!!",
                    "isGood":false
                })
            ]
        });

        var q5 = new Question({
            "id":5,
            "text":"Czy Miko jest najszybszy ? [5]?",
            "answers": [
                new Answer({
                    "id":13,
                    "text":"Tak",
                    "isGood":true
                }),
                new Answer({
                    "id":14,
                    "text":"Ja Usajn Bolt!!",
                    "isGood":false
                }),
                new Answer({
                    "id":15,
                    "text":"Jak błyskawica!!!",
                    "isGood":false
                })
            ]
        });

        this.questions.reset([q1, q2, q3, q4, q5]);
        this.questions.each(function(element){
           element.save();
        });

    }

});


var Question = Backbone.Model.extend({

    id:0,
    text:"",
    answers:null,
    isAnswered:false,

    initialize: function(options) {
        this.id = options.id;
        this.text = options.text;
        this.answers = new AnswerCollection;
        this.answers.reset(options.answers);

        this.answers.on("change:isChecked", this._changeIsAnswered, this);
    },

    isChecked: function() {
        if (this.answer.where({"isChecked":true}).length > 0)
            return true;
        else
            return false;
    },

    _changeIsAnswered: function(el) {
        this.set({
            "isAnswered" : el.get("isChecked")
        })
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
    },

    answeredQuestions: function() {
        return new QuestionCollection(this.where({"isAnswered":true}));
    }


});


var QuestionView = Backbone.View.extend({

    model:null,
    template:"",
    tagName:"ul",

    events: {
        'change input[type=radio]': '_update'
    },

    initialize: function(options) {
        this.model = options.model;
    },

    render: function() {

        this.$el.html(this.model.text);
        this.model.answers.each(function(el){
            var view = new AnswerView({model: el});
            this.$el.append(view.render().el);
        }.bind(this));

        this.$el.append(
            "<div class=\"row\">" +
                "<div class=\"col-md-10\"></div>" +
                "<div class=\"col-md-2\">" +
                "<button type=\"button\" class=\"next-question btn btn-primary\">Dalej</button>" +
                "</div>" +
            "</div>"
        );

        return this;
    },

    _update: function() {
        var id = $(this.el).find('input[type="radio"]:checked').attr('data-id');

        var answer = this.model.answers.get(id);

        this.model.answers.each(function(el){
            el.set({'isChecked': false});
        });

        answer.set({'isChecked': true});
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
        this.isChecked = false;
    }

});

var AnswerView = Backbone.View.extend({

    model:null,
    tagName:'li',

    initialize: function(options) {
        this.model = options.model;
    },

    render: function() {
        var tpl = "<input id=\"answer"+this.model.id+"\" type=\"radio\" name=\"question\" class=\"answer-radio\" data-id=\""+this.model.id+"\" value=\""+this.model.id+"\">" +
            "<label for=\"answer"+this.model.id+"\">" +
            "<span><span></span></span>" + this.model.text + "</label>";
        this.$el.html(tpl);
        return this;
    }

});

var AnswerCollection = Backbone.Collection.extend({
   model:Answer
});