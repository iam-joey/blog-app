import axios from "axios";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

export const userData = atomFamily({
  key: "userAtom",
  default: selectorFamily({
    key: "fetchingData",
    get: function (token) {
      return async function ({ get }) {
        const res = await axios.get(
          "https://backend.yerradarwin.workers.dev/api/v1/auth/user/me",
          {
            headers: {
              //@ts-ignore
              Authorization: token,
            },
          }
        );

        return res.data.data;
      };
    },
  }),
});
