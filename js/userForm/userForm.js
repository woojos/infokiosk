/**
 * Created by mwojcik on 17/11/15.
 */

var UserFormApp = Backbone.View.extend({

    el: null,

    onSave:null,

    initialize: function(options) {

        this.el = options.el;
    },

    events: {
        'click .save-user': '_save'
    },

    _save: function() {
        this.onSave();
    },

    show: function() {
        this.el.show();
    },

    hide: function() {
        this.el.hide();
    },

    makeInactive: function() {
        this.hide();
    },

    makeActive: function() {
        this.show();
    }

});