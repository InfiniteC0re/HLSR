export default (friends, map = true, sort = false) => {
  if (map) {
    friends.map((friend) => {
      let gamePlayed = friend.friendGameInfo;
      let appId = 0;

      if (gamePlayed)
        appId = gamePlayed.m_gameID

      if (!gamePlayed && friend.personaState > 0) {
        friend.priority = 2;
      }
      else if (friend.personaState == 0) friend.priority = 3;
      
      if (friend.friendRPC.includes("HLSR") && friend.personaState > 0)
        friend.priority = -1;
      else if (appId == "70") friend.priority = 0;
      else if (friend.priority == undefined) friend.priority = 1;
    });
  }

  if (sort) {
    friends.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });
  }

  return friends
    .filter((f) => f.priority != 3)
    .filter(
      (g, index, self) =>
        index ===
        self.findIndex((t) => t.friendID === g.friendID)
    );
};
