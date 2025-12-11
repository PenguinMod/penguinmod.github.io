import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Input from '../forms/input.jsx';
import Box from '../box/box.jsx';
import styles from './variables-tab.css';

class VariablesTab extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleSearch",
            "renderVariable"
        ]);
        this.state = {
            query: ''
        };
    }

    handleSearch (event) {
        this.setState({
            query: String(event.target.value).toLowerCase()
        })
    }
    renderVariable(variable) {
        const isTooBig = (variable.type === 'list' ? variable.value.join('\n').length > 5000000
            : String(variable.value).length > 1000000) && !this.props.showLargeValue[variable.id];

        const isEditing = variable.id === this.props.editingVariableId;
        const isEditingName = isEditing && this.props.editingVariableInput === 'name';
        const isEditingValue = isEditing && this.props.editingVariableInput === 'value';

        const displayVariableValue = isEditingValue ? this.props.editingVariableEditValue
            : (variable.type === 'list' ? variable.value.join('\n') : variable.value);
        const inputValueProps = {
            onFocus: () => this.props.onClickVariableValue(variable),
            onBlur: (event) => this.props.onEditVariableValue(event, variable),
            onChange: this.props.onTypeVariableValue,
            onKeyDown: (event) => this.props.onTypeVariableValue(event, variable),
        };

        return <tr>
            <td className={styles.variableName}>
                <input
                    onFocus={() => this.props.onClickVariableName(variable)}
                    onBlur={(event) => this.props.onEditVariableName(event, variable)}
                    onChange={this.props.onTypeVariableName}
                    onKeyDown={(event) => this.props.onTypeVariableName(event, variable)}
                    value={isEditingName ? this.props.editingVariableEditName : variable.name}
                />
            </td>
            <td className={styles.variableValue}>
                {isTooBig ?
                    <button
                        onClick={() => this.props.onClickShowLarge(variable.id)}
                        className={styles.valueTooBig}
                    >
                        Click to display very large value.
                    </button>
                    : variable.type === 'list' ? <textarea {...inputValueProps} value={displayVariableValue} />
                    : <input {...inputValueProps} value={displayVariableValue} />
                }
            </td>
        </tr>
    }

    render() {
        const {
            localVariables,
            globalVariables,
        } = this.props;

        const filteredLocal = localVariables.filter(varr => varr.name.toLowerCase().includes(this.state.query));
        const filteredGlobal = globalVariables.filter(varr => varr.name.toLowerCase().includes(this.state.query));

        return (<div className={styles.editorWrapper}>
            <Box
                className={styles.editorContainer}
            >
                <Input
                    placeholder="Search"
                    className={styles.searchBar}
                    onChange={this.handleSearch}
                />

                {filteredLocal.length > 0 && <div>
                    <span className={styles.heading}>
                        <FormattedMessage
                            defaultMessage="For this sprite only"
                            description="Text for the section of variables that are for only this sprite"
                            id="pm.variablesTab.forThisSpriteOnly"
                        />
                    </span>
                    <table>
                        {filteredLocal.map(this.renderVariable)}
                    </table>
                </div>}
                {filteredGlobal.length > 0 && <div>
                    <span className={styles.heading}>
                        <FormattedMessage
                            defaultMessage="Variables for all sprites"
                            description="Text for the section of variables that are for all sprites to use"
                            id="pm.variablesTab.forAllSprites"
                        />
                    </span>
                    <table>
                        {filteredGlobal.map(this.renderVariable)}
                    </table>
                </div>}
            </Box>
        </div>)
    }
}

VariablesTab.propTypes = {
    localVariables: PropTypes.any,
    globalVariables: PropTypes.any,
    showLargeValue: PropTypes.any,
    editingVariableId: PropTypes.string,
    editingVariableInput: PropTypes.string,
    editingVariableEditName: PropTypes.string,
    editingVariableEditValue: PropTypes.string,
    onClickShowLarge: PropTypes.func.isRequired,
    onClickVariableName: PropTypes.func.isRequired,
    onClickVariableValue: PropTypes.func.isRequired,
    onEditVariableName: PropTypes.func.isRequired,
    onEditVariableValue: PropTypes.func.isRequired,
    onTypeVariableName: PropTypes.func.isRequired,
    onTypeVariableValue: PropTypes.func.isRequired,
};

export default injectIntl(VariablesTab);
