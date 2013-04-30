/*
@source: https://github.com/Quobis/QoffeeSIP
Copyright (C) Quobis
Licensed under GNU-LGPL-3.0-or-later (http://www.gnu.org/licenses/lgpl-3.0.html)
*/
// Generated by CoffeeScript 1.6.2
(function() {
  var UI, User, testBrowser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jQuery.fn.fullscreen = function(bool) {
    var cancelFullScreen;

    cancelFullScreen = document.webkitExitFullscreen || document.mozCancelFullScreen || document.exitFullscreen;
    this.each(function() {
      return this.enterFullscreen = this.webkitEnterFullScreen || this.mozRequestFullScreen || this.requestFullscreen;
    });
    if (bool) {
      return this.each(function() {
        return this.enterFullscreen();
      });
    } else {
      return cancelFullScreen();
    }
  };

  User = (function(_super) {
    __extends(User, _super);

    function User() {
      _ref = User.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    User.configure("User", "user", "password", "sipServer", "turnServer", "turnCredential", "stunServer", "audioSession");

    User.extend(Spine.Model.Local);

    return User;

  })(Spine.Model);

  UI = (function(_super) {
    __extends(UI, _super);

    UI.prototype.events = {
      "submit form": "submitForm",
      "submit #form-register": "registerSubmit",
      "submit #form-call": "callSubmit",
      "click #answer": "answerClick",
      "click #answer": "answerClick",
      "click #cancel": "hangupClick",
      "click #hangup-established": "hangupClick",
      "click #hangup": "hangupClick",
      "click #fullscreen": "fullscreen",
      "click .toggleMuteAudio": "toggleMuteAudio",
      "click .toggleMuteVideo": "toggleMuteVideo",
      "click #expert": "toggleExpertMode",
      "dragenter .dropbox": "dragEnter",
      "dragleave .dropbox": "toggleActiveClass",
      "drop .dropbox": "onDrop"
    };

    UI.prototype.elements = {
      "#status": "$status",
      "#form-register": "$formRegister",
      "#form-call": "$formCall",
      "#form-calling": "$formCalling",
      "#form-incoming-call": "$formIncomingCall",
      "#form-established-call": "$formEstablishedCall",
      "#answer": "$answerButton",
      "#hangup": "$hangupButton",
      "#notifications": "$notifications",
      "video": "$videos",
      "#media-local": "$mediaLocal",
      "#media-remote": "$mediaRemote",
      "#register": "$registerButton",
      "#call": "$callButton",
      "#chat": "$chat",
      ".messages": "$messages",
      ".dropbox": "$dropbox",
      "#timer": "$timer",
      ".slide": "$slides",
      ".media": "$media",
      "#sound-ringing": "$soundRinging",
      "#sound-calling": "$soundCalling",
      "#expert": "$expert",
      "#expert-options": "$expertOptions"
    };

    UI.prototype.dragEnter = function(e) {
      e.dataTransfer.effectAllowed = "copy";
      this.toggleActiveClass();
      return false;
    };

    UI.prototype.toggleActiveClass = function(e) {
      e.stopPropagation();
      $(e.target).toggleClass("active");
      return false;
    };

    UI.prototype.onDrop = function(e) {
      var file, message, url, _i, _len, _ref1;

      e.stopPropagation();
      e.preventDefault();
      console.log(e);
      _ref1 = e.originalEvent.dataTransfer.files;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        file = _ref1[_i];
        url = URL.createObjectURL(file);
        message = {
          from: this.register.ext,
          to: this.ext2,
          content: $("#chat > .messages").append("<img src=" + url + ">")
        };
        this.renderInstantMessage(message);
      }
      this.toggleActiveClass(e);
      return false;
    };

    UI.prototype.templates = {
      message: function(message, type) {
        console.log(message);
        return "<p class=\"chat-message\">\n	<span class=\"label " + type + "\">" + message.from + " says</span> " + message.content + "\n</p>";
      }
    };

    function UI() {
      this.newState = __bind(this.newState, this);
      this.updateStatus = __bind(this.updateStatus, this);
      this.stopTimer = __bind(this.stopTimer, this);
      this.startTimer = __bind(this.startTimer, this);
      this.nextForm = __bind(this.nextForm, this);
      this.stopSounds = __bind(this.stopSounds, this);
      this.hangupClick = __bind(this.hangupClick, this);
      this.answerClick = __bind(this.answerClick, this);
      this.establishedCallSubmit = __bind(this.establishedCallSubmit, this);
      this.callSubmit = __bind(this.callSubmit, this);
      this.registerSubmit = __bind(this.registerSubmit, this);
      this.toggleExpertMode = __bind(this.toggleExpertMode, this);
      this.submitForm = __bind(this.submitForm, this);
      this.toggleMuteVideo = __bind(this.toggleMuteVideo, this);
      this.toggleMuteAudio = __bind(this.toggleMuteAudio, this);
      this.fullscreen = __bind(this.fullscreen, this);
      this.warningManager = __bind(this.warningManager, this);
      this.warningManager = __bind(this.warningManager, this);
      this.infoManager = __bind(this.infoManager, this);
      this.renderInstantMessage = __bind(this.renderInstantMessage, this);
      this.onDrop = __bind(this.onDrop, this);
      this.dragEnter = __bind(this.dragEnter, this);
      var user;

      UI.__super__.constructor.apply(this, arguments);
      this.register = {};
      User.fetch();
      user = User.last();
      if (user) {
        $("#user-reg").val(user.user);
        $("#pass-reg").val(user.password);
        $("#server-reg").val(user.sipServer);
        if (user.audioSession) {
          $("#only-audio").attr("checked", true);
        }
        $("#stun-server").val(user.stunServer);
        $("#turn-server").val(user.turnServer);
        $("#turn-server-credential").val(user.turnCredential);
      }
    }

    UI.prototype.linkify = function(inputText) {
      var replacePattern1, replacePattern2, replacePattern3, replacedText;

      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
      replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
      return replacedText;
    };

    UI.prototype.emoticonify = function(inputText) {
      var key, pattern, replacedText, substitutions;

      substitutions = {
        angry: /X\-?\(/gim,
        blink: /;-?\)/gim,
        blush: /:-?\$/gim,
        cheerful: /(:-?D)|(\^\^)/gim,
        confused: /:-?S/gim,
        cry: /;-?\(/gim,
        happy: /:-?\)/gim,
        laugh: /X-?D/gim,
        sad: /:-?\(/gim,
        serious: /:-?\|/gim,
        sunglasses: /B-?\)/gim,
        surprised: /:-?O/gim,
        tongue: /:-?P/gim
      };
      replacedText = inputText;
      for (key in substitutions) {
        pattern = substitutions[key];
        replacedText = replacedText.replace(pattern, "<img class='emoticon' src='img/emoticons/" + key + ".svg'/>");
      }
      console.log(replacedText);
      return replacedText;
    };

    UI.prototype.renderInstantMessage = function(message) {
      var contact, type;

      message.content = this.linkify(message.content);
      message.content = this.emoticonify(message.content);
      if (message.from === this.register.ext) {
        contact = message.to;
        type = "label-success";
      } else {
        contact = message.from;
        type = "label-info";
      }
      return this.$messages.append(this.templates.message(message, type)).animate({
        scrollTop: this.$messages[0].scrollHeight
      }, 0);
    };

    UI.prototype.notify = function(msg, type) {
      var args;

      if (type == null) {
        type = "success";
      }
      if (typeof msg !== "string") {
        return;
      }
      args = {
        message: {
          text: msg
        },
        type: type
      };
      return this.$notifications.notify(args).show();
    };

    UI.prototype.infoManager = function(info, data) {
      return this.notify(info);
    };

    UI.prototype.warningManager = function(warn, message) {
      return this.notify(warn, "warning");
    };

    UI.prototype.warningManager = function(error, message) {
      return this.notify(error, "danger");
    };

    UI.prototype.fullscreen = function() {
      return $("#media-remote").fullscreen(true);
    };

    UI.prototype.toggleMuteAudio = function() {
      console.log("[MEDIA] toggleMuteAudio");
      return this.api.toggleMuteAudio();
    };

    UI.prototype.toggleMuteVideo = function() {
      console.log("[MEDIA] toggleMuteVideo");
      return this.api.toggleMuteVideo();
    };

    UI.prototype.submitForm = function(e) {
      e.preventDefault();
      return false;
    };

    UI.prototype.toggleExpertMode = function() {
      var tmp;

      tmp = this.$expert.text();
      this.$expert.text(this.$expert.data("toggle-text"));
      this.$expert.data("toggle-text", tmp);
      return this.$expertOptions.toggleClass("hidden");
    };

    UI.prototype.registerSubmit = function(e) {
      var line, onlyAudio, onopen, server, serverRE, sipServer, stunServer, turnServer, _ref1,
        _this = this;

      User.create({
        user: $("#user-reg").val(),
        password: $("#pass-reg").val(),
        sipServer: $("#server-reg").val(),
        audioSession: $("#only-audio").is(":checked"),
        stunServer: $("#stun-server").val(),
        turnServer: $("#stun-server").val(),
        turnCredential: $("#turn-server-credential").val()
      });
      _ref1 = $("#user-reg").val().split("@"), this.register.ext = _ref1[0], this.register.domain = _ref1[1];
      this.register.pass = $("#pass-reg").val() || this.register.ext;
      server = $("#server-reg").val();
      onlyAudio = $("#only-audio").is(":checked");
      stunServer = {
        url: "stun:" + $("#stun-server").val()
      };
      turnServer = {
        url: "turn:" + $("#turn-server").val(),
        credential: $("#turn-server-credential").val()
      };
      if (stunServer.url === "stun:") {
        stunServer = {
          "url": "stun:74.125.132.127:19302"
        };
      }
      serverRE = /(wss?):\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(\:(\d{2,5}))?((\/\w+)*)/;
      line = serverRE.exec(server);
      sipServer = {};
      if (line != null) {
        sipServer.transport = line[1];
        sipServer.ip = line[2];
        sipServer.port = line[4];
        sipServer.path = line[5] || "";
      } else {
        sipServer.ip = "212.145.159.109";
        sipServer.port = "80";
        sipServer.path = "";
        sipServer.transport = "ws";
      }
      onopen = function() {
        _this.api.on("new-state", _this.newState);
        _this.api.on("instant-message", _this.renderInstantMessage);
        _this.api.register(_this.register.ext, _this.register.pass, _this.register.domain);
        _this.$registerButton.addClass("disabled");
        return _this.$registerButton.addClass("disabled");
      };
      this.api = new API({
        server: sipServer,
        turnServer: turnServer,
        stunServer: stunServer,
        mediaElements: this.mediaElements,
        onopen: onopen,
        mediaConstraints: {
          audio: true,
          video: !onlyAudio
        }
      });
      return this.api.on("localstream", function() {
        return _this.$mediaLocal.removeClass("hidden");
      });
    };

    UI.prototype.callSubmit = function(e) {
      var _ref1;

      _ref1 = $("#ext-call").val().split("@"), this.ext2 = _ref1[0], this.domain2 = _ref1[1];
      this.api.call(this.ext2, this.domain2);
      this.$callButton.addClass("disabled");
      return false;
    };

    UI.prototype.establishedCallSubmit = function(e) {
      this.hangupClick(e);
      return false;
    };

    UI.prototype.answerClick = function(e) {
      e.preventDefault();
      this.$answerButton.addClass("disabled");
      this.$hangupButton.addClass("disabled");
      this.stopSounds();
      this.answer();
      return false;
    };

    UI.prototype.hangupClick = function(e) {
      e.preventDefault();
      this.$answerButton.addClass("disabled");
      this.$hangupButton.addClass("disabled");
      this.hangup();
      return false;
    };

    UI.prototype.stopSounds = function() {
      this.$soundRinging.get(0).pause();
      this.$soundCalling.get(0).pause();
      this.$soundRinging.get(0).currentTime = 0;
      return this.$soundCalling.get(0).currentTime = 0;
    };

    UI.prototype.nextForm = function($el) {
      $(".disabled").removeClass("disabled");
      this.$slides.addClass("hidden");
      $el.removeClass("hidden");
      return $el.children(" > input:first").focus();
    };

    UI.prototype.startTimer = function() {
      var hours, minutes, s, seconds, time,
        _this = this;

      s = seconds = minutes = hours = 0;
      time = function() {
        s += 1;
        seconds = s % 60;
        minutes = parseInt(s / 60) % 60;
        hours = parseInt(s / 3600) % 24;
        seconds += "";
        minutes += "";
        hours += "";
        if (seconds.length === 1) {
          seconds = "0" + seconds;
        }
        if (minutes.length === 1) {
          minutes = "0" + minutes;
        }
        if (hours.length === 1) {
          hours = "0" + hours;
        }
        return _this.$timer.text("" + hours + ":" + minutes + ":" + seconds);
      };
      return this.timer = setInterval(time, 1000);
    };

    UI.prototype.stopTimer = function() {
      if (this.timer != null) {
        return clearInterval(this.timer);
      }
    };

    UI.prototype.updateStatus = function(msg) {
      return this.$status.text(msg);
    };

    UI.prototype.newState = function(state, data) {
      var callback,
        _this = this;

      this.state = state;
      console.log("[STATE] " + this.state);
      switch (this.state) {
        case 3:
          callback = function() {
            _this.stopTimer();
            _this.$videos.removeClass("active");
            _this.$mediaRemote.addClass("hidden");
            return _this.$mediaLocal.css({
              marginTop: "0px"
            });
          };
          callback();
          $(window).bind("beforeunload", function() {
            return _this.api.unregister();
          });
          this.$messages.children().remove();
          this.$chat.hide();
          this.stopSounds();
          this.updateStatus("Registered");
          this.nextForm(this.$formCall);
          $("#register-info").html("<p>Your extension number is <strong>" + this.register.ext + "</strong>, share this URL to a friend and tell him to call you. If you want to connect to our demo webcam, just dial extension 1234.</p>").fadeIn(200);
          return $("#local-legend").text("Local extension is " + this.register.ext);
        case 5:
          this.updateStatus("Calling " + this.ext2);
          document.getElementById("sound-calling").play();
          return this.hangup = function() {
            return _this.api.hangup(data.branch);
          };
        case 6:
          this.ext2 = data.ext;
          this.updateStatus("Incoming call from " + this.ext2);
          this.answer = function() {
            return _this.api.answer(data.branch);
          };
          this.hangup = function() {
            return _this.api.hangup(data.branch);
          };
          this.nextForm(this.$formIncomingCall);
          document.getElementById("sound-ringing").play();
          if (window.autoanswering) {
            return setTimeout((function() {
              return $("#answer").click();
            }), 1000);
          }
          break;
        case 7:
        case 8:
          this.updateStatus("Call established with " + this.ext2);
          $("#remote-legend").text("Remote extension is " + this.ext2);
          this.stopSounds();
          this.startTimer();
          this.nextForm(this.$formEstablishedCall);
          if (window.autoanswering) {
            setTimeout((function() {
              return $("#hangup-established").click();
            }), 15000);
          }
          this.$chat.show();
          this.$chat.find("form").submit(function() {
            var message;

            message = {
              from: _this.register.ext,
              to: _this.ext2,
              content: _this.$chat.find("input:first").val()
            };
            _this.$chat.find("input:first").val("");
            _this.api.chat(_this.ext2, message.content);
            return _this.renderInstantMessage(message);
          });
          this.previousState = this.state;
          callback = function() {
            var h;

            _this.$mediaRemote.removeClass("hidden");
            _this.$videos.addClass("active");
            h = _this.$mediaLocal.height();
            return _this.$mediaLocal.css({
              marginTop: "-" + h + "px"
            });
          };
          return _.delay(callback, 200);
        case 9:
          this.updateStatus("Hanging up");
          return this.stopTimer();
        case 10:
          return this.updateStatus("Cancelling");
      }
    };

    return UI;

  })(Spine.Controller);

  window.UI = UI;

  testBrowser = function() {
    var args, majorVersion, msg, supported;

    $.browser.safari = $.browser.webkit && !(/chrome/.test(navigator.userAgent.toLowerCase()));
    majorVersion = parseInt($.browser.version, 10);
    if ($.browser.chrome && majorVersion >= 23) {
      msg = "Browser: Google Chrome (" + $.browser.version + ")";
      supported = true;
    } else if ($.browser.mozilla && majorVersion >= 19) {
      msg = "Browser: Firefox (" + $.browser.version + ")";
      supported = true;
    } else if ($.browser.chrome) {
      msg = "Browser not supported for now!: Google Chrome ( " + $.browser.version + ")";
    } else if ($.browser.safari) {
      msg = "Browser not supported for now!: Safari (" + $.browser.version + ")";
    } else if ($.browser.msie) {
      msg = "Browser not supported for now!: Internet Explorer (" + $.browser.version + ")";
    } else if ($.browser.mozilla) {
      msg = "Browser not supported for now!: Mozilla Firefox (" + $.browser.version + ")";
    } else if ($.browser.opera) {
      msg = "Browser not supported for now!: Opera (" + $.browser.version + ")";
    } else {
      msg = "Browser not supported: (" + $.browser.version + ")";
    }
    args = {
      message: {
        text: msg
      }
    };
    if ((supported != null) && !supported) {
      _.extend(args, {
        type: "danger"
      }, {
        fadeOut: {
          enabled: false
        }
      });
    }
    return $('#notifications').notify(args).show();
  };

  window.testBrowser = testBrowser;

  $(function() {
    var conf, ext;

    console.log("Ready!");
    if (window.testBrowser) {
      window.testBrowser();
    }
    conf = {
      mediaElements: {
        localMedia: $("#media-local"),
        remoteMedia: $("#media-remote")
      },
      el: "body"
    };
    new UI(conf);
    window.autoanswering = false;
    if (window.autoanswering) {
      ext = 1234;
      $("#user-reg").val(ext);
      $("#pass-reg").val(ext);
      return $("#register").click();
    }
  });

}).call(this);
