export default (friends) => {
  friends.map((friend) => {
    if (!friend.gamePlayed && friend.personaState > 0) friend.priority = 2;
    else if (friend.personaState == 0) friend.priority = 3;
    if (friend.appID == "70" && friend.friendRPC == "HLSR")
      friend.priority = -1;
    if (friend.appID == "70") friend.priority = 0;
    if (friend.priority == undefined) friend.priority = 1;
  });

  friends.sort((a, b) => {
    if (a.priority < b.priority) return -1;
    if (a.priority > b.priority) return 1;
    return 0;
  });

  return friends;
};
