/**
 * Created by mwojcik on 15/11/15.
 */


var QuizApp = Backbone.View.extend({

    el: null,

    questions:null,

    pointer:0,

    initialize: function(options) {
        this.el = options.el;
        this.questions = new QuestionCollection;
    },

    events: {
        'click .next-question': 'nextQuestion',
        'change input[type=radio]': 'showNextButton'

    },

    show: function() {
        this.el.show();
    },

    hide: function() {
        this.el.hide();
    },

    renderQuestion: function(pointer) {
        this.pointer = pointer;
        console.log(this.questions.length);
        var question = new QuestionView({"model":this.questions.at(pointer)});
        this.el.html(question.render().el);
    },

    nextQuestion: function() {
        app.router.navigate('#quiz/'+(this.pointer+2), {trigger:true});
    },

    showNextButton: function() {
        $('button.next-question').show();
    },

    loadQuestions: function() {

        var q1 = new Question({
            "id":1,
            "text":"Czy lubisz frytki ?",
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
            "text":"Czy Mikołaj jest fajny ?",
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
            "text":"Czy lubisz koty?",
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

    pointer:0,

    reset: function(models, options) {
        options = options || {};
        this.pointer = 0;
        Backbone.Collection.prototype.reset.call(this, models, options);
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