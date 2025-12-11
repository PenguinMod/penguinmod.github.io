import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, FormattedDate, FormattedTime, FormattedRelative} from 'react-intl';
import bindAll from 'lodash.bindall';
import styles from './restore-point-modal.css';
import {formatBytes} from '../../lib/tw-bytes-utils';
import RestorePointAPI from '../../lib/tw-restore-point-api';
import log from '../../lib/log';
import deleteIcon from './delete.svg';

// Browser support is not perfect yet
const relativeTimeSupported = () => typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat !== 'undefined';

class RestorePoint extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClickDelete',
            'handleClickLoad',
            'handleClickExport'
        ]);
        this.state = {
            thumbnail: null,
            error: false
        };
        this.unmounted = false;

        // should never change for the same restore point
        this.totalSize = this.getTotalSize();
    }

    componentDidMount () {
        RestorePointAPI.getThumbnail(this.props.id)
            .then(url => {
                if (this.unmounted) {
                    URL.revokeObjectURL(url);
                } else {
                    this.setState({
                        thumbnail: url
                    });
                }
            })
            .catch(error => {
                log.error(error);
                if (!this.unmounted) {
                    this.setState({
                        error: true
                    });
                }
            });
    }

    componentWillUnmount () {
        if (this.state.thumbnail) {
            URL.revokeObjectURL(this.state.thumbnail);
        }
        this.unmounted = true;
    }

    getTotalSize () {
        let size = this.props.projectSize + this.props.thumbnailSize;
        for (const assetSize of Object.values(this.props.assets)) {
            size += assetSize;
        }
        return size;
    }

    handleClickDelete (e) {
        e.stopPropagation();
        this.props.onClickDelete(this.props.id);
    }

    handleClickLoad () {
        this.props.onClickLoad(this.props.id);
    }

    handleClickExport (e) {
        e.stopPropagation();
        this.props.onClickExport(this.props.id);
    }

    render () {
        const createdDate = new Date(this.props.created * 1000);
        return (
            <div
                tabIndex={0}
                role="button"
                className={styles.restorePoint}
                onClick={this.handleClickLoad}
            >
                <div className={styles.thumbnailContainer}>
                    {this.state.error ? (
                        <span className={styles.thumbnailPlaceholder}>
                            {'?'}
                        </span>
                    ) : this.state.thumbnail ? (
                        <img
                            className={styles.thumbnailImage}
                            src={this.state.thumbnail}
                        />
                    ) : null}
                </div>

                <div>
                    <div className={styles.restorePointTitle}>
                        {this.props.title}
                    </div>

                    <div>
                        {relativeTimeSupported() && (
                            <span>
                                <FormattedRelative value={createdDate} />
                                {' ('}
                            </span>
                        )}
                        <FormattedDate value={createdDate} />
                        {', '}
                        <FormattedTime value={createdDate} />
                        {relativeTimeSupported() && ')'}
                    </div>

                    <div>
                        {formatBytes(this.totalSize)}
                        {', '}
                        <FormattedMessage
                            defaultMessage="{n} assets"
                            // eslint-disable-next-line max-len
                            description="Describes how many assets (costumes and images) are in a restore point. {n} is replaced with a number like 406"
                            id="tw.restorePoints.assets"
                            values={{
                                n: Object.keys(this.props.assets).length
                            }}
                        />

                        <button
                            className={styles.exportButton}
                            onClick={this.handleClickExport}
                        >
                            <FormattedMessage
                                defaultMessage="Export"
                                description="Button to export a restorepoint directly fromt he list of restore points"
                                id="pm.restorePoints.exportRestorePoint"
                            />
                        </button>
                    </div>
                </div>

                <button
                    className={styles.deleteButton}
                    onClick={this.handleClickDelete}
                >
                    <img
                        src={deleteIcon}
                        alt="Delete"
                        draggable={false}
                    />
                </button>
            </div>
        );
    }
}

RestorePoint.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    projectSize: PropTypes.number.isRequired,
    thumbnailSize: PropTypes.number.isRequired,
    assets: PropTypes.shape({}).isRequired, // Record<string, number>
    onClickDelete: PropTypes.func.isRequired,
    onClickLoad: PropTypes.func.isRequired,
    onClickExport: PropTypes.func.isRequired
};

export default RestorePoint;
