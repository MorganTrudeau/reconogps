import * as functions from "firebase-functions";
import { login, refreshToken } from "./auth";

const TOKEN_EXPIRY = 3600000;

const {
  auth: { account, password },
} = functions.config();

let authSession: AuthSession;
export const getAuthSession = () => {
  if (!authSession) {
    authSession = new AuthSession();
  }
  return authSession;
};

class AuthSession {
  MajorToken = "";
  MinorToken = "";
  Expiry = 0;

  // constructor() {
  //   this.init();
  // }

  // async init() {
  //   try {
  //     await this.startSession();
  //   } catch (error) {
  //     console.log("Failed to init auth sesson: ", error);
  //   }
  // }

  async startSession() {
    const { MajorToken, MinorToken } = await login(account, password);

    this.MajorToken = MajorToken;
    this.MinorToken = MinorToken;
    this.Expiry = Date.now() + TOKEN_EXPIRY;

    console.log("Session init success");
  }

  async refresh() {
    if (!(this.MajorToken && this.MinorToken)) {
      throw "no_session";
    }

    const { MajorToken, MinorToken } = await refreshToken(
      this.MajorToken,
      this.MinorToken
    );

    this.MajorToken = MajorToken;
    this.MinorToken = MinorToken;
    this.Expiry = Date.now() + TOKEN_EXPIRY;

    console.log("Session refresh success");
  }

  async getSession() {
    if (!(this.MajorToken && this.MinorToken)) {
      await this.startSession();
    } 
    // else if (Date.now() > this.Expiry) {
    //   try {

    //   } catch(error) {

    //   }
    //   await this.refresh();
    // }
    return { MajorToken: this.MajorToken, MinorToken: this.MinorToken };
  }
}
