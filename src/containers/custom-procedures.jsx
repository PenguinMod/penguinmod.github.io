import bindAll from 'lodash.bindall';
import defaultsDeep from 'lodash.defaultsdeep';
import PropTypes from 'prop-types';
import React from 'react';
import CustomProceduresComponent from '../components/custom-procedures/custom-procedures.jsx';
import LazyScratchBlocks from '../lib/tw-lazy-scratch-blocks';
import {connect} from 'react-redux';

let ScratchBlocks; // defined later

function darkenColor(hex, amt) {
    const Color = ScratchBlocks.goog.color;
    return Color.rgbArrayToHex(Color.darken(
        Color.hexToRgb(hex), amt
    ));
}

class CustomProcedures extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddLabel',
            'handleAddBoolean',
            'handleAddCommand',
            'handleAddTextNumber',
            'handleToggleWarp',
            'handleToggleReturns',
            'handleCancel',
            'handleOk',
            'handleChangeType',
            'handleBlockColorChange',
            'setHexBlockColor',
            'setBlocks',
            'handleTestFunction'
        ]);
        this.state = {
            rtlOffset: 0,
            warp: false,
            returns: false,
            editing: false,
            blockColor: '#000000',
            type: 'statement'
        };
    }
    componentWillUnmount () {
        if (this.workspace) {
            this.workspace.dispose();
        }
    }
    setBlocks (blocksRef) {
        if (!blocksRef) return;
        this.blocks = blocksRef;
        const workspaceConfig = defaultsDeep({},
            CustomProcedures.defaultOptions,
            this.props.options,
            {rtl: this.props.isRtl}
        );

        // @todo This is a hack to make there be no toolbox.
        ScratchBlocks = LazyScratchBlocks.get();
        const oldDefaultToolbox = ScratchBlocks.Blocks.defaultToolbox;
        ScratchBlocks.Blocks.defaultToolbox = null;
        this.workspace = ScratchBlocks.inject(this.blocks, workspaceConfig);
        ScratchBlocks.Blocks.defaultToolbox = oldDefaultToolbox;

        // Create the procedure declaration block for editing the mutation.
        this.mutationRoot = this.workspace.newBlock('procedures_declaration');
        // Make the declaration immovable, undeletable and have no context menu
        this.mutationRoot.setMovable(false);
        this.mutationRoot.setDeletable(false);
        this.mutationRoot.contextMenu = false;

        this.workspace.addChangeListener(() => {
            this.mutationRoot.onChangeFn();
            // Keep the block centered on the workspace
            const metrics = this.workspace.getMetrics();
            const {x, y} = this.mutationRoot.getRelativeToSurfaceXY();
            const dy = (metrics.viewHeight / 2) - (this.mutationRoot.height / 2) - y;
            let dx;
            if (this.props.isRtl) {
                // // TODO: https://github.com/LLK/scratch-gui/issues/2838
                // This is temporary until we can figure out what's going on width
                // block positioning on the workspace for RTL.
                // Workspace is always origin top-left, with x increasing to the right
                // Calculate initial starting offset and save it, every other move
                // has to take the original offset into account.
                // Calculate a new left postion based on new width
                // Convert current x position into LTR (mirror) x position (uses original offset)
                // Use the difference between ltrX and mirrorX as the amount to move
                const ltrX = ((metrics.viewWidth / 2) - (this.mutationRoot.width / 2) + 25);
                const mirrorX = x - ((x - this.state.rtlOffset) * 2);
                if (mirrorX === ltrX) {
                    return;
                }
                dx = mirrorX - ltrX;
                const midPoint = metrics.viewWidth / 2;
                if (x === 0) {
                    // if it's the first time positioning, it should always move right
                    if (this.mutationRoot.width < midPoint) {
                        dx = ltrX;
                    } else if (this.mutationRoot.width < metrics.viewWidth) {
                        dx = midPoint - ((metrics.viewWidth - this.mutationRoot.width) / 2);
                    } else {
                        dx = midPoint + (this.mutationRoot.width - metrics.viewWidth);
                    }
                    this.mutationRoot.moveBy(dx, dy);
                    this.setState({rtlOffset: this.mutationRoot.getRelativeToSurfaceXY().x});
                    return;
                }
                if (this.mutationRoot.width > metrics.viewWidth) {
                    dx = dx + this.mutationRoot.width - metrics.viewWidth;
                }
            } else {
                dx = (metrics.viewWidth / 2) - (this.mutationRoot.width / 2) - x;
                // If the procedure declaration is wider than the view width,
                // keep the right-hand side of the procedure in view.
                if (this.mutationRoot.width > metrics.viewWidth) {
                    dx = metrics.viewWidth - this.mutationRoot.width - x;
                }
            }
            this.mutationRoot.moveBy(dx, dy);
        });
        this.mutationRoot.domToMutation(this.props.mutator);
        this.mutationRoot.initSvg();
        this.mutationRoot.render();
        this.setState({
            warp: this.mutationRoot.getWarp(),
            returns: this.mutationRoot.getReturns(),
            editing: this.mutationRoot.getEdited(),
            // sometimes color[0] exists but sometimes it doesnt
            // i can blame gsa for this or just do nothing about it :troll:
            blockColor: this.mutationRoot.color ? this.mutationRoot.color[0] : this.mutationRoot.colour_
        });
        // Allow the initial events to run to position this block, then focus.
        setTimeout(() => {
            this.mutationRoot.focusLastEditor_();
            // if editing, apply block color
            if (this.state.editing && this.mutationRoot.color) {
                this.handleBlockColorChange({
                    target: {
                        value: this.mutationRoot.color[0]
                    }
                });
            }
        });
    }
    handleCancel () {
        this.props.onRequestClose();
    }
    handleOk () {
        this.mutationRoot.setEdited(true)
        const newMutation = this.mutationRoot ? this.mutationRoot.mutationToDom(true) : null;
        this.props.onRequestClose(newMutation);
    }
    handleAddLabel () {
        if (this.mutationRoot) {
            this.mutationRoot.addLabelExternal();
        }
    }
    handleAddBoolean () {
        if (this.mutationRoot) {
            this.mutationRoot.addBooleanExternal();
        }
    }
    handleAddCommand () {
        if (this.mutationRoot) {
            this.mutationRoot.addCommandExternal();
        }
    }
    handleAddTextNumber () {
        if (this.mutationRoot) {
            this.mutationRoot.addStringNumberExternal();
        }
    }
    handleToggleWarp () {
        if (this.mutationRoot) {
            const newWarp = !this.mutationRoot.getWarp();
            this.mutationRoot.setWarp(newWarp);
            this.setState({warp: newWarp});
        }
    }
    handleToggleReturns () {
        if (this.mutationRoot) {
            const newReturns = !this.mutationRoot.getReturns();
            this.mutationRoot.setReturns(newReturns);
            this.handleChangeType(newReturns ? 'string' : 'statement');
            this.setState({returns: newReturns});
        }
    }
    handleChangeType (value) {
        if (this.mutationRoot) {
            const newType = value;
            this.mutationRoot.setType(newType);
            this.setState({type: newType});
        }
    }
    handleBlockColorChange (element) {
        if (this.mutationRoot) {
            const newColor = element.target.value;
            this.mutationRoot.setColor(
                newColor,
                darkenColor(newColor, 0.1),
                darkenColor(newColor, 0.2)
            );
            this.setState({blockColor: newColor});
        }
    }
    setHexBlockColor (hex) {
        this.handleBlockColorChange({
            target: {
                value: hex
            }
        });
    }
    handleTestFunction (type) {
        if (this.mutationRoot) {
            switch (type) {
                case 'icon': {
                    const iconUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAADwUExURf/////////////z8//v7//u7v/n5//j4//5+f/////////MzP+3t//////////9/f////+trf/////////Ozv/Pz//////////39//Jyf/8/P/////////////+/v/z8//////////S0v/Hx//////////e3v/e3v/////////////r6//e3v/j4//u7v////+Ghv+Fhf+Dg/95ef+bm/+Xl/+lpf+trf+rq/+fn/+kpP+Tk/9tbf+Cgv+Hh/9ZWf+cnP9ycv9bW/+Jif99ff+Li//ExP+zs/+EhP+Kiv+YmP9vb/+4uP9ubv+Bgf////kftB4AAAAwdFJOUwAQfdDW2u37siNq9f2ImKV0/JlH8PVlD6D6z2gMIc/DGDbt90Yr4uMvBHLr/fXjbhcejrAAAAABYktHRACIBR1IAAAAB3RJTUUH5wUYBDIzz3HsIQAAAHNJREFUCNdjYGRiZmFhZWPn4GTg4jYwMDA0MubhZeAzMTUzt7C0suZnEBC0trG1s7dzEGIQFnF0snV2cRYVYxCXkLSyc3WTkpZhYJCVc/fw9JJXYGBgUFTyNvfxVVYBMlXVjPz8DNQ1gExNLW0dXT19TQYA+wMO76YS2sEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDUtMjRUMDQ6NTA6NTArMDA6MDDybVL4AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA1LTI0VDA0OjUwOjUwKzAwOjAwgzDqRAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wNS0yNFQwNDo1MDo1MSswMDowMHJSwC8AAAAASUVORK5CYII=';
                    this.mutationRoot.setImage(iconUri);
                    break;
                }
                case 'removeicon': {
                    this.mutationRoot.unsetImage();
                    break;
                }
            }
        }
    }
    render () {
        return (
            <CustomProceduresComponent
                componentRef={this.setBlocks}
                warp={this.state.warp}
                blockColor={this.state.blockColor}
                returns={this.state.returns}
                onAddBoolean={this.handleAddBoolean}
                onAddCommand={this.handleAddCommand}
                onAddLabel={this.handleAddLabel}
                onAddTextNumber={this.handleAddTextNumber}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                onToggleWarp={this.handleToggleWarp}
                onToggleReturns={this.handleToggleReturns}
                editing={this.state.editing}
                selectedType={this.state.type}
                onOutputTypeChanged={this.handleChangeType}
                onBlockColorChange={this.handleBlockColorChange}
                setHexBlockColor={this.setHexBlockColor}
                onTestStart={this.handleTestFunction}
            />
        );
    }
}

CustomProcedures.propTypes = {
    isRtl: PropTypes.bool,
    mutator: PropTypes.instanceOf(Element),
    onRequestClose: PropTypes.func.isRequired,
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool
    })
};

CustomProcedures.defaultOptions = {
    zoom: {
        controls: false,
        wheel: false,
        startScale: 0.9
    },
    comments: false,
    collapse: false,
    scrollbars: true
};

CustomProcedures.defaultProps = {
    options: CustomProcedures.defaultOptions
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl,
    mutator: state.scratchGui.customProcedures.mutator
});

export default connect(
    mapStateToProps
)(CustomProcedures);
