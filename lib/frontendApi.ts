import axios from "axios";

import {Coworker} from "../interfaces/CoworkerModel";

import mockData from '../mocks/1337api-v3-employees.json';

type CoworkersApiType = () => Promise<Coworker[]>
export const coworkersApi:CoworkersApiType = async () => {
  const {data} = await axios.get('/api/getCoworkers');

  return data;
}

export const mockCoworkersApi:CoworkersApiType = async () => {

  return mockData;
}
