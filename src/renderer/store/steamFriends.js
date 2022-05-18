import axios from "axios";

export default {
  getAvatars(list) {
    return new Promise(async (resolve, reject) => {
      let parser = new DOMParser();

      for (let i = 0; i < list.length; i++) {
        let id = list[i].friendID;

        try {
          const res = await axios.get(
            `https://steamcommunity.com/profiles/${id}?xml=1`
          );
          let doc = parser.parseFromString(res.data, "text/xml");

          list[i].avatarUrl = doc.querySelector("avatarMedium").textContent;
        } catch (e) {
          console.error(`Couldn't get an avatar of Steam User with id ${id}`);
        }
      }

      return resolve();
    });
  },
  sort(friends) {
    friends.map((friend) => {
      let gamePlayed = friend.friendGameInfo;
      let appId = gamePlayed ? gamePlayed.m_gameID : 0;

      if (!gamePlayed && friend.personaState > 0) friend.priority = 2;
      else if (friend.personaState == 0) friend.priority = 3;

      if (friend.friendRPC.includes("HLSR") && friend.personaState > 0)
        friend.priority = -1;
      else if (appId == "70") friend.priority = 0;
      else if (friend.priority == undefined) friend.priority = 1;
    });

    friends.sort((a, b) => {
      // sort by the priority
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;

      // sort alphabetically 
      if (a.personaName < b.personaName) return -1;
      if (a.personaName > b.personaName) return 1;
    });

    return friends.filter((x) => x.priority != 3);
  },
};
