"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */


function checkForLoggedInUser(clickEvent) {
  if (!currentUser) {
    const pageName = clickEvent.currentTarget.innerText
    $pleaseLoginLabel.text(`Please login to use the ${pageName} page.`);
    $pleaseLoginLabel.show();
    return false;
  } else {
    return true;
  }
}

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);

// Show submit new story form on click on Submit Story
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  if (checkForLoggedInUser(evt)) {
    $submitForm.show();
    putStoriesOnPage();
  }
}
$navSubmit.on("click", navSubmitClick);

// Show favorited stories on click on Favorites
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  if (checkForLoggedInUser(evt)) {
    putFavoritesOnPage()
  }
}
$navFavorites.on("click", navFavoritesClick);

// Show my stories on click on My Stories
function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  if (checkForLoggedInUser(evt)) {
    putMyStoriesOnPage();
  }
}
$navMyStories.on("click", navMyStoriesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
