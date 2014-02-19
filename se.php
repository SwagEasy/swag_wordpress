<?php 

add_action( 'admin_menu', 'setup_se_menu' );
add_action('wp_footer', 'se_button_js');
add_se_shortcode();

function se_button_js () {
  $script = get_template_directory_uri() . '/swageasy/btn.js';
  echo '<script id="swagscript" subdomain="' . get_user_meta(get_current_user_id(), 'se_subdomain', true) . '" src="' . $script . '"></script>';
} 

function insert_se_button () {
  if(check_se_integration(get_current_user_id())) {
    return '<button class="swag-button no-store">Shop Now</button>';
  } else {
    return '<button class="swag-button">Shop Now</button>';
  }
}

function add_se_shortcode () {
  $tag = 'swageasy';
  $func = 'insert_se_button';
  add_shortcode( $tag , $func );
}


function setup_se_menu () {
  $pagetitle = 'SwagEasy - Your Online Store In 60 Seconds';
  $menu_item_title = 'SwagEasy';
  $iconpath = '';
  $position = 6;
  $slug = 'swageasy';
  $render_options = 'se_options'; // Function to render the options page
  $capabilities = 'manage_options';

  add_menu_page( $pagetitle, $menu_item_title, $capabilities, $slug, $render_options, $iconpath, $position ); 
}

function se_options () {
  $user_id = get_current_user_id();
  $stylesheet = get_template_directory_uri() . '/swageasy/css/se.css';
  $script = get_template_directory_uri() . '/swageasy/se.js';

  check_subdomain_getvar();

  // Render the options page
  echo "<link rel='stylesheet' href='" . $stylesheet . "'/>";
  echo "<div class='se-page'>";
  echo "<h1>SwagEasy - Your Online Store In 60 Seconds</h1>";
  
  se_buttons($user_id);

  echo "</div>";
  echo "<script src='" . $script . "'></script>";
}

function check_subdomain_getvar () {
  $err = error_reporting();
  error_reporting(0);
  $subdomain = $_GET['subdomain'];
  
  if (!isset($subdomain) || trim($subdomain)==='') {
    error_reporting($err);
    return false;
  } else {
    add_confirmation();
    add_se_data($subdomain);
  }
  error_reporting($err);
}

function check_se_integration ($user_id) {
  $subdomain = get_user_meta($user_id, 'se_subdomain', true);
  return (!isset($subdomain) || trim($subdomain)==='');
}

function add_confirmation () {
  echo '<label class="se-confirmed">';
  echo 'Your change was confirmed!';
  echo '</label>';
}

function add_se_data ($subdomain) {
  $user_id = get_current_user_id();
  $meta_key = 'se_subdomain';
  $meta_value = $subdomain;

  if(check_se_integration()){
    update_user_meta( $user_id, $meta_key, $meta_value );  
  } else {
    $sub = get_user_meta($user_id, 'se_subdomain', true);
    update_user_meta( $user_id, $meta_key, $meta_value , $sub);
  }
  
}


function se_buttons ($user_id) {
  $signup_link = 'http://swageasy-alpha.com/r/' . $GLOBALS['swageasy_affiliate_id'] . '/wordpress';
  $signin_link = '#';

  if (check_se_integration($user_id)) {
    echo "<a class='se-button' href='" . $signup_link . "'>Sign up with SwagEasy</a>";  
  } 
  else {
    echo '<form id="se-form" style=""><p>Enter your SwagEasy subdomain</p>';
    echo '<input type="text" name="subdomain" id="subdomain" placeholder="subdomain" value="' . get_user_meta($user_id, 'se_subdomain', true) . '">';
    echo '<label for="subdomain">.swageasy.com</label>';
    echo '<br><input type="submit" value="Set my subdomain"></form>';
  }
  

}

?>