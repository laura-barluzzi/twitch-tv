function displayHtml(logo, channel_name, description, url, status) {
  console.log("in displayHtml");
  console.log(description);
  console.log("current channel name is: " + channel_name);
  
  var html = '<a href="' + url + '" target="_blank"><div class="line ' + status +'"><img src="' + logo + '" class="logo img-responsive"><span id="name">' + channel_name + '</span><span id="streaming">' + description + '</span></div></a>';

  if (status === "online") {
    $("#display").prepend(html);
  } else {
    $("#display").append(html);
  } 
}

function handleStreamFetch(streamUrl, channelUrl, streamer) {
  return function(data) {
      var description, status;
      
      if (data.stream === null) {
        description = "offline";
        status = "offline";
      }  else {
        status = "online";
        description = data.stream.game + " - " + status;
      };
      
      $.getJSON(channelUrl, function(data) {
        var logo = data.logo;
        var name = data.display_name;
        
        if (name === undefined) {
            name = streamer;
            status = "offline";
            description = "This channel does not exist";
        }
     
        displayHtml(logo, name, description, data.url, status);
      });
    };
}

function getChannelsInfo() {
  console.log("in getChannelsInfo");
  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
  
  for (var i = 0; i < channels.length; i++) { 
    var streamUrl = "https://wind-bow.gomix.me/twitch-api/streams/" + channels[i] + "?callback=?";
    var channelUrl = "https://wind-bow.gomix.me/twitch-api/channels/" + channels[i] + "?callback=?";
    var streamer = channels[i];
    
    $.getJSON(streamUrl, handleStreamFetch(streamUrl, channelUrl, streamer));
  }; //for loop
}; // function getChannelsInfo

function filterView(event) {
  
  var clicked = $(event.target);  
  $(".list-item").removeClass("active");
  $(event.target).addClass("active");  
  var status = $(event.target).attr('id');
  
  if (status === "all") {
      $(".online, .offline").removeClass("hidden");
    } else if (status === "online") {
      $(".online").removeClass("hidden");
      $(".offline").addClass("hidden");
    } else {
      $(".offline").removeClass("hidden");
      $(".online").addClass("hidden");
    };  
};

$(document).ready(function() {
  console.log("in ready");
  getChannelsInfo();
  
  $(".list-item").click(filterView);
});