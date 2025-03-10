import { connect } from 'react-redux';
import Confusion from './Confusion';
import { operations } from '../../store';

import '../../styles/Confusion.scss';
import '../../styles/Drill.scss';

const mapStateToProps = ({
  settings: { pronunciationType },
  sounds: {
    consonants,
    confusions,
    confusionLoaded,
    visibleConfusion,
    showConfusionByIndex,
  },
  view: { hintVisible },
}) => ({
  consonants,
  confusions,
  confusionLoaded,
  hintVisible,
  pronunciationType,
  visibleConfusion,
  showConfusionByIndex,
});
export default connect(mapStateToProps, operations)(Confusion);
