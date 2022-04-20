const mmt = require('moment');
const { format } = require('date-fns');

const compareValues = (value1, value2) => value1 === value2 && 'selected';

const truncateText = (text, length) => {
    if (text.length < length) {
        return text;
    }

    return `${text.slice(0, length)}...`;
};

const compareOwner = (owner, loggedInUser) => (owner.equals(loggedInUser) ? 'block' : 'none');

const moment = (date) => mmt(date).toNow();

const formatDate = (date, dateFormat) => format(date, dateFormat);

const comparePath = (currentPath, navPath) => (currentPath === navPath ? 'active' : '');

// increment dashboard ideas table serial
const incrementedIndex = (indexNum) => {
    const index = indexNum + 1;
    return index;
};

module.exports = {
    compareValues,
    truncateText,
    compareOwner,
    moment,
    formatDate,
    comparePath,
    incrementedIndex,
};
