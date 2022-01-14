import React, { useState } from 'react';

import { Platform, Image } from 'react-native';

import WebAspectImage from './WebAspectImage';

import { useUpdate } from '@hashiprobr/react-use-mount-and-update';

function isPositive(value) {
    return Number.isFinite(value) && value > 0;
}

export default function AspectImage(props) {
    const [src, setSrc] = useState('');
    const [ratio, setRatio] = useState(0);

    function onSuccess(width, height) {
        if (isPositive(width) && isPositive(height)) {
            setRatio(width / height);
        }
    }

    function onFailure(error) {
        throw error;
    }

    useUpdate(() => {
        const { source } = props;
        if (typeof source === 'number') {
            const { uri, width, height } = Image.resolveAssetSource(source);
            setSrc(uri);
            onSuccess(width, height);
        } else {
            let uri;
            if (typeof source === 'string') {
                uri = source;
            } else {
                uri = source.uri;
            }
            setSrc(uri);
            Image.getSize(uri, onSuccess, onFailure);
        }
    }, [props.source]);

    let placeholder;
    if ('placeholder' in props) {
        placeholder = props.placeholder;
    } else {
        placeholder = null;
    }

    return ratio && src ? (
        Platform.OS === 'web' ? (
            <WebAspectImage
                {...props}
                ratio={ratio}
                source={{ uri: src }}
            />
        ) : (
            <Image
                {...props}
                style={{
                    ...props.style,
                    aspectRatio: ratio,
                }}
                source={{ uri: src }}
            />
        )
    ) : (
        placeholder
    );
}
