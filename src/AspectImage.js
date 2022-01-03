import React, { useState, useEffect } from 'react';

import { Platform, Image } from 'react-native';

import WebAspectImage from './WebAspectImage';

function isPositive(value) {
    return Number.isFinite(value) && value > 0;
}

export default function AspectImage(props) {
    const [ratio, setRatio] = useState(0);

    function onSuccess(width, height) {
        if (isPositive(width) && isPositive(height)) {
            setRatio(width / height);
        }
    }

    function onFailure(error) {
        throw error;
    }

    useEffect(() => {
        const { source } = props;
        if (typeof source === 'number') {
            const { width, height } = Image.resolveAssetSource(source);
            onSuccess(width, height);
        } else {
            let uri;
            if (typeof source === 'string') {
                uri = source;
            } else {
                uri = source.uri;
            }
            Image.getSize(uri, onSuccess, onFailure);
        }
    }, [props.source]);

    return ratio ? (
        Platform.OS === 'web' ? (
            <WebAspectImage
                {...props}
                ratio={ratio}
            />
        ) : (
            <Image
                {...props}
                style={{
                    ...props.style,
                    aspectRatio: ratio,
                }}
            />
        )
    ) : (
        props.placeholder
    );
}
