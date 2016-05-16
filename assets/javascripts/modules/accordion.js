/**
  Accordion

  Expand/collapse content with optional row/column structure.

  Mandatory JS hooks:
   * `data-accordion` - main outer container hook to init accordion JS module
   * `data-accordion-button` - button clicked to expand/collapse 
   * `data-accordion-body` - the main body content to be expanded/collapsed
   * `data-accordion-animate` - animate body expansion/collapse
   * **BUG**: animate should be optional but currently the non-animate has a bug. Issue raised here: https://github.com/hmrc/assets-frontend/issues/553

  Optional JS hooks:
   * `data-accordion-arrow` - arrow icon element which will be animated on state change
   * `data-accordion-reveal` - non-body content to be revealed on expand
   * `data-accordion-set-hash` - will cause URL hash to be updated with ID of accordion upon expand
   * `data-accordion-expanded` - hard-code to expand on init, useful for server-side rendering

  Mandatory classes:
   * `accordion` - placed on the outer container
   * `accordion__button` - placed on the...yeah you guessed it...accordion button. Well done.
   * `accordion__body` - placed on the body of content which will expand/collapse
   * `accordion__row` - structural styling on the container of the accordion button

  Optional Classes:
   * `accordion__row__left` - left row contained in `accordion__row`
   * `accordion__indicator` - for arrow styling, used in conjunction with `arrow` component 
   * `accordion__row__right` - right row container in `accordion__row`
   * `accordion__body__row` - a row of content in the body
   * `accordion__body__row__left` - left column of body row
   * `accordion__body__row__right` - right column of body row

  Basic Usage:

  <div data-accordion
       data-accordion-animate
       aria-expanded="false"
       class="accordion">
    <div class="accordion__row">
      <div class="accordion__row__left">                
        <a class="accordion__button link--no-underline bold-small" href="" data-accordion-button role="button">
          Accordion Button
        </a>
      </div>
      <div class="accordion__row__right align--top">
        <p class="font-xsmall flush--top">Top right content</p>
      </div>
    </div>
    <div class="accordion__body hidden" data-accordion-body aria-hidden="true">
      <p>Accordion body</p>
    </div>
  </div>

  More details on usage can be found in the component library.

 */


