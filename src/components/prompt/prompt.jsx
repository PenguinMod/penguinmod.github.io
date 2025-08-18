import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './prompt.css';
import { SCRATCH_MAX_CLOUD_VARIABLES } from '../../lib/tw-cloud-limits.js';

const messages = defineMessages({
    forAllSpritesMessage: {
        defaultMessage: 'For all sprites',
        description: 'Option message when creating a variable for making it available to all sprites',
        id: 'gui.gui.variableScopeOptionAllSprites'
    },
    forThisSpriteMessage: {
        defaultMessage: 'For this sprite only',
        description: 'Option message when creating a varaible for making it only available to the current sprite',
        id: 'gui.gui.variableScopeOptionSpriteOnly'
    },
    cloudVarOptionMessage: {
        defaultMessage: 'Cloud variable (stored on server)',
        description: 'Option message when creating a variable for making it a cloud variable, a variable that is stored on the server', /* eslint-disable-line max-len */
        id: 'gui.gui.cloudVariableOption'
    },
    availableToAllSpritesMessage: {
        defaultMessage: 'This variable will be available to all sprites.',
        description: 'A message that displays in a variable modal when the stage is selected indicating ' +
            'that the variable being created will available to all sprites.',
        id: 'gui.gui.variablePromptAllSpritesMessage'
    },
    listAvailableToAllSpritesMessage: {
        defaultMessage: 'This list will be available to all sprites.',
        description: 'A message that displays in a list modal when the stage is selected indicating ' +
            'that the list being created will available to all sprites.',
        id: 'gui.gui.listPromptAllSpritesMessage'
    }
});

