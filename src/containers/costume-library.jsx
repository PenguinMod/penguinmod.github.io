import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';

import {getCostumeLibrary} from '../lib/libraries/tw-async-libraries';
import spriteTags from '../lib/libraries/sprite-tags';
import LibraryComponent from '../components/library/library.jsx';

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Costume',
        description: 'Heading for the costume library',
        id: 'gui.costumeLibrary.chooseACostume'
    },
    libraryHeader: {
        defaultMessage: 'Costumes',
        description: 'Header for the costume asset picker',
        id: 'pm.costumeLibrary.costumesHeader'
    }
});


class CostumeLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelected'
        ]);
    }
    handleItemSelected (item) {
        const vmCostume = {
            name: item.name,
            rotationCenterX: item.rotationCenterX,
            rotationCenterY: item.rotationCenterY,
            bitmapResolution: item.bitmapResolution,
            skinId: null
        };
        if (item.fromPenguinModLibrary) {
            vmCostume.fromPenguinModLibrary = true;
            vmCostume.libraryId = item.libraryFilePage;
            vmCostume.dataFormat = item.dataFormat;
        }
        this.props.vm.addCostumeFromLibrary(item.md5ext, vmCostume);
    }
    render () {
        return (
            <LibraryComponent
                data={getCostumeLibrary()}
                id="costumeLibrary"
                actor="CostumeLibrary"
                tags={spriteTags}
                header={this.props.intl.formatMessage(messages.libraryHeader)}
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                onItemSelected={this.handleItemSelected}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

CostumeLibrary.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(CostumeLibrary);
