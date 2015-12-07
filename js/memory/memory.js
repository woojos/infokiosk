/**
 * Created by mwojcik on 25/11/15.
 */

var MemoryApp = Backbone.View.extend({

    el: null,
    images: [],

    imageOpened:"",

    timer:null,
    time:0,

    onEnd:null, // callback

    initialize: function(options) {
        this.options = options;
        this.el = options.el;
        this.images = options.images;
    },

    create: function() {
        for (var i = 0; i < 2; i++) {
            _.each(this.images, function (el, index) {
                this.addOne(new MemoryImage({"src": el}), index + (this.images.length*i));
            }, this);
        }
    },

    events: {
        'click div.image-tile': 'clickImage'
    },

    getDataToSave: function() {
        var saveObject = {};
        saveObject.time = this.time;
        return saveObject;
    },

    clickImage: function(el) {

        var id = $(el.target).attr('id');

        if (!id) {
            return;
        }

        if ($("#" + id + " img").is(":hidden")) {

            $("#" + id + " img").slideDown('fast');


            if ("" == this.imageOpened) {
                this.imageOpened = $("#" + id + " img").attr("src");
            } else {
                var currentOpened = $("#" + id + " img").attr("src");
                var that = this;
                if (this.imageOpened != currentOpened) {
                    setTimeout(function () {
                        $('img[src="' + that.imageOpened + '"]').slideUp('fast');
                        $('img[src="' + currentOpened + '"]').hide('slow');
                        that.imageOpened = "";
                    }, 400);
                } else {

                    var that = this;

                    setTimeout(function () {
                        $('img[src="' + that.imageOpened + '"]').parent().addClass('invisible');
                        that.imageOpened = "";

                        if (that.images.length*2 == that.el.find('.invisible').length) {
                            console.log('koniec gry');
                            that.onEnd();
                        }
                    }, 400);
                }

            }
        }

    },

    shuffleImages: function () {

        var imgAll = this.el.children();

        var imgThis = this.el.find("div:first-child");

        var imgArr = [];

        for (var i = 0; i < imgAll.length; i++) {
            imgArr[i] = $("#" + imgThis.attr("id") + " img").attr("src");
            imgThis = imgThis.next();
        }

        imgThis = this.el.find("div:first-child");

        for (var z = 0; z < imgAll.length; z++) {
            var randomNumber = Math.round(Math.random() * (imgArr.length - 1));

            $("#" + imgThis.attr("id") + " img").attr("src", imgArr[randomNumber]);
            imgArr.splice(randomNumber, 1);
            imgThis = imgThis.next();
        }
    },

    addOne: function(memoryImage, index) {
        var view = new MemoryImageView({model: memoryImage, id: "card" + index});
        this.el.append(view.render().el);
    },

    show: function() {
        this.el.parent().show();
    },

    hide: function() {
        this.el.parent().hide();
    },

    makeActivate: function() {

        this.el.find('.invisible img').removeAttr('style');
        this.el.find('.invisible').removeClass('invisible')
        this.shuffleImages();

        this.show();

        /* timer */
        this.time = 0;
        var that = this;
        this.timer = setInterval(function(){
            that.time += 0.5;
            that.el.parent().find('.timer').html(that.time.toFixed(1) + 's');
            //console.log(that.time);
        }, 500);
    },

    makeInactive: function() {
        this.hide();
        clearInterval(this.timer);
    }

});


var MemoryImage = Backbone.Model.extend({

    defaults: {
        "src":""
    },

    initialize: function(options) {
        this.options = options;
    }

});

var MemoryImageCollection = Backbone.Model.extend({
    model: MemoryImage
});

