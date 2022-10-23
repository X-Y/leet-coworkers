import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useQuery} from 'react-query';

import {Coworker} from "../interfaces/CoworkerModel";

import {coworkersApi, mockCoworkersApi} from "../lib/frontendApi";

import {FILTER_BY, FilterContext} from "../contexts/FilterContext/FilterContext";

import Filter from "../containers/Filter/Filter";

import CoworkerComp from '../components/Coworker/Coworker';

import CoworkersList from '../components/CoworkersList/CoworkersList';

import styles from '../styles/Home.module.scss'
import {useContext, useEffect, useReducer, useState} from "react";
import ControlBar from "../containers/ControlBar/ControlBar";
import {useSort} from "../hooks/useSort";
import {useFilter} from "../hooks/useFilter";

enum GAME_STATES {
  MENU,
  MEMORY,
  PLAY,
  RESULT
}

enum GAME_ACTIONS {
  CONFIGS_DONE,
  START,
  END,
  RESTART,
}

const gameCities = [
  'Borlänge','Helsingborg','Ljubljana','Lund', 'Stockholm',
  '(Borlänge|Stockholm)',
  '(Helsingborg|Lund)',
  '(Borlänge|Stockholm|Helsingborg|Lund)',

]

type Entry = Coworker & {
  options: string[]
}

const iniGameState = {
  step: GAME_STATES.MENU,
  score: 0,
  amount: 10,
  entries: [] as Entry[],
}

interface Payload {
  score?: number;
  entries?: Entry[];
}
interface GameAction {
  type: GAME_ACTIONS;
  payload?: Payload;
}
const gameStateReducer = (state: typeof iniGameState, action:GameAction) => {
  switch(action.type) {
    case GAME_ACTIONS.CONFIGS_DONE:
      return {...state, step: GAME_STATES.MEMORY, score: 0, entries: action?.payload?.entries};
    case GAME_ACTIONS.START:
      return {...state, step: GAME_STATES.PLAY};
    case GAME_ACTIONS.END:
      return {...state, step: GAME_STATES.RESULT, score: action?.payload?.score};
    case GAME_ACTIONS.RESTART:
      return iniGameState;
  }
}

const Game: NextPage = () => {
  const { setFilterBy, setFilterValue } = useContext(FilterContext);
  const [gameState, gameDispatch] = useReducer(gameStateReducer, iniGameState);

  useEffect(() => {
    setFilterBy(FILTER_BY.CITY);
    setFilterValue('Borlänge')
  }, [])

  const { status, data, error, isFetching } = useQuery<Coworker[]>('getCoworkers', mockCoworkersApi, {
    staleTime: 60000
  });

  let resData = data;
  resData = useFilter(resData);
  resData = useSort(resData);


  const onConfigsDoneClick = () => {
    if(!resData) return ;

    const entries:Entry[] = resData.sort(() => 0.5-Math.random()).slice(0, gameState.amount);
    entries.forEach(one => {
      let confuse:Coworker;
      do {
        confuse = resData[Math.round(Math.random() * (resData.length-1))];
      } while(confuse?.name === one.name)
        
      one.options = [one.name, confuse.name].sort(() => 0.5-Math.random());
    })

    console.log(entries.map(({name, options}) => ({name, options})))
    gameDispatch({type: GAME_ACTIONS.CONFIGS_DONE, payload: {entries}});
  }

  const onGameStartClick = () => {
    gameDispatch({type: GAME_ACTIONS.START});

  }

  return (
    <div className={styles.container}>
      {!resData &&
        <div>Loading...</div>
      }

      {
        gameState.step === GAME_STATES.MENU &&
        <>
          <Filter cities={gameCities} />
          <button onClick={onConfigsDoneClick}>Start</button>
        </>
      }

      {
        gameState.step === GAME_STATES.MEMORY &&
        <>
          <CoworkersList coworkers={gameState.entries} />
          <button onClick={onGameStartClick}>Next</button>
        </>
      }

      {
        gameState.step === GAME_STATES.PLAY &&
        <>
          <PlayStage entries={gameState.entries} />
        </>
      }

    </div>
  )
}

interface PlayStageProps {
  entries: Entry[]
}
const PlayStage:React.FC<PlayStageProps> = ({entries}) => {
  const [answers, setAnswers] = useState([] as string[]);
  const [current, setCurrent] = useState(0);
  
  const setAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setAnswers(prev => [...prev, e.target.value]);
    setCurrent(prev => prev + 1);
  }

  if(current < entries.length) {
    const currentCoworker = entries[current];
    const {options} = currentCoworker;
  
    return <div>
      <CoworkersList coworkers={[currentCoworker]} />
  
      <ul>
        {
          options.map((option, idx) => {
            return <li key={current*1000 + idx}>
              <label>
                <input type='radio' name='entry-option' value={option} onChange={setAnswer}/>
                {option}
              </label>
            </li>
          })
        }
      </ul>
    </div>
  }
  console.log(answers)
  const score = entries.reduce((prev, curr, idx) => {
    if(curr.name === answers[idx]) {
      return prev + 1;
    }
    return prev;
  }, 0)
  return <div>
    done!
    <ul>
      {
        entries.map((one, idx) => (<li key={one.name}>
          {one.name} {answers[idx]}
        </li>))
      }
    </ul>
    <div>
      {score} / {entries.length}
    </div>
    <button>next</button>
    
  </div>
}

export default Game
