import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import ReactModal from 'react-modal';
import {FormattedMessage} from 'react-intl';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import CloseButton from '../close-button/close-button.jsx';

import backIcon from '../../lib/assets/icon--back.svg';
import helpIcon from '../../lib/assets/icon--help.svg';

import styles from './modal.css';



const ModalComponent = props => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animOut = props.animPref == "none" ? 0 : 200; // ms
    const [visible, setVisible] = useState(false); // provides a clear way to check visibility
    const waitOut = useRef(null);
    const onReqCloseRef = useRef(props.onRequestClose);

    useEffect(() => {
        onReqCloseRef.current = props.onRequestClose;
    }, [props.onRequestClose]);

    useEffect(() => {
        const waitIn = setTimeout(() => setVisible(true), 0); // you could add an "in" delay here but it just doesn't feel right
        return () => {
            clearTimeout(waitIn);
            if (waitOut.current) clearTimeout(waitOut.current);
        };
    }, []);

    const closeThisModal = useCallback(() => {
        setVisible(false); // animate out
        waitOut.current = setTimeout(() => {
            if (onReqCloseRef.current) onReqCloseRef.current(); // close window after animating out 
        }, animOut);
    }, []);

    return (
         <ReactModal
            isOpen
            className={classNames(
                styles.modalContent,
                props.className,
                {
                    [styles.modalContainer]: !props.fullScreen,
                    [styles.fullScreen]: props.fullScreen,
                    [styles.modalFsVisible]: visible && props.fullScreen,
                    [styles.modalVisible]: visible && !props.fullScreen,
                    [styles.extModal]: props.kind == 'extension',
                    [styles.noAnimation]: (props.animPref != 'intense' && props.fullScreen) || props.animPref == 'none' || prefersReducedMotion
                }
            )}
            contentLabel={props.contentLabel}
            overlayClassName={classNames(styles.modalOverlay, {
                [styles.scrollable]: props.scrollable,
                [styles.modalOverlayVisible]: visible,
                [styles.noAnimation]: (props.animPref != 'intense' && props.fullScreen) || props.animPref == 'none' || prefersReducedMotion
            })}
        >
            <Box
                dir={props.isRtl ? 'rtl' : 'ltr'}
                direction="column"
                grow={1}
            >
                <div className={classNames(styles.header, props.headerClassName)}>
                    {props.onHelp ? (
                        <div
                            className={classNames(
                                styles.headerItem,
                                styles.headerItemHelp
                            )}
                        >
                            <Button
                                className={styles.helpButton}
                                iconSrc={helpIcon}
                                onClick={props.onHelp}
                            >
                                <FormattedMessage
                                    defaultMessage="Help"
                                    description="Help button in modal"
                                    id="gui.modal.help"
                                />
                            </Button>
                        </div>
                    ) : null}
                    <div
                        className={classNames(
                            styles.headerItem,
                            styles.headerItemTitle
                        )}
                    >
                        {props.headerImage ? (
                            <img
                                className={styles.headerImage}
                                src={props.headerImage}
                            />
                        ) : null}
                        {props.contentLabel}
                    </div>
                    <div
                        className={classNames(
                            styles.headerItem,
                            styles.headerItemClose
                        )}
                    >
                        {props.fullScreen ? (
                            <Button
                                className={styles.backButton}
                                iconSrc={backIcon}
                                onClick={closeThisModal}
                            >
                                <FormattedMessage
                                    defaultMessage="Back"
                                    description="Back button in modal"
                                    id="gui.modal.back"
                                />
                            </Button>
                        ) : (
                            <CloseButton
                                size={CloseButton.SIZE_LARGE}
                                onClick={closeThisModal}
                            />
                        )}
                    </div>
                </div>
                {props.children}
            </Box>
        </ReactModal>
    )
};

ModalComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    contentLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    fullScreen: PropTypes.bool,
    headerClassName: PropTypes.string,
    headerImage: PropTypes.string,
    isRtl: PropTypes.bool,
    onHelp: PropTypes.func,
    onRequestClose: PropTypes.func,
    scrollable: PropTypes.bool,
    animPref: PropTypes.string 
};

const mapStateToProps = (state) => {
    return {
        animPref: state.scratchGui.addonUtil.editorAnimPref,
    };
};

export default connect(
    mapStateToProps
)(ModalComponent);