const customButtonStyle = (button) => {
    // if class is manually specified, dont try to guess the intended style
    if (button.class) {
        switch (button.class) {
            case "ok":
                return styles.okButton;
            case "cancel":
                return styles.cancelButton;
            default:
                return styles.cancelButton;
        }
    }

    // assume intended style from role
    if (button.role) {
        switch (button.role) {
            case "ok":
                return styles.okButton;
            case "close":
                return styles.cancelButton;
        }
    }
    return styles.cancelButton;
};
const PromptComponent = props => props.isCustom ? (
    <Modal
        className={styles.modalContent}
        contentLabel={props.title}
        id="customModal"
        onRequestClose={props.onCancel}
        componentRef={props.ref}
        boxRef={props.boxRef}
        styleContent={props.styleContent}
        styleOverlay={props.styleOverlay}
        scrollable={props.config.scrollable}
    >
        <Box className={styles.body}>
            <Box componentRef={props.customRef}>
            </Box>
            {(props.customButtons && props.customButtons.length > 0 ? <Box className={styles.buttonRow}>
                {/* slice then reverse to avoid mutating the array. reversing cause scratch modals put OK on the right & usually you define OK button first */}
                {props.customButtons.slice().reverse().map(button => (
                    <button
                        className={customButtonStyle(button)}
                        style={button.style}
                        onClick={() => props.onCustomButton(button)}
                    >
                        {button.name}
                    </button>
                ))}
            </Box> : null)}
        </Box>
    </Modal>
) : (
    <Modal
        className={styles.modalContent}
        contentLabel={props.title}
        id="variableModal"
        onRequestClose={props.onCancel}
        componentRef={props.componentRef}
        boxRef={props.boxRef}
        styleContent={props.styleContent}
        styleOverlay={props.styleOverlay}
    >
        <Box className={styles.body}>
            <Box className={styles.label}>
                {props.label}
            </Box>
            <Box>
                <input
                    autoFocus
                    className={styles.variableNameTextInput}
                    defaultValue={props.defaultValue}
                    name={props.label}
                    onChange={props.onChange}
                    onFocus={props.onFocus}
                    onKeyPress={props.onKeyPress}
                />
            </Box>
            {props.showVariableOptions ?
                <div>
                    {props.isStage ?
                        <div className={styles.infoMessage}>
                            {props.showListMessage ? (
                                <FormattedMessage
                                    {...messages.listAvailableToAllSpritesMessage}
                                />
                            ) : (
                                <FormattedMessage
                                    {...messages.availableToAllSpritesMessage}
                                />
                            )}
                        </div> :
                        <Box className={styles.optionsRow}>
                            <label>
                                <input
                                    checked={props.globalSelected}
                                    name="variableScopeOption"
                                    type="radio"
                                    value="global"
                                    onChange={props.onScopeOptionSelection}
                                />
                                <FormattedMessage
                                    {...messages.forAllSpritesMessage}
                                />
                            </label>
                            <label
                                className={classNames({ [styles.disabledLabel]: props.cloudSelected })}
                            >
                                <input
                                    checked={!props.globalSelected}
                                    disabled={props.cloudSelected}
                                    name="variableScopeOption"
                                    type="radio"
                                    value="local"
                                    onChange={props.onScopeOptionSelection}
                                />
                                <FormattedMessage
                                    {...messages.forThisSpriteMessage}
                                />
                            </label>
                        </Box>}
                    {props.showCloudOption ?
                        <Box className={classNames(styles.cloudOption)}>
                            <label
                                className={classNames({ [styles.disabledLabel]: !props.canAddCloudVariable })}
                            >
                                <input
                                    checked={props.cloudSelected && props.canAddCloudVariable}
                                    disabled={!props.canAddCloudVariable}
                                    type="checkbox"
                                    onChange={props.onCloudVarOptionChange}
                                />
                                <FormattedMessage
                                    {...messages.cloudVarOptionMessage}
                                />
                            </label>
                        </Box> : null}
                </div> : null}

            {props.cloudSelected && !props.isAddingCloudVariableScratchSafe && (
                <Box className={styles.infoMessage}>
                    <FormattedMessage
                        // eslint-disable-next-line max-len
                        defaultMessage="If you make this cloud variable, the project will exceed Scratch's limit of {number} variables, and some variables will not function if you upload the project to Scratch."
                        // eslint-disable-next-line max-len
                        description="Warning that appears when adding a new cloud variable will make it exceeded Scratch's cloud variable limit. number will be 10."
                        id="tw.scratchUnsafeCloud"
                        values={{
                            number: SCRATCH_MAX_CLOUD_VARIABLES
                        }}
                    />
                </Box>
            )}

            {props.cloudSelected && props.canAddCloudVariable && (
                <Box className={styles.infoMessage}>
                    <FormattedMessage
                        /* eslint-disable-next-line max-len */
                        defaultMessage="Although you can create cloud variables, they won't work until this project is uploaded or until this project is converted using a tool like the {packager}."
                        description="Reminder that cloud variables may not work when the editor is open"
                        values={{
                            packager: (
                                <a
                                    href="https://studio.penguinmod.com/PenguinMod-Packager"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {/* Should not be translated */}
                                    {'PenguinMod Packager'}
                                </a>
                            )
                        }}
                        id="tw.cantUseCloud"
                    />
                </Box>
            )}

            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button in prompt for cancelling the dialog"
                        id="gui.prompt.cancel"
                    />
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Button in prompt for confirming the dialog"
                        id="gui.prompt.ok"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

PromptComponent.propTypes = {
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    isAddingCloudVariableScratchSafe: PropTypes.bool,
    canAddCloudVariable: PropTypes.bool,
    cloudSelected: PropTypes.bool,
    defaultValue: PropTypes.string,
    globalSelected: PropTypes.bool,
    isStage: PropTypes.bool,
    showListMessage: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onCloudVarOptionChange: PropTypes.func,
    onFocus: PropTypes.func,
    onScopeOptionSelection: PropTypes.func,
    showCloudOption: PropTypes.bool,
    showVariableOptions: PropTypes.bool,
    componentRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    boxRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    styleContent: PropTypes.object,
    styleOverlay: PropTypes.object,

    /* custom modals */
    isCustom: PropTypes.bool,
    config: PropTypes.object,
    onCustomButton: PropTypes.func,
    customButtons: PropTypes.arrayOf(PropTypes.object),
    customRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
};

export default PromptComponent;
