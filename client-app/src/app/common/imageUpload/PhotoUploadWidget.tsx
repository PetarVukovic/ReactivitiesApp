
import { Button, Grid, Header } from 'semantic-ui-react'
import PhotoWidgetDropZone from './PhotoWidgetDropZone'
import { useEffect, useState } from 'react'
import { Cropper } from 'react-cropper'
import PhotoWidgetCropper from './PhotoWidgetCropper'

interface Props {
    uploadPhoto: (file: Blob) => void;
    loading: boolean;
}

const PhotoUploadWidget = ({ uploadPhoto, loading }: Props) => {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCopper] = useState<Cropper>();

    //Function what to do when we copper the image

    const onCrop = () => {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    //Clean our componenet when we leave it
    useEffect(() => {
        return () => {
            files.forEach((file: object & { preview?: string }) => URL.revokeObjectURL(file.preview!))
        }
    }, [files])
    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Add Photo' />
                <PhotoWidgetDropZone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4} >
                <Header sub color='teal' content='Step 2 - Resize image' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCopper={setCopper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4} >
                <Header sub color='teal' content='Step 3 - Preview & Upload' />
                {files && files.length > 0 &&
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
                        <Button.Group>
                            <Button onClick={onCrop} positive icon='check' loading={loading} />
                            <Button disabled={loading} onClick={() => setFiles([])} icon='close' />

                        </Button.Group>
                    </>}

            </Grid.Column>

        </Grid>
    )
}

export default PhotoUploadWidget
