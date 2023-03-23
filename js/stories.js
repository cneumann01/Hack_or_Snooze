"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName(story.url);
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// Detects if the "favorite star" has already been clicked or not, and then calls the User method which updates the API accordingly.
function checkFavorite(evt) {
  const storyId = evt.target.closest("li").id;

  // Toggles favorite class on the star.
  $(evt.target).toggleClass("favorite");

  // Calls function which updates the API's favorite list, and also updates the star to be filled or unfilled.
  if ($(evt.target).hasClass("favorite")) {
    $(this).text("★");
    currentUser.toggleFavorite("add", storyId);
  } else {
    $(this).text("☆");
    currentUser.toggleFavorite("remove", storyId);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    // Adds favorite star and event listener for clicking it.
    const $star = $("<span class='favorite-star'>☆</span>");
    $star.prependTo($($story));
    $star.click(checkFavorite);

    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  currentUser.updateFavoriteStars();
}

// Loads favorites list when Favorites section in the nav bar is clicked. Displays message for user to add favorites if the list is empty.
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  if (currentUser.favorites.length === 0) {
    $noFavoritesLabel.show();
  } else {
    $favoriteStoriesList.empty();
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      const $star = $("<span class='favorite-star favorite'>★</span>");
      $star.prependTo($($story));
      $star.click(checkFavorite);
      $favoriteStoriesList.append($story);
    }
    $favoriteStoriesList.show();
  }
}

// Loads ownStories list when My Stories section in nav bar is clicked. Adds trash can icon next to each story which calls
// the User method deleteStory which removes it from the DOM/API if clicked.
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  if (currentUser.ownStories.length === 0) {
    $noStoriesLabel.show();
  } else {
    $myStoriesList.empty();
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      const $trash = $("<span class='trash-can'>&#x1F5D1;</span>");
      $trash.prependTo($($story));
      $trash.click((evt) => {
        const storyId = evt.target.closest("li").id;
        currentUser.deleteStory(storyId)
      });
      $myStoriesList.append($story);
    }
    $myStoriesList.show();
  }
}

// Gets new story from submit form and adds it to the page.
async function submitNewStory(e) {
  e.preventDefault();
  await storyList.addStory(currentUser, {
    title: $titleInput.val(),
    author: $authorInput.val(),
    url: $urlInput.val(),
  });
  $titleInput.val("");
  $authorInput.val("");
  $urlInput.val("");
  putStoriesOnPage();
}
$submitForm.on("submit", submitNewStory);
