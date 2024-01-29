import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent } from 'react'
import { Button, Reveal } from 'semantic-ui-react'
import { IProfile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store';

interface Props {
    profile: IProfile;
}

const FollowButton = observer(({ profile }: Props) => {

    const { profileStore, userStore } = useStore();
    const { updateFollowing, loadaing } = profileStore;

    if (userStore.user?.username === profile.username) return null;//We dont want to dispaly button if we are on our own profile

    const handleFollow = (e: SyntheticEvent, username: string) => {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);//second param are we want to follow or unfollow this user 

    }
    return (
        <div>
            <Reveal animated='move'>
                <Reveal.Content visible style={{ width: '100%' }}>
                    <Button
                        fluid
                        color='teal'
                        content={profile.following ? 'Following' : 'Not following'}
                    />
                </Reveal.Content>
                <Reveal.Content hidden style={{ width: '100%' }}>
                    <Button
                        fluid
                        basic
                        color={profile.following ? 'red' : 'green'}
                        content={profile.following ? 'Unfollow' : 'Follow'}
                        loading={loadaing}//We want to show loading indicator when we are updating following
                        onClick={(e) => handleFollow(e, profile.username)}
                    />
                </Reveal.Content>

            </Reveal>

        </div>
    )
})

export default FollowButton
