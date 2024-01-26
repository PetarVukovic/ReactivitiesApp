import React from 'react'
import { Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

interface Props {
    setCopper: (cropper: Cropper) => void;
    imagePreview: string;
}

const PhotoWidgetCropper = ({ setCopper, imagePreview }: Props) => {
    return (
        <Cropper
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview='.img-preview'
            guides={false}
            autoCropArea={1}
            background={false}
            viewMode={1}
            onInitialized={cropper => setCopper(cropper)}


        />

    )
}

export default PhotoWidgetCropper
