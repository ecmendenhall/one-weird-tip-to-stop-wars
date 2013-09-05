(function() {

  function geolocation_enabled() {
    return geoPosition.init();
  }

  function show_backup_div() {
    $('#representatives').empty();
    $('#backup').removeClass('hidden');
  }

  function coord_api_url(latitude, longitude) {
    var api_key = "aabf309dff6043ff9ab1eb4bb01cf9c9";
    var api_url = "http://congress.api.sunlightfoundation.com";
    var location_path = "/legislators/locate";
    var api_query = "apikey=" + api_key;
    var location_query = "&latitude=" + latitude + "&longitude=" + longitude;
    var query_string = "?" + api_query + location_query;
    return api_url + location_path + query_string;
  }

  function zip_api_url(zip) {
    var api_key = "aabf309dff6043ff9ab1eb4bb01cf9c9";
    var api_url = "http://congress.api.sunlightfoundation.com";
    var location_path = "/legislators/locate";
    var api_query = "apikey=" + api_key;
    var location_query = "&zip=" + zip; 
    var query_string = "?" + api_query + location_query;
    return api_url + location_path + query_string;
  }

  function get_full_name(result) {
    return result.title + ". " + result.first_name + " " + result.last_name;
    
  }

  function get_twitter_link(result) {
    return "http://twitter.com/" + result.twitter_id;
  }

  function get_facebook_link(result) {
    return "http://facebook.com/" + result.facebook_id;
  }

  function make_name_link(result) {
    return $('<a>', {
      class: "rep-name",
      text: "Contact " + get_full_name(result) + ":",
      href: result.contact_form
    });
  }

  function make_phone_link(result) {
    return $('<a>', {
      class: "rep-phone",
      text: "Phone: " + result.phone,
      href: "tel:" + result.phone
    });}
  
  function make_contact_link(result) {
    return $('<a>', {
      class: "rep-contact-form",
      text: "Send a message",
      href: result.contact_form
    });}
  
  function make_twitter_link(result) {
    if (result.twitter_id) {
      return $('<a>', {
        class: "rep-twitter",
        text: "Twitter",
        href: get_twitter_link(result)
      });
    } else {
      return $('<a>');
    }
  }

  function make_facebook_link(result) {
    if (result.twitter_id) {
      return $('<a>', {
        class: "rep-facebook",
        text: "Facebook",
        href: get_facebook_link(result)
      });
    } else {
      return $('<a>');
    }
  }

  function make_infobox(result) {
    var box = $('<div>', {
      class: "col-lg-4 infobox",
    });

    var links = [ make_name_link(result),
                  make_phone_link(result),
                  make_contact_link(result),
                  make_twitter_link(result),
                  make_facebook_link(result) ]

    for (var i=0; i < links.length; i++) {
      var link = links[i];                                   
      var new_p = $('<p>').append(link);
      box.append(new_p);
    }
    return box;
  }
    

  function make_representatives_div(data) {
    var rep_data = data.responseJSON;
    var results = rep_data.results;

    if (results.length < 1) {
      show_backup_div();
      return;
    }

    var div = $('<div>', { class: "contact-info" });

    for (var i=0; i < results.length; i++) {
      var result = results[i];
      var infobox = make_infobox(result);
      div.append(infobox);
    }
    $('#representatives').empty();
    $('#backup').addClass('hidden');
    $('#representatives').append(div);
  }

  function representatives_by_coordinate(latitude, longitude) {
    var api_url = coord_api_url(latitude, longitude);
    $.ajax(api_url, {
      complete: make_representatives_div,
      error: function(e) { show_backup_div;}
      });
  }
  
  function representatives_by_zip(zip) {
    var api_url = zip_api_url(zip);
    $.ajax(api_url, {
      complete: make_representatives_div,
      error: function(e) { show_backup_div;}
      });
  }

  function find_representatives(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var reps = representatives_by_coordinate(lat, lon);
  }

  function get_location() {
    geoPosition.getCurrentPosition(find_representatives, show_backup_div);
  }

  function show_representatives() {
    geolocation_enabled();
    var position = get_location();
    find_representatives(position);
  }

  function show_representatives_by_zip() {
    var zip = $('#zip').val();
    representatives_by_zip(zip);
    return false;
  }

  function add_search_listener() {
    $('#zip-form').submit(show_representatives_by_zip);
  }

  function show_zip_search() {
    $('#zip-form').removeClass('hidden');
    add_search_listener();
  }

  function add_show_zip_listener() {
    $('#by-zip').click(show_zip_search);
  }

  function init() {
    add_show_zip_listener();
    show_representatives();
  }

  $(init)})
  ();

