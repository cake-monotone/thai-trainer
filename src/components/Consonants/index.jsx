import { connect } from 'react-redux';
import { operations } from '../../store';
import Consonants from './Consonants';

import '../../styles/Consonants.scss';

const mapStateToProps = ({
  settings: { pronunciationType },
  sounds: { consonantKeys, consonants, visibleConsonantKey },
}) => ({
  consonantKeys,
  consonants,
  pronunciationType,
  visibleConsonantKey,
});

export default connect(mapStateToProps, operations)(Consonants);
