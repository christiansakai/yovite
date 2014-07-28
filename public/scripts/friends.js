$(document).ready(function() {
  console.log('hello');
  var friendCount = 1;
  var addFriend = function() {
    friendCount++;
    var friend = "<input type=\"text\" class=\'form-control\' name=\"friends[]\" placeholder=\"Friend\'s Yo username\"" + " id='friend" + friendCount + "' data-validation='alphanumeric'" + "data-validation-help='example: NEPSTEIN'" + "required>";

    $('#add-friend-group').append(friend);
  }

  var removeFriend = function() {
    if (friendCount > 1) {
      var selector = "#friend" + friendCount;
      $(selector).remove();
      friendCount--;
    }
  };

  $('.glyphicon-plus').on('click', addFriend);

  $('.glyphicon-minus').on('click', removeFriend);
});





