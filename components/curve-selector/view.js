define([

  'underscore'
  ,'lateralus'
  ,'shifty'

  ,'text!./template.mustache'

  ,'aenima.constant'

], function (

  _
  ,Lateralus
  ,Tweenable

  ,template

  ,aenimaConstant

) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var CurveSelectorComponentView = Base.extend({
    template: template

    ,lateralusEvents: {
      tweenableCurveCreated: function () {
        this.render();
      }
    }

    /**
     * @param {Object} [options] See http://backbonejs.org/#View-constructor
     * @param {boolean=} [options.onlyShowCustomCurves]
     */
    ,initialize: function () {
      baseProto.initialize.apply(this, arguments);
    }

    ,render: function () {
      var currentValue = this.$el.val();
      this.renderTemplate();
      this.$el.val(currentValue);
    }

    ,getTemplateRenderData: function () {
      var renderData = baseProto.getTemplateRenderData.apply(this, arguments);

      _.extend(renderData, {
        curves: this.getCurveList()
      });

      return renderData;
    }

    /**
     * @param {Array.<string>}
     */
    ,getCurveList: function () {
      var fullList = Object.keys(Tweenable.prototype.formula);
      return this.onlyShowCustomCurves ?
        fullList.filter(function (curve) {
          return curve.match(aenimaConstant.CUSTOM_CURVE_PREFIX);
        }) : fullList;
    }
  });

  return CurveSelectorComponentView;
});
