define([

  'underscore'
  ,'lateralus'

  ,'rekapi'

  ,'../../constant'

], function (

  _
  ,Lateralus

  ,Rekapi

  ,constant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var HidableComponentView = Base.extend({
    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     * @param {boolean=} [options.startHidden]
     * @param {number=} [options.targetShowOpacity]
     */
    initialize: function (options) {
      baseProto.initialize.apply(this, arguments);
      this.isHidden = !!options.startHidden;
      this.targetShowOpacity = options.targetShowOpacity || 1;

      if (this.isHidden) {
        this.hideCallback();
      }

      this.actor = (new Rekapi(this.el)).addActor({
        context: this.el
      });
    }

    // TODO: Refactor this and quickShow
    /**
     * @param {Function} [callback]
     */
    ,hide: function (callback) {
      if (this.isHidden || this.actor.rekapi.isPlaying()) {
        return;
      }

      this.actor
        .removeAllKeyframes()
        .keyframe(0, {
          scale: 1
          ,opacity: this.targetShowOpacity
        }).keyframe(constant.HIDABLE_VIEW_TRANSITION_DURATION, {
          scale: 0
          ,opacity: 0
        }, {
          scale: 'easeInBack'
          ,opacity: 'easeOutQuad'
        });

      var onStop = function () {
        (callback || _.noop)();
        this.hideCallback();
        this.actor.rekapi.off('stop', onStop);
      }.bind(this);

      this.actor.rekapi.on('stop', onStop);

      this.actor.rekapi.play(1);
    }

    /**
     * @param {Function} [callback]
     */
    ,quickHide: function (callback) {
      if (this.isHidden || this.actor.rekapi.isPlaying()) {
        return;
      }

      this.actor
        .removeAllKeyframes()
        .keyframe(0, {
          scale: 1
          ,opacity: this.targetShowOpacity
        }).keyframe(constant.HIDABLE_VIEW_TRANSITION_QUICK_DURATION, {
          scale: 0
          ,opacity: 0
        }, {
          scale: 'easeOutQuad'
          ,opacity: 'easeOutQuad'
        });

      var onStop = function () {
        (callback || _.noop)();
        this.hideCallback();
        this.actor.rekapi.off('stop', onStop);
      }.bind(this);

      this.actor.rekapi.on('stop', onStop);

      this.actor.rekapi.play(1);
    }

    // TODO: Refactor this and quickShow
    ,show: function () {
      if (!this.isHidden || this.actor.rekapi.isPlaying()) {
        return;
      }

      this.$el.css('display', '');

      this.actor
        .removeAllKeyframes()
        .keyframe(0, {
          scale: 0
          ,opacity: 0
        }).keyframe(constant.HIDABLE_VIEW_TRANSITION_DURATION, {
          scale: 1
          ,opacity: this.targetShowOpacity
        }, {
          scale: 'swingTo'
          ,opacity: 'easeInQuad'
        });

      var onStop = function () {
        this.isHidden = false;
        this.actor.rekapi.off('stop', onStop);
      }.bind(this);

      this.actor.rekapi.on('stop', onStop);

      this.actor.rekapi.play(1);
    }

    ,quickShow: function () {
      if (!this.isHidden || this.actor.rekapi.isPlaying()) {
        return;
      }

      this.$el.css('display', '');

      this.actor
        .removeAllKeyframes()
        .keyframe(0, {
          scale: 0
          ,opacity: 0
        }).keyframe(constant.HIDABLE_VIEW_TRANSITION_QUICK_DURATION, {
          scale: 1
          ,opacity: this.targetShowOpacity
        }, {
          scale: 'easeInQuad'
          ,opacity: 'easeInQuad'
        });

      var onStop = function () {
        this.isHidden = false;
        this.actor.rekapi.off('stop', onStop);
      }.bind(this);

      this.actor.rekapi.on('stop', onStop);

      this.actor.rekapi.play(1);
    }

    ,hideCallback: function () {
      this.$el.css('display', 'none');
      this.isHidden = true;
    }

    ,toggle: function () {
      this[this.isHidden ? 'show' : 'hide']();
    }
  });

  return HidableComponentView;
});
