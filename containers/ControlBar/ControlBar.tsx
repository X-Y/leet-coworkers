import ControlBarContainer from "../../components/ControlBarContainer/ControlBarContainer";
import Sort from '../Sort/Sort';
import Filter from '../Filter/Filter';

const ControlBar = () => {
  return <ControlBarContainer>
    <Sort />
    <Filter />
  </ControlBarContainer>
}

export default ControlBar;
