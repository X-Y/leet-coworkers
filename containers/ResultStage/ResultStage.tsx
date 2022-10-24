import { Button } from "@mantine/core";

import { GAME_ACTIONS } from "../../interfaces/Game";
import type {
  GameDispatch,
  GameState,
} from "../../reducers/gameReducer/gameReducer";

import CoworkersList from "../../components/CoworkersList/CoworkersList";
interface ResultStageProps {
  gameState: GameState;
  gameDispatch: GameDispatch;
}

const ResultStage: React.FC<ResultStageProps> = ({
  gameState,
  gameDispatch,
}) => {
  const { entries, answers, score } = gameState;

  const onClick = () => {
    gameDispatch({ type: GAME_ACTIONS.RESTART });
  };

  return (
    <div>
      done!
      <ul>
        {entries.map((one, idx) => (
          <li key={one.name}>
            <CoworkersList coworkers={[one]} />

            {answers[idx][1] ? (
              <div>Correct!</div>
            ) : (
              <div>Your answer: {answers[idx][0]} is not correct </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        {score} / {entries.length}
      </div>
      <Button onClick={onClick}>next</Button>
    </div>
  );
};

export default ResultStage;
