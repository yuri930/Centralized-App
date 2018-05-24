import { airdropInfo } from './actionTypes';

export function setAirdropInfo(email, facebookProfile, telegramProfile, twitterProfile, redditProfile) {
  return {
    type: airdropInfo.SET_AIRDROP_INFO,
    email,
    facebookProfile,
    telegramProfile,
    twitterProfile,
    redditProfile,
  };
}