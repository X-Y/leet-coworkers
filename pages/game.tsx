import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {useQuery} from 'react-query';

import {Coworker} from "../interfaces/CoworkerModel";

import {coworkersApi} from "../lib/frontendApi";

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
type Answer = [string, boolean];

const iniGameState = {
  step: GAME_STATES.MENU,
  score: 0,
  amount: 10,
  confusions: 2,
  entries: [] as Entry[],
  answers: [] as Answer[],
}

type GameAction = 
  | { type: GAME_ACTIONS.CONFIGS_DONE; payload: {entries: Entry[]}}  
  | { type: GAME_ACTIONS.START; }
  | { type: GAME_ACTIONS.END; payload: {answers: Answer[]; score: number}}
  | { type: GAME_ACTIONS.RESTART; }

const gameStateReducer = (state: typeof iniGameState, action:GameAction) => {
  switch(action.type) {
    case GAME_ACTIONS.CONFIGS_DONE:
      return {...state, step: GAME_STATES.MEMORY, score: 0, entries: action.payload.entries};
    case GAME_ACTIONS.START:
      return {...state, step: GAME_STATES.PLAY};
    case GAME_ACTIONS.END:
      return {...state, step: GAME_STATES.RESULT, score: action.payload.score, answers: action.payload.answers};
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

  const { status, data, error, isFetching } = useQuery<Coworker[]>('getCoworkers', coworkersApi, {
    staleTime: 60000
  });

  let resData = data;
  resData = useFilter(resData);
  resData = useSort(resData);


  const onConfigsDoneClick = () => {
    const resDataConst = resData;
    if(!resDataConst) return ;

    const entries:Entry[] = resDataConst
      .filter((one) => !!one.imagePortraitUrl )
      .sort(() => 0.5-Math.random())
      .slice(0, gameState.amount)
      .map(one => {
        let confuses: string[] = [];
        while(confuses.length < gameState.confusions) {
          const confuse = resDataConst[Math.round(Math.random() * (resDataConst.length-1))];
          if(confuses.findIndex(name => name === confuse.name) === -1) {
            confuses.push(confuse.name)
          }
        }
          
        const options = [one.name, ...confuses].sort(() => 0.5-Math.random());

        return {
          ...one,
          options
        };
      });

    gameDispatch({type: GAME_ACTIONS.CONFIGS_DONE, payload: {entries}});
  }

  const onGameStartClick = () => {
    gameDispatch({type: GAME_ACTIONS.START});

  }

  const calculateScore = (answersOrig: string[], entries: Entry[]) => {
    let score = 0;
    const result = entries.reduce((prev, curr, idx) => {
      const currentAnswer = answersOrig[idx]
      let isCorrect = false;
      if(curr.name === currentAnswer) {
        score += 1;
        isCorrect = true;
      }

      return [...prev, [currentAnswer, isCorrect] as Answer];
    }, [] as Answer[]);
    return [score, result] as [number, Answer[]];
  }
  const onPlayDone = (answers: string[]) => {
    const [score, correctedAnswers] = calculateScore(answers, gameState.entries);
    gameDispatch({type: GAME_ACTIONS.END, payload: {score, answers: correctedAnswers}});
  }
  const onResultDone = () => {
    gameDispatch({type: GAME_ACTIONS.RESTART});
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
          <PlayStage entries={gameState.entries} onDone={onPlayDone} />
        </>
      }

      {
        gameState.step === GAME_STATES.RESULT &&
        <>
          <ResultStage 
            entries={gameState.entries} 
            answers={gameState.answers} 
            score={gameState.score} 
            onDone={onResultDone}
            />
        </>
      }
    </div>
  )
}

interface PlayStageProps {
  entries: Entry[];
  onDone: (answers: string[]) => void;
}
const PlayStage:React.FC<PlayStageProps> = ({entries, onDone}) => {
  const [answers, setAnswers] = useState([] as string[]);
  const [current, setCurrent] = useState(0);
  
  const setAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers(prev => [...prev, e.target.value]);
    setCurrent(prev => prev + 1);
  }

  useEffect(() => {
    if(current >= entries.length) {
      onDone(answers);
    }
  }, [current])

  const currentCoworker = entries[Math.min(current, entries.length-1)];
  const {options, imagePortraitUrl} = currentCoworker;
  const coworker = {imagePortraitUrl} as Coworker;

  return <div>
    <CoworkersList coworkers={[coworker]} />

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

interface ResultStageProps {
  entries: Entry[];
  answers: Answer[];
  score: number;
  onDone: () => void;
}

const ResultStage:React.FC<ResultStageProps> = ({entries, answers, score, onDone}) => {
  return <div>
    done!
    <ul>
      {
        entries.map((one, idx) => (<li key={one.name}>
          <CoworkersList coworkers={[one]} />

          {
            answers[idx][1] ?
              <div>Correct!</div> :
              <div>Your answer: {answers[idx][0]} is not correct </div>
          }
          
        </li>))
      }
    </ul>
    <div>
      {score} / {entries.length}
    </div>
    <button onClick={onDone}>next</button>
  </div>
}

export default Game
