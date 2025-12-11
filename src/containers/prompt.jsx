import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import PromptComponent from '../components/prompt/prompt.jsx';
import VM from 'scratch-vm';
import {SCRATCH_MAX_CLOUD_VARIABLES} from '../lib/tw-cloud-limits.js';

class Prompt extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOk',
            'handleScopeOptionSelection',
            'handleCancel',
            'handleCustomButton',
            'handleChange',
            'handleKeyPress',
            'handleCloudVariableOptionChange'
        ]);
        this.state = {
            isAddingCloudVariableScratchSafe: (
                props.vm &&
                props.vm.runtime.getNumberOfCloudVariables() < SCRATCH_MAX_CLOUD_VARIABLES
            ) || false,
            inputValue: '',
            globalSelected: true,
            cloudSelected: false,
            canAddCloudVariable: (props.vm && props.vm.runtime.canAddCloudVariable()) || false
        };
    }
    handleKeyPress (event) {
        if (event.key === 'Enter') this.handleOk();
    }
    handleFocus (event) {
        event.target.select();
    }
    handleOk () {
        if (this.props.isCustom) this.props.onOk();
        else this.props.onOk(this.state.inputValue, {
            scope: this.state.globalSelected ? 'global' : 'local',
            isCloud: this.state.cloudSelected
        });
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleCustomButton(button) {
        this.props.onCustomButton(button);
    }
    handleChange (e) {
        this.setState({inputValue: e.target.value});
    }
    handleScopeOptionSelection (e) {
        this.setState({globalSelected: (e.target.value === 'global')});
    }
    handleCloudVariableOptionChange (e) {
        if (!this.props.showCloudOption) return;

        const checked = e.target.checked;
        this.setState({cloudSelected: checked});
        if (checked) {
            this.setState({globalSelected: true});
        }
    }
    render () {
        if (this.props.isCustom) return (
            <PromptComponent
                isCustom={this.props.isCustom}
                componentRef={this.props.componentRef}
                boxRef={this.props.boxRef}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                onKeyPress={this.handleKeyPress}
                styleContent={this.props.styleContent}
                styleOverlay={this.props.styleOverlay}
                title={this.props.title}
                config={this.props.config}
                customButtons={this.props.customButtons}
                onCustomButton={this.handleCustomButton}
                customRef={this.props.customRef}
            />
        )
        else return (
            <PromptComponent
                isAddingCloudVariableScratchSafe={this.state.isAddingCloudVariableScratchSafe}
                canAddCloudVariable={this.state.canAddCloudVariable}
                cloudSelected={this.state.cloudSelected}
                defaultValue={this.props.defaultValue}
                globalSelected={this.state.globalSelected}
                isStage={this.props.isStage}
                showListMessage={this.props.showListMessage}
                label={this.props.label}
                showCloudOption={this.props.showCloudOption}
                showVariableOptions={this.props.showVariableOptions}
                title={this.props.title}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                onCloudVarOptionChange={this.handleCloudVariableOptionChange}
                onFocus={this.handleFocus}
                onKeyPress={this.handleKeyPress}
                onOk={this.handleOk}
                onScopeOptionSelection={this.handleScopeOptionSelection}
                componentRef={this.props.componentRef}
                styleContent={this.props.styleContent}
                styleOverlay={this.props.styleOverlay}
                boxRef={this.props.boxRef}
            />
        );
    }
}

Prompt.propTypes = {
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    defaultValue: PropTypes.string,
    isStage: PropTypes.bool,
    showListMessage: PropTypes.bool,
    label: PropTypes.string,
    showCloudOption: PropTypes.bool,
    showVariableOptions: PropTypes.bool,
    vm: PropTypes.instanceOf(VM),
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

export default Prompt;
