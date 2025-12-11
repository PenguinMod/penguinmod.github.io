import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import { defineMessages, injectIntl, intlShape, FormattedMessage } from 'react-intl';

import dropperIcon from './icon--dropper.svg';

import booleanInputIcon from './icon--boolean-input.svg';
import textInputIcon from './icon--text-input.svg';
import branchInputIcon from './icon--branch-input.svg';
import labelIcon from './icon--label.svg';

import stackBlockIcon from './icon--stack-block.svg';
import terminalBlockIcon from './icon--terminal-block.svg';
import reporterBlockIcon from './icon--reporter-block.svg';
import booleanBlockIcon from './icon--boolean-block.svg';

import styles from './custom-procedures.css';

const messages = defineMessages({
    myblockModalTitle: {
        defaultMessage: 'Make a Block',
        description: 'Title for the modal where you create a custom block.',
        id: 'gui.customProcedures.myblockModalTitle'
    }
});

const BlockColorSection = props => (
    <div className={styles.colorPickerArea}>
        <div>
            <button
                className={styles.presetColor}
                style={{ background: "#4C97FF" }}
                onClick={() => props.setHexBlockColor("#4C97FF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#9966FF" }}
                onClick={() => props.setHexBlockColor("#9966FF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#CF63CF" }}
                onClick={() => props.setHexBlockColor("#CF63CF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FFBF00" }}
                onClick={() => props.setHexBlockColor("#FFBF00")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FFAB19" }}
                onClick={() => props.setHexBlockColor("#FFAB19")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#5CB1D6" }}
                onClick={() => props.setHexBlockColor("#5CB1D6")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#59C059" }}
                onClick={() => props.setHexBlockColor("#59C059")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FF8C1A" }}
                onClick={() => props.setHexBlockColor("#FF8C1A")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FF661A" }}
                onClick={() => props.setHexBlockColor("#FF661A")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FF6680" }}
                onClick={() => props.setHexBlockColor("#FF6680")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#0FBD8C" }}
                onClick={() => props.setHexBlockColor("#0FBD8C")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FF4C4C" }}
                onClick={() => props.setHexBlockColor("#FF4C4C")}
            />
        </div>
        <div>
            <button
                className={styles.presetColor}
                style={{ background: "#FF8080" }}
                onClick={() => props.setHexBlockColor("#FF8080")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FFB980" }}
                onClick={() => props.setHexBlockColor("#FFB980")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FFF480" }}
                onClick={() => props.setHexBlockColor("#FFF480")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#8EFF80" }}
                onClick={() => props.setHexBlockColor("#8EFF80")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#80FFBD" }}
                onClick={() => props.setHexBlockColor("#80FFBD")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#80EAFF" }}
                onClick={() => props.setHexBlockColor("#80EAFF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#80C1FF" }}
                onClick={() => props.setHexBlockColor("#80C1FF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#8084FF" }}
                onClick={() => props.setHexBlockColor("#8084FF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#D375FF" }}
                onClick={() => props.setHexBlockColor("#D375FF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#FF8AFF" }}
                onClick={() => props.setHexBlockColor("#FF8AFF")}
            />
            <button
                className={styles.presetColor}
                style={{ background: "#BBBBBB" }}
                onClick={() => props.setHexBlockColor("#BBBBBB")}
            />
            <div className={styles.parentCustom}>
                <input
                    type="color"
                    value={props.blockColor}
                    className={styles.presetColor}
                    onChange={props.onBlockColorChange}
                />
                <img
                    src={dropperIcon}
                    className={styles.customPlus}
                />
            </div>
        </div>
    </div>
)

const CustomProcedures = props => (
    <Modal
        scrollable={true}
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.myblockModalTitle)}
        onRequestClose={props.onCancel}
    >
        <Box
            className={styles.workspace}
            componentRef={props.componentRef}
        />
        <Box className={styles.body}>
            <div className={styles.optionsRow}>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddTextNumber}
                >
                    <img
                        className={styles.optionIcon}
                        src={textInputIcon}
                    />
                    <div className={styles.optionTitle}>
                        <FormattedMessage
                            defaultMessage="Add an input"
                            description="Label for button to add a number/text input"
                            id="gui.customProcedures.addAnInputNumberText"
                        />
                    </div>
                    <div className={styles.optionDescription}>
                        <FormattedMessage
                            defaultMessage="number or text"
                            description="Description of the number/text input type"
                            id="gui.customProcedures.numberTextType"
                        />
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddBoolean}
                >
                    <img
                        className={styles.optionIcon}
                        src={booleanInputIcon}
                    />
                    <div className={styles.optionTitle}>
                        <FormattedMessage
                            defaultMessage="Add an input"
                            description="Label for button to add a boolean input"
                            id="gui.customProcedures.addAnInputBoolean"
                        />
                    </div>
                    <div className={styles.optionDescription}>
                        <FormattedMessage
                            defaultMessage="boolean"
                            description="Description of the boolean input type"
                            id="gui.customProcedures.booleanType"
                        />
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddCommand}
                >
                    <img
                        className={styles.optionIcon}
                        src={branchInputIcon}
                    />
                    <div className={styles.optionTitle}>
                        <FormattedMessage
                            defaultMessage="Add an input"
                            description="Label for button to add a command input"
                            id="pm.customProcedures.addAnInputCommand"
                        />
                    </div>
                    <div className={styles.optionDescription}>
                        <FormattedMessage
                            defaultMessage="branch"
                            description="Description of the command input type"
                            id="pm.customProcedures.commandType"
                        />
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddLabel}
                >
                    <img
                        className={styles.optionIcon}
                        src={labelIcon}
                    />
                    <div className={styles.optionTitle}>
                        <FormattedMessage
                            defaultMessage="Add a label"
                            description="Label for button to add a label"
                            id="gui.customProcedures.addALabel"
                        />
                    </div>
                </div>
            </div>
            {!props.editing && <div className={styles.optionsRow} style={{ marginTop: '1em' }}>
                {props.returns ? <>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={() => props.onOutputTypeChanged('string')}
                    >
                        <img
                            className={styles.optionIcon}
                            src={reporterBlockIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Return Text or Number"
                                description="Label for block to return text"
                                id="pm.customProcedures.returnText"
                            />
                        </div>
                    </div>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={() => props.onOutputTypeChanged('boolean')}
                    >
                        <img
                            className={styles.optionIcon}
                            src={booleanBlockIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Return a Boolean"
                                description="Label for block to return a boolean"
                                id="pm.customProcedures.returnABoolean"
                            />
                        </div>
                    </div>
                </> : <>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={() => props.onOutputTypeChanged('statement')}
                    >
                        <img
                            className={styles.optionIcon}
                            src={stackBlockIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Normal block"
                                description="Label for block to be a normal stack block"
                                id="pm.customProcedures.normalBlock"
                            />
                        </div>
                    </div>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={() => props.onOutputTypeChanged('end')}
                    >
                        <img
                            className={styles.optionIcon}
                            src={terminalBlockIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Ending block"
                                description="Label for block to be an ending block for a stack"
                                id="pm.customProcedures.endingBlock"
                            />
                        </div>
                    </div>
                </>}
            </div>}

            <BlockColorSection {...props} />
            <div className={styles.checkboxRow}>
                <label>
                    <input
                        checked={props.warp}
                        type="checkbox"
                        onChange={props.onToggleWarp}
                    />
                    <FormattedMessage
                        defaultMessage="Run without screen refresh"
                        description="Label for checkbox to run without screen refresh"
                        id="gui.customProcedures.runWithoutScreenRefresh"
                    />
                </label>
                <br />
                {!props.editing ? (<div>
                    <label>
                        <input
                            checked={props.returns}
                            type="checkbox"
                            onChange={props.onToggleReturns}
                        />
                        Returns a value
                    </label>
                </div>) : null}
            </div>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Label for button to cancel custom procedure edits"
                        id="gui.customProcedures.cancel"
                    />
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Label for button to save new custom procedure"
                        id="gui.customProcedures.ok"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

CustomProcedures.propTypes = {
    componentRef: PropTypes.func.isRequired,
    intl: intlShape,
    onAddBoolean: PropTypes.func.isRequired,
    onAddCommand: PropTypes.func.isRequired,
    onAddLabel: PropTypes.func.isRequired,
    onAddTextNumber: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onToggleWarp: PropTypes.func.isRequired,
    onToggleReturns: PropTypes.func.isRequired,
    warp: PropTypes.bool.isRequired,
    returns: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    selectedType: PropTypes.string.isRequired,
    onOutputTypeChanged: PropTypes.func.isRequired
};

export default injectIntl(CustomProcedures);
