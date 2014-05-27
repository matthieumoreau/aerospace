define([
  'jquery',
  'underscore',
  'backbone',
  'views/landing_page',
  'views/solar_system',
  'views/planet'
], function($, _, Backbone, LandingPageView, SolarSystemView, PlanetView){
  var AppRouter = Backbone.Router.extend({
    current_view : null,
    routes: {
      '': 'landingPage',
      'solar-system': 'solarSystem',
      'solar-system/:planet': 'planet',
      '*actions': 'default'
    },
    landingPage : function(){
      renderView.call(this, {
        view : new LandingPageView()
      });
    },
    solarSystem : function(){
      renderView.call(this, {
        view : new SolarSystemView()
      });
    },
    planet : function(planet){
      renderView.call(this, {
        view : new PlanetView(), 
        params : {
          'planet' : planet
        }
      });
    },
    default : function(actions){}
  });

  var initialize = function(){
    if(!localStorage.getItem('locale')) localStorage.setItem('locale', 'en');
    var app_router = new AppRouter;
    Backbone.history.start();
    return app_router;
  };

  var renderView = function(params_in){
    var params = {params : {}};
    $.extend(true, params, params_in);
    getTranslations.call(this, {
      callback : function(translations){
        
        // Callback of last view
        if(AppRouter.current_view && AppRouter.current_view.close)
           AppRouter.current_view.close.call(this, AppRouter.current_view); 

        AppRouter.current_view = params.view;
        AppRouter.current_view.render({
          translations : translations,
          params : params.params
        });
      }
    });
  }

  var getTranslations = function(params){
    var locale = localStorage.getItem('locale');
    $.getJSON('data/' + locale + '.json', function(translations){
      params.callback.call(this, translations);
    });
  };


  return {
    initialize: initialize
  };
});