const compareValues = (value1, value2) => value1 === value2 && 'selected';

const truncateText = (text, length) => {
    if (text.length < length) {
        return text;
    }

    return `${text.slice(0, length)}...`;
};

module.exports = {
    compareValues,
    truncateText,
};
