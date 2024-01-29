
import { Tab } from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos'
import { IProfile } from '../../app/models/profile'
import { observer } from 'mobx-react-lite';
import ProfileAbout from './ProfileAbout';
import ProfileFollowings from './ProfileFollowings';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: IProfile;
}
const ProfileContent = observer(({ profile }: Props) => {

    const { profileStore } = useStore();

    const panes = [
        { menuItem: 'About', render: () => <Tab.Pane><ProfileAbout /> </Tab.Pane> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <Tab.Pane><ProfileFollowings /></Tab.Pane> },
        { menuItem: 'Following', render: () => <Tab.Pane><ProfileFollowings /></Tab.Pane> },

    ]
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(_, data) => profileStore.setActiveTab(data.activeIndex as number)}//_ means we dont care about the first parameter
        />

    )
})

export default ProfileContent
