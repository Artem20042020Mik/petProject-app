import api from "./axios.js";

export const getProfile = () => {return api.get("api/profile");}
export const getBossData = () => {return api.get("api/boss-panel");}