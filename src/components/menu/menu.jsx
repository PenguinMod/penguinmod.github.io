import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState, useEffect, useRef} from 'react';
import styles from './menu.css';

const animIn = 0; // ms, you could add a delay but it doesn't feel right

const MenuComponent = ({
    className = '',
    children,
    componentRef,
    place = 'right'
}) => {
    const [visible, setVisible] = useState(false); // provides a clear way to check visibility
    const waitOut = useRef(null);

    useEffect(() => {
        const waitIn = setTimeout(() => setVisible(true), animIn); 
        return () => {
            clearTimeout(waitIn);
            if (waitOut.current) clearTimeout(waitOut.current);
        };
    }, []);
    return (
        <ul
            className={classNames(
                styles.menu,
                className,
                {
                    [styles.left]: place === 'left',
                    [styles.right]: place === 'right',
                    [styles.menuVisible]: visible,
                }
            )}
            ref={componentRef}
        >
            {children}
        </ul>
    )
};

MenuComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    componentRef: PropTypes.func,
    place: PropTypes.oneOf(['left', 'right'])
};


const MenuItem = ({
    children,
    className,
    onClick
}) => (
    <li
        className={classNames(
            styles.menuItem,
            styles.hoverable,
            className
        )}
        onClick={onClick}
    >
        {children}
    </li>
);

MenuItem.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func
};


const addDividerClassToFirstChild = (child, id) => (
    child && React.cloneElement(child, {
        className: classNames(
            child.className,
            {[styles.menuSection]: id === 0}
        ),
        key: id
    })
);

const MenuSection = ({children}) => (
    <React.Fragment>{
        React.Children.map(children, addDividerClassToFirstChild)
    }</React.Fragment>
);

MenuSection.propTypes = {
    children: PropTypes.node
};

export {
    MenuComponent as default,
    MenuItem,
    MenuSection
};