module.exports = function() {

  // for each accordion in the page
  $('[data-accordion]').each(function() {

    var $accordion    = $(this),
        $button       = $accordion.find('[data-accordion-button]'),
        $body         = $accordion.find('[data-accordion-body]'),
        $arrow        = $accordion.find('[data-accordion-arrow]'),
        expandedClass = 'accordion--expanded';
    
    // hide any elements flagged to be revealed only on expand
    $accordion.find('[data-accordion-reveal]').addClass('hidden');

    // accordion links behave as expand/collapse buttons
    $button.attr('role', 'button');

    // tell screen-readers that button controls content
    $button.attr('aria-controls', $body.attr('id'));

    // expand any accordions that have been flagged
    if($accordion.is('[data-accordion-expanded]') || isAnchored($accordion)) {
      expand($accordion, $body, $arrow, expandedClass, false);
    }

    // bind accordion click
    $button.click(function(e) {
      buttonClick(e, $accordion);
    });

  });

  /**
   * Triggered on click of accordion for expand/collapse of body
   * 
   * @param  {Object} e            event object
   * @param  {Object} $accordion   jQuery object of accordion element
   */
  function buttonClick(e, $accordion) {

    var $body         = $accordion.find('[data-accordion-body]'),
        $arrow        = $accordion.find('[data-accordion-arrow]'),
        expandedClass = 'accordion--expanded',
        animate       = $accordion.is('[data-accordion-animate]');

    e.preventDefault();

    // if accordion is collapsed
    if($body.hasClass('hidden')) {
      expand($accordion, $body, $arrow, expandedClass, animate);
    }
    // if accordion is expanded
    else {
      collapse($accordion, $body, $arrow, expandedClass, animate);
    }

  }

  /**
   * Return whether or not an accordion is anchored to in URL
   *
   * @param    $accordion     jQuery object of accordion element
   * @returns  {boolean}      whether or not id and hash match
     */
  function isAnchored($accordion) {

    // get accordion's ID
    var id = $accordion.attr('id');

    // get hash from url
    var hash = location.hash.substring(1);

    return id === hash;

  }

  /**
   * Expand Accordion
   * 
   * @param  {Object} $accordion    jQuery object of accordion element
   * @param  {Object} $body         jQuery object of accordion body (expanded section)
   * @param  {Object} $arrow        jQuery object of accordion arrow 
   * @param  {String} expandedClass Class to handle visual differences in expand/collapse states
   * @param  {Boolean} animate      To animate or not, that is the question
   */
  function expand($accordion, $body, $arrow, expandedClass, animate) {

    // height of accordion body once expanded
    var newHeight = getHeight($body);

    // set class to handle subtle style differences (borders)
    $accordion.addClass(expandedClass);

    // update aria expanded state
    $accordion.attr('aria-expanded', true);

    // animates arrow to pointing down state
    $arrow.addClass('arrow--expand');

    // reveal any elements flagged as such
    $accordion.find('[data-accordion-reveal]').removeClass('hidden');

    // ensure first element of right row has margin for content below it
    $accordion
      .find('.accordion__row__right')
      .children()
      .first()
      .addClass('flush--top')
      .removeClass('flush');

    // body must be height 0 and visible before expanding 
    $body.height(0).removeClass('hidden');

    // make body visible to screen-readers
    $body.attr('aria-hidden', false);

    if(animate) {

      // animate expand to new height
      $body.animate({
        height: newHeight        
      }, 200, function() {
        $accordion.addClass(expandedClass);
        $body.css({height: 'auto'});
      });

    }
    else {
      $accordion.addClass(expandedClass);
      $body.height(newHeight);
      $body.css({height: 'auto'});
    }

    // if configured to update url hash
    if($accordion.is('[data-accordion-set-hash]')) {
      updateHash($accordion);
    }

  }

  /**
   * Collapse Accordion
   * 
   * @param  {Object} $accordion    jQuery object of accordion element
   * @param  {Object} $body         jQuery object of accordion body (expanded section)
   * @param  {Object} $arrow        jQuery object of accordion arrow 
   * @param  {String} expandedClass Class to handle visual differences in expand/collapse states
   * @param  {Boolean} animate      To animate or not, that is the question
   */
  function collapse($accordion, $body, $arrow, expandedClass, animate) {

    var expandedHeight = $body.height(),
        newHeight      = 0;

    $arrow.removeClass('arrow--expand'); 

    // update aria expanded state
    $accordion.attr('aria-expanded', false);

    $accordion.find('[data-accordion-reveal]').addClass('hidden');

    $accordion
      .find('.accordion__row__right')
      .children()
      .first()
      .removeClass('flush--top')
      .addClass('flush');

    // make body hidden to screen-readers
    $body.attr('aria-hidden', true);

    if(animate) {

      $body.animate({
        height: newHeight        
      }, 200, function() {

        // adjust borders
        $accordion.removeClass(expandedClass);

        // hide body and restore height to 0 for next expand
        $body.addClass('hidden').height(expandedHeight);        

      });

    }
    else {

      // adjust borders
      $accordion.removeClass(expandedClass);

      // collapse accordion body
      $body.height(newHeight);

    }

  }

  /**
   * Update URL hash based on selected accordion
   *
   * @param $accordion     jQuery object of accordion element
     */
  function updateHash($accordion) {

    // get id of accordion which contains unique accordion name
    var hashVal = $.trim($accordion.attr('id'));

    if(history.replaceState) {
      history.replaceState(null, null, '#' + hashVal);
    }
    else {
      // warning: for older browsers, this causes the accordion to be scrolled to
      location.hash = hashVal;
    }

  }

  /**
   * Helper to get actual height of element 
   * 
   * @param  {Object} $element jQuery object of element 
   * @return {Number} height   height of element
   */
  function getHeight($element) {

    var height = $element.removeClass('hidden').height();

    $element.addClass('hidden');

    return height;

  }

};

