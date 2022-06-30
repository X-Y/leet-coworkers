import axios from "axios";

import {Coworker} from "../interfaces/CoworkerModel";

type CoworkersApiType = () => Promise<Coworker[]>
export const coworkersApi:CoworkersApiType = async () => {
  const {data} = await axios.get('/api/getCoworkers');

  return data;
}
