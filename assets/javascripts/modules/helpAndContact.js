require('jquery');

module.exports = function() {

  var contactHmrc = '/contact-hmrc',
    baseUrlRegex = new RegExp(contactHmrc + '.*'),

  updateSelectedMenuItem = function(selected) {
    $('.menu__list li').removeClass('menu__list-item--selected');
    var selectedLi = $('.menu__list a[href*='+selected+']').closest('li');
    selectedLi.addClass('menu__list-item--selected');
  },

  updateHistory = function(selected) {
    var baseUrl = window.location.href.replace(baseUrlRegex, '');
    var newUrl = baseUrl + contactHmrc + '/' + selected;
    history.pushState(selected, null, newUrl);
  },

  updateHelpContent = function(partial) {
    var ajaxUrl = '/account/contact-hmrc/partial/'+partial;
    var $contentPane = $('.help-content');
    $contentPane.load(ajaxUrl, function(response, status, xhr) {
      updateSelectedMenuItem(partial);
    });
  },

  supportsHistoryApi = function() {
    return !!(window.history && history.pushState);
  },

  init = function() {

    // 'Jump links' to timed points in video replace the iframe contents
    $('.youtube-link').click(function(e) {
      e.preventDefault();
      var $videoIframe = $('#video-iframe');
      var iframeUrl = $(this).attr('href').replace(/.*\//, 'https://www.youtube.com/embed/');
      if (iframeUrl) {
        $videoIframe.attr('src', iframeUrl);
      }
    });

    // Allow Ajax help menu switching
    $('.help-partial-link').click(function(e) {
      if (supportsHistoryApi()) {
        e.preventDefault();
        var partial = $(this).attr('href').replace(/.*\//, '');
        updateHelpContent(partial);
        updateHistory(partial);
      }
    });

    // Enable history API functionality for menu item changes
    window.addEventListener('popstate', function(e) {
      if (window.location.pathname.indexOf(contactHmrc) > -1) {
        updateHelpContent(e.state);
      }
    });
  };

  return {
    init: init
  };
};
