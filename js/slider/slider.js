/**
 * Created by mwojcik on 15/11/15.
 */


var SliderApp = Backbone.View.extend({

    el: null,

    extSlider:null,

    onUserAction:null,

    options: {},

    initialize: function(options) {

        this.el = options.el;
        this.options = options;

        this.el.click(function(){
            this.onUserAction();
        }.bind(this));
    },

    create: function() {
         _.each(this.options.images, function(element){
            this.addOne(new Slide({
                'src' : element
                }));
         }, this);

         this.extSlider = this.el.bxSlider({
             auto: this.options.auto,
             speed: this.options.speed,
             pause: this.options.pause,
             pager: false
         });
    },

    addOne: function(slide) {
        var view = new SlideView({model: slide});
        this.el.append(view.render().el);
    },

    stop: function() {
        this.extSlider.stopAuto();
    },

    start: function() {
        this.extSlider.startAuto();
    },

    restart: function() {
        this.extSlider.goToSlide(0);
    },

    show: function() {
        this.el.parent().parent().show();
    },

    hide: function() {
        this.el.parent().parent().hide();
    },

    makeActivate: function() {
        this.show();
        this.start();
    },

    makeInactive: function() {
        this.stop();
        this.hide();
    }
});


var Slide = Backbone.Model.extend({

    src:null,

    initialize: function(options) {
        this.src = options.src;
    }

});


var SlideView = Backbone.View.extend({

    tagName: "li",
    model:null,

    initialize: function(options) {
        this.model = options.model;
        this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
        this.$el.html("<img src=\"" + this.model.src + "\" />");
        return this;
    }

});