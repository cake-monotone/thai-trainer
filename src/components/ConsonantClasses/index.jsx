import { connect } from 'react-redux';
import { operations } from '../../store';
import ConsonantClasses from './ConsonantClasses';

import '../../styles/ConsonantClasses.scss';
import '../../styles/Hint.scss';

const mapStateToProps = ({ sounds: { confusions },  tones: { tonesmap }, view: { hintVisible }}) => ({
    confusions,
    hintVisible,
    tonesmap
});

export default connect(mapStateToProps, operations)(ConsonantClasses);
