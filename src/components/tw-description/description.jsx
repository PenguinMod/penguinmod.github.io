import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import styles from './description.css';
import {render} from 'PenguinMod-MarkDown';

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const days = [
    'mon',
    'tue',
    'wed',
    'thr',
    'fri',
    'sat',
    'sun'
];
const numberSuffixes = [
    'st',
    'nd',
    'rd',
    'th',
    'th',
    'th',
    'th',
    'th',
    'th',
    'th'
];
const addNumberSuffix = num => {
    if (!num) return `${num}`;
    if (num < 20 && num > 10) return `${num}th`;
    return num + numberSuffixes[(num - 1) % 10];
};

const defaultCustoms = {
    'clock': '$hour:$minute',
    '12clock': '$hour12:$minute',
    'date': '$day/$month/$year',
    'longDate': '$day $monthName $year',
    'dateClock': '$day/$month/$year $hour:$minute',
    'longDateClock': '$day $monthName $year $hour:$minute'
};

class Renderer {
    constructor (options) {
        this.options = options || {};
    }

    code (code) {
        return (
            <pre>
                <code>
                    {code}
                </code>
            </pre>
        );
    }

    blockquote (quote) {
        return (<blockquote>{quote}</blockquote>);
    }

    html (html) {
        return html;
    }

    heading (text, level) {
        switch (level) {
        case 1:
            return (<h1>{text}</h1>);
        case 2:
            return (<h2>{text}</h2>);
        case 3:
            return (<h3>{text}</h3>);
        case 4:
            return (<h4>{text}</h4>);
        case 5:
            return (<h5>{text}</h5>);
        case 6:
            return (<h6>{text}</h6>);
        }
    }

    hr () {
        return (<hr />);
    }

    list (body, ordered, taskList) {
        const css = taskList
            ? styles.taskList
            : null;
        return (ordered
            ? (<ol className={css}>{body}</ol>)
            : (<ul className={css}>{body}</ul>));
    }

    listitem (text, checked) {
        if (typeof checked === 'undefined') {
            return (<li>{text}</li>);
        }

        return (
            <li className={styles.taskListItem}>
                <input
                    type="checkbox"
                    className={styles.taskListItemCheckbox}
                    checked={checked}
                />
                {text}
            </li>
        );
    }

    paragraph (text) {
        return (<p>{text}</p>);
    }

    table (header, body) {
        return (
            <table>
                <thead>
                    {header}
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        );
    }

    tablerow (content) {
        return (<tr>{content}</tr>);
    }

    tablecell (content, flags) {
        const alignment = flags.align
            ? `text-align:${flags.align}`
            : null;

        return (flags.header
            ? <th style={alignment}>{content}</th>
            : <td style={alignment}>{content}</td>);
    }

    // span level renderer
    strong (text) {
        return (<strong>{text}</strong>);
    }

    em (text) {
        return (<em>{text}</em>);
    }

    codespan (text) {
        return (<code>{text}</code>);
    }

    br () {
        return (<br />);
    }

    del (text) {
        return (<del>{text}</del>);
    }

    link (href, title, text) {
        if (this.options.sanitize) {
            let prot;
            try {
                prot = decodeURIComponent(unescape(href))
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (err) {
                return '';
            }
            if (
                // eslint-disable-next-line no-script-url
                prot.indexOf('javascript:') === 0 ||
                prot.indexOf('vbscript:') === 0 ||
                prot.indexOf('data:') === 0
            ) {
                // eslint-disable-line no-script-url
                return '';
            }
        }
        
        return (
            <a
                href={href}
                title={title}
                target="_blank"
                rel="noreferrer"
            >
                {text}
            </a>
        );
    }

    image (href, title, text) {
        return (
            <img
                src={href}
                alt={text}
                title={title}
            />
        );
    }

    text (text) {
        return text;
    }

    project (id) {
        if (/^\d{6,}$/.test(id)) {
            return (
                <a
                    href={`https://studio.penguinmod.com/#${id}`}
                >
                    {`#${id}`}
                </a>
            );
        }
        return (
            <a
                href={`https://penguinmod.com/search?q=%23${id}`}
                target="_blank"
                rel="noreferrer"
            >
                {`#${id}`}
            </a>
        );
    }

    mention (name) {
        return (
            <a
                href={`https://penguinmod.com/profile?user=${name}`}
                target="_blank"
                rel="noreferrer"
            >
                {`@${name}`}
            </a>
        );
    }

    emoji (name) {
        return (
            <img
                src={`https://library.penguinmod.com/files/emojis/${name}.png`}
                alt={`:${name}:`}
                title={`:${name}:`}
                loading="lazy"
                className={styles.emoji}
            />
        );
    }

    timestamp (time, locale, custom) {
        time = new Date(time);
        if (!custom) return time.toLocaleString();
        const timeParts = {
            year: time.getFullYear(),
            month: time.getMonth(),
            date: time.getDate(),
            day: days[time.getDay()],
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds(),
            millisecond: time.getMilliseconds()
        };
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const hour = currentDate.getHours();
        const minute = currentDate.getMinutes();
        const second = currentDate.getSeconds();
        const millisecond = currentDate.getMilliseconds();
        const timeVars = {
            ...timeParts,
            monthName: monthNames[timeParts.month],
            shortMonthName: monthNames[timeParts.month].slice(0, 3),
            month: timeParts.month + 1,
            hour: timeParts.hour >= 10 ? timeParts.hour : `0${timeParts.hour}`,
            ampm: timeParts.hour >= 11 ? 'pm' : 'am',
            hour12: ((12 + (timeParts.hour - 1)) % 12) + 1,
            dateSuffixed: addNumberSuffix(timeParts.date),
            hoursTo: timeParts.hour - hour,
            minutesTo: timeParts.minute - minute,
            secondsTo: timeParts.second - second,
            millisecondsTo: timeParts.millisecond - millisecond,
            daysTo: timeParts.date - date,
            monthTo: timeParts.month - month,
            yearsTo: timeParts.year - year,
            hoursSince: hour - hour,
            minutesSince: minute - timeParts.minute,
            secondsSince: second - timeParts.second,
            millisecondsSince: millisecond - timeParts.millisecond,
            daysSince: date - timeParts.date,
            monthsSince: month - timeParts.month,
            yearsSince: year - timeParts.year
        };
        custom = defaultCustoms[custom] ?? custom;
        
        for (const [_, variable] of custom.matchAll(/\$(\w+)/g)) {
            const val = timeVars[variable];
            console.log(variable, val);
            custom = custom.replace(/\$\w+/, val);
        }
        return custom;
    }
}

const decorate = text =>
    render(text, {
        renderer: new Renderer()
    });

const Description = ({
    instructions,
    credits
}) => instructions !== 'unshared' && credits !== 'unshared' && (
    <div className={styles.description}>
        {instructions ? (
            <div>
                <h2 className={styles.header}>
                    <FormattedMessage
                        defaultMessage="Instructions"
                        description="Header for instructions section of description"
                        id="tw.home.instructions"
                    />
                </h2>
                {decorate(instructions)}
            </div>
        ) : null}
        {instructions && credits ? (
            <div className={styles.divider} />
        ) : null}
        {credits && (
            <div>
                <h2 className={styles.header}>
                    <FormattedMessage
                        defaultMessage="Notes and Credits"
                        description="Header for notes and credits section of description"
                        id="tw.home.credit"
                    />
                </h2>
                {decorate(credits)}
            </div>
        )}
    </div>
);

Description.propTypes = {
    instructions: PropTypes.string,
    credits: PropTypes.string
};

export default Description;
