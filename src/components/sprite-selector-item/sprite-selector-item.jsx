import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, {useState, useEffect, useRef, useCallback} from 'react';

import DeleteButton from '../delete-button/delete-button.jsx';
import styles from './sprite-selector-item.css';
import { ContextMenuTrigger } from 'react-contextmenu';
import { DangerousMenuItem, ContextMenu, MenuItem } from '../context-menu/context-menu.jsx';
import { FormattedMessage } from 'react-intl';

// react-contextmenu requires unique id to match trigger and context menu
let contextMenuId = 0;



const SpriteSelectorItem = props => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animOut = props.animPref == "none" ? 0 : 150; // ms
    const [visible, setVisible] = useState(true); // provides a clear way to check visibility
    const waitOut = useRef(null);
    const onReqCloseRef = useRef(props.onDeleteButtonClick);
    const prevRestoreFun = useRef(props.restoreFun);
    
    useEffect(() => {
        if (props.restoreFun && props.restoreFun !== prevRestoreFun.current) {
            setVisible(true);
        }
        prevRestoreFun.current = props.restoreFun;
    }, [props.restoreFun]);
    
    useEffect(() => {
        onReqCloseRef.current = props.onDeleteButtonClick;
    }, [props.onDeleteButtonClick]);

    useEffect(() => {
        const waitIn = setTimeout(() => setVisible(true), 0); // you could add an "in" delay here but it just doesn't feel right
        return () => {
            clearTimeout(waitIn);
            if (waitOut.current) clearTimeout(waitOut.current);
        };
    }, []);

    const onDelete = useCallback(() => {
        setVisible(false); // animate out
        waitOut.current = setTimeout(() => {
            console.log('SpriteSelectorItem: onDelete');
            if (onReqCloseRef.current) onReqCloseRef.current(); // delete sprite after animating out 
        }, animOut);
    }, []);

    return (
        <ContextMenuTrigger
            attributes={{
                className: classNames(props.className, styles.spriteSelectorParent, {
                    [styles.isSelected]: props.selected,
                    [styles.deletingFly]: !visible && (props.deleteAnim == "fly"),
                    [styles.deletingShrink]: !visible && (props.deleteAnim == "shrink"),
                    [styles.noAnimation]: props.animPref == 'none' || prefersReducedMotion
                }),
                onClick: props.onClick,
                onMouseEnter: props.onMouseEnter,
                onMouseLeave: props.onMouseLeave,
                onMouseDown: props.onMouseDown,
                onTouchStart: props.onMouseDown
            }}
            disable={props.preventContextMenu}
            id={`${props.name}-${contextMenuId}`}
            ref={props.componentRef}
        >   <div className={classNames(props.className, styles.spriteSelectorItem, {
            [styles.isSelected]: props.selected,
        })}>
            {typeof props.number === 'undefined' ? null : (
                <div className={styles.number}>{props.number}</div>
            )}
            {props.costumeURL ? (
                <div className={styles.spriteImageOuter}>
                    <div className={styles.spriteImageInner}>
                        <img
                            className={styles.spriteImage}
                            draggable={false}
                            src={props.costumeURL}
                        />
                    </div>
                </div>
            ) : null}
            <div className={styles.spriteInfo}>
                <div className={styles.spriteName}>{props.name}</div>
                {props.details ? (
                    <div className={styles.spriteDetails}>{props.details}</div>
                ) : null}
            </div>
            {(props.selected && props.onDeleteButtonClick) ? (
                <DeleteButton
                    className={styles.deleteButton}
                    onClick={onDelete}
                />
            ) : null}
            </div>
            {props.onDuplicateButtonClick || props.onDeleteButtonClick || props.onExportButtonClick ? (
                <ContextMenu id={`${props.name}-${contextMenuId++}`}>
                    {props.onDuplicateButtonClick ? (
                        <MenuItem onClick={props.onDuplicateButtonClick}>
                            <FormattedMessage
                                defaultMessage="duplicate"
                                description="Menu item to duplicate in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDuplicate"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onExportButtonClick ? (
                        <MenuItem onClick={props.onExportButtonClick}>
                            <FormattedMessage
                                defaultMessage="export"
                                description="Menu item to export the selected item"
                                id="gui.spriteSelectorItem.contextMenuExport"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onRenameButtonClick ? (
                        <MenuItem onClick={props.onRenameButtonClick}>
                            <FormattedMessage
                                defaultMessage="rename"
                                description="Menu item to rename an item"
                                id="tw.spriteSelectorItem.rename"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onDeleteButtonClick ? (
                        <DangerousMenuItem onClick={props.onDeleteButtonClick}>
                            <FormattedMessage
                                defaultMessage="delete"
                                description="Menu item to delete in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDelete"
                            />
                        </DangerousMenuItem>
                    ) : null}
                </ContextMenu>
            ) : null}
        </ContextMenuTrigger>
    );
}

SpriteSelectorItem.propTypes = {
    className: PropTypes.string,
    componentRef: PropTypes.func,
    costumeURL: PropTypes.string,
    details: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    name: PropTypes.any,
    number: PropTypes.number,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDuplicateButtonClick: PropTypes.func,
    onExportButtonClick: PropTypes.func,
    onRenameButtonClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    preventContextMenu: PropTypes.bool,
    selected: PropTypes.bool.isRequired,
    animPref: PropTypes.string,
    deleteAnim: PropTypes.string,
    restoreFun: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        animPref: state.scratchGui.addonUtil.editorAnimPref,
        deleteAnim: state.scratchGui.addonUtil.editorDeleteAnim,
        restoreFun: state.scratchGui.restoreDeletion.restoreFun
    };
};

export default connect(
    mapStateToProps
)(SpriteSelectorItem);
