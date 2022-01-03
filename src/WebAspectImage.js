import React, { useState } from 'react';

import { Image } from 'react-native';

function isNonNegative(value) {
    return Number.isFinite(value) && value >= 0;
}

function hasWidth(style) {
    return isNonNegative(style.width);
}

function hasHeight(style) {
    return isNonNegative(style.height);
}

function hasBasis(style) {
    return isNonNegative(style.flexBasis);
}

function hasGrow(style) {
    return Number.isFinite(style.flexGrow) && style.flexGrow > 0;
}

function hasStretch(style, parentStyle) {
    switch (style.alignSelf) {
        case 'flex-start':
        case 'flex-end':
        case 'center':
        case 'baseline':
            return false;
        case 'stretch':
            return true;
        default:
            return parentStyle['align-content'] === 'stretch';
    }
}

export default function WebAspectImage(props) {
    const [column, setColumn] = useState(true);
    const [value, setValue] = useState(0);

    function calculateWidth(event) {
        return event.layout.height * props.ratio;
    }

    function calculateHeight(event) {
        return event.layout.width / props.ratio;
    }

    function setMaximumAspect(event) {
        const width = calculateWidth(event);
        const height = calculateHeight(event);
        const rowArea = event.layout.width * height;
        const columnArea = width * event.layout.height;
        if (rowArea !== columnArea) {
            if (rowArea < columnArea) {
                setColumn(true);
                setValue(width);
            } else {
                setColumn(false);
                setValue(height);
            }
        }
    }

    function setColumnAspect(event) {
        const width = calculateWidth(event);
        setColumn(true);
        setValue(width);
    }

    function setRowAspect(event) {
        const height = calculateHeight(event);
        setColumn(false);
        setValue(height);
    }

    function onLayout({ nativeEvent }) {
        const style = { ...props.style };
        const parentStyle = getComputedStyle(nativeEvent.target.parentElement);
        const direction = parentStyle['flex-direction'];
        if (direction === 'row' || direction === 'row-reverse') {
            if (hasWidth(style) || hasBasis(style)) {
                setRowAspect(nativeEvent);
            } else {
                if (hasHeight(style) || hasStretch(style, parentStyle)) {
                    if (hasGrow(style)) {
                        setMaximumAspect(nativeEvent);
                    } else {
                        setColumnAspect(nativeEvent);
                    }
                } else {
                    setRowAspect(nativeEvent);
                }
            }
        } else {
            if (hasHeight(style) || hasBasis(style)) {
                setColumnAspect(nativeEvent);
            } else {
                if (hasWidth(style) || hasStretch(style, parentStyle)) {
                    if (hasGrow(style)) {
                        setMaximumAspect(nativeEvent);
                    } else {
                        setRowAspect(nativeEvent);
                    }
                } else {
                    setColumnAspect(nativeEvent);
                }
            }
        }
        if (props.onLayout) {
            props.onLayout({ nativeEvent });
        }
    }

    const style = { ...props.style };

    if (value) {
        if (column) {
            style.width = value;
        } else {
            style.height = value;
        }
    }

    return (
        <Image
            {...props}
            style={style}
            onLayout={onLayout}
        />
    );
}