var MemoryImageView = Backbone.View.extend({

    model:null,
    tagName:"div",
    className: "image-tile",

    render: function() {
        this.$el.html("<img src='" + this.model.get("src") + "'/>");
        return this;
    }

});
/*

 var BoxOpened = "";
var ImgOpened = "";
var Counter = 0;
var ImgFound = 0;

var Source = "#boxcard";

var ImgSource = [
    "http://img5.uploadhouse.com/fileuploads/17699/176992640c06707c66a5c0b08a2549c69745dc2c.png",
    "http://img6.uploadhouse.com/fileuploads/17699/17699263b01721074bf094aa3bc695aa19c8d573.png",
    "http://img6.uploadhouse.com/fileuploads/17699/17699262833250fa3063b708c41042005fda437d.png",
    "http://img9.uploadhouse.com/fileuploads/17699/176992615db99bb0fd652a2e6041388b2839a634.png",
    "http://img4.uploadhouse.com/fileuploads/17699/176992601ca0f28ba4a8f7b41f99ee026d7aaed8.png",
    "http://img3.uploadhouse.com/fileuploads/17699/17699259cb2d70c6882adc285ab8d519658b5dd7.png",
    "http://img2.uploadhouse.com/fileuploads/17699/1769925824ea93cbb77ba9e95c1a4cec7f89b80c.png",
    "http://img7.uploadhouse.com/fileuploads/17699/1769925708af4fb3c954b1d856da1f4d4dcd548a.png",
    "http://img9.uploadhouse.com/fileuploads/17699/176992568b759acd78f7cbe98b6e4a7baa90e717.png",
    "http://img9.uploadhouse.com/fileuploads/17699/176992554c2ca340cc2ea8c0606ecd320824756e.png"
];

function RandomFunction(MaxValue, MinValue) {
    return Math.round(Math.random() * (MaxValue - MinValue) + MinValue);
}

function ShuffleImages() {
    var ImgAll = $(Source).children();
    var ImgThis = $(Source + " div:first-child");
    var ImgArr = new Array();

    for (var i = 0; i < ImgAll.length; i++) {
        ImgArr[i] = $("#" + ImgThis.attr("id") + " img").attr("src");
        ImgThis = ImgThis.next();
    }

    ImgThis = $(Source + " div:first-child");

    for (var z = 0; z < ImgAll.length; z++) {
        var RandomNumber = RandomFunction(0, ImgArr.length - 1);

        $("#" + ImgThis.attr("id") + " img").attr("src", ImgArr[RandomNumber]);
        ImgArr.splice(RandomNumber, 1);
        ImgThis = ImgThis.next();
    }
}

function ResetGame() {
    ShuffleImages();
    $(Source + " div img").hide();
    $(Source + " div").css("visibility", "visible");
    Counter = 0;
    $("#success").remove();
    $("#counter").html("" + Counter);
    BoxOpened = "";
    ImgOpened = "";
    ImgFound = 0;
    return false;
}

function OpenCard() {
    var id = $(this).attr("id");

    if ($("#" + id + " img").is(":hidden")) {
        $(Source + " div").unbind("click", OpenCard);

        $("#" + id + " img").slideDown('fast');

        if (ImgOpened == "") {
            BoxOpened = id;
            ImgOpened = $("#" + id + " img").attr("src");
            setTimeout(function() {
                $(Source + " div").bind("click", OpenCard)
            }, 300);
        } else {
            CurrentOpened = $("#" + id + " img").attr("src");
            if (ImgOpened != CurrentOpened) {
                setTimeout(function() {
                    $("#" + id + " img").slideUp('fast');
                    $("#" + BoxOpened + " img").slideUp('fast');
                    BoxOpened = "";
                    ImgOpened = "";
                }, 400);
            } else {
                $("#" + id + " img").parent().css("visibility", "hidden");
                $("#" + BoxOpened + " img").parent().css("visibility", "hidden");
                ImgFound++;
                BoxOpened = "";
                ImgOpened = "";
            }
            setTimeout(function() {
                $(Source + " div").bind("click", OpenCard)
            }, 400);
        }
        Counter++;
        $("#counter").html("" + Counter);

        if (ImgFound == ImgSource.length) {
            $("#counter").prepend('<span id="success">You Found All Pictues With </span>');
        }
    }
}

$(function() {

    for (var y = 1; y < 3 ; y++) {
        $.each(ImgSource, function(i, val) {
            $(Source).append("<div id=card" + y + i + "><img src=" + val + " />");
        });
    }
    $(Source + " div").click(OpenCard);
    ShuffleImages();
});

*/
