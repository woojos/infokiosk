/**
 * Created by mwojcik on 17/11/15.
 */

var UserFormApp = Backbone.View.extend({

    el: null,

    /* callback */
    onSave: null,

    user: null,

    initialize: function (options) {
        this.el = options.el;

        this.user = new User;

        this.el.find('form').children('.osk-trigger').onScreenKeyboard({
            rewireReturn: 'Wyślij',
            rewireTab: true,
            topPosition: '50%',
            leftPosition: '27%'
        });

        /* @todo to wymiany */
        $('#user-form input[type="text"]:first').click();

        this.el.find('form').submit(function () {

            this.user.set({
                "firstname" : $('input[name=firstname]').val(),
                "lastname" : $('input[name=lastname]').val(),
                "email" : $('input[name=email]').val()
            });

            this.onSave();
            return false;
        }.bind(this));

    },

    show: function () {
        this.el.show();
    },

    hide: function () {
        this.el.hide();
    },

    makeInactive: function () {
        this.hide();
        $('#osk-container').fadeOut('fast');
        console.log('Make user-form inactive');
    },

    makeActive: function () {
        this.show();
        $('#osk-container').fadeIn('fast');
        console.log('Make user-form active');
    },

    getDataToSave: function () {
        return this.user.toJSON();
    }
});

var User = Backbone.Model.extend({
    defaults: {
        "firstname": "",
        "lastname": "",
        "email": ""
    }
});