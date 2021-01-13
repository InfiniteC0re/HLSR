export default (friends, map = true, sort = false) => {
  if (map) {
    friends.map((friend) => {
      if (!friend.gamePlayed && friend.personaState > 0) friend.priority = 2;
      else if (friend.personaState == 0) friend.priority = 3;
      if (friend.appID == "70" && friend.friendRPC == "HLSR")
        friend.priority = -1;
      else if (friend.appID == "70") friend.priority = 0;
      else if (friend.priority == undefined) friend.priority = 1;
      // friend.priority = Math.round(Math.random() * 4) - 1;
    });
  }

  if (sort) {
    friends.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });
  }

  return friends;
};
