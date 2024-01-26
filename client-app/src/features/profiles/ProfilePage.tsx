import { Grid } from "semantic-ui-react"
import ProfileHeader from "./ProfileHeader"
import ProfileContent from "./ProfileContent" // Add this line
import { observer } from "mobx-react-lite"
import { useParams } from "react-router-dom"
import { useStore } from "../../app/stores/store"
import { useEffect } from "react"
import LoadingComponents from "../../app/layout/LoadingComponents"


const ProfilePage = observer(() => {
    const { username } = useParams<{ username: string }>();
    const { profileStore } = useStore();
    const { loadingProfile, loadProfile, profile } = profileStore;

    useEffect(() => {
        if (username)
            loadProfile(username);
    }, [loadProfile, username]);

    if (loadingProfile) return <LoadingComponents content='Loading profile...' inverted={true} />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                }
            </Grid.Column>
        </Grid>
    )
})

export default ProfilePage
