import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useState } from 'react'
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react'
import { IPhoto, IProfile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';


interface Props {
    profile: IProfile;
}

const ProfilePhotos = observer(({ profile }: Props) => {
    const { profileStore: { isCurrentUser, uploadPhoto, uploading, setMainPhoto, loadaing, deletePhoto } } = useStore();
    const [addPhotoMode, setPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    const handlePhotoUpload = (file: Blob) => {
        uploadPhoto(file).then(() => setPhotoMode(false));
    }

    const handleSetMainPhoto = (photo: IPhoto, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    const handleDeletePhoto = (photo: IPhoto, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);

    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button floated='right' basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setPhotoMode(!addPhotoMode)} />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                basic positive
                                                content='Main'
                                                name={'main' + photo.id}
                                                disabled={photo.isMain}
                                                loading={target === 'main' + photo.id && loadaing}
                                                onClick={(e) => handleSetMainPhoto(photo, e)} />
                                            <Button
                                                loading={target === photo.id && loadaing}//if target is photo.id and loading is true, then loading is true
                                                basic negative icon='trash'
                                                onClick={(e) => handleDeletePhoto(photo, e)}
                                                disabled={photo.isMain}//if photo is main, disable delete button
                                                name={photo.id}
                                            />
                                        </Button.Group>

                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>



        </Tab.Pane>
    )
})

export default ProfilePhotos
