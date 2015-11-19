/**
 * Created by mwojcik on 17/11/15.
 */

var UserFormApp = Backbone.View.extend({

    el: null,

    /* callback */
    onSave:null,

    initialize: function(options) {
        this.el = options.el;

        console.log(this.el.find('.osk-trigger'));

        this.el.find('form').children('.osk-trigger').onScreenKeyboard({
            rewireReturn : 'Wyślij',
            rewireTab : true,
            topPosition: '50%',
            leftPosition:'27%'
        });

        /* @todo to wymiany */
        $('#user-form input[type="text"]:first').click();

        this.el.find('form').submit(function() {
            console.log('dupa');
            this.onSave();
            return false;
        }.bind(this));

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
        $('#osk-container').fadeOut('fast');
    },

    makeActive: function() {
        this.show();
        $('#osk-container').fadeIn('fast');
    }

});