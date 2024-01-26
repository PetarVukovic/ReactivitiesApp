
import { Tab } from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos'
import { IProfile } from '../../app/models/profile'
import { observer } from 'mobx-react-lite';
import ProfileAbout from './ProfileAbout';

interface Props {
    profile: IProfile;
}
const ProfileContent = observer(({ profile }: Props) => {

    const panes = [
        { menuItem: 'About', render: () => <Tab.Pane><ProfileAbout /> </Tab.Pane> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
        { menuItem: 'Followers', render: () => <Tab.Pane>Followers Content</Tab.Pane> },
        { menuItem: 'Following', render: () => <Tab.Pane>Following Content</Tab.Pane> },

    ]
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
        />

    )
})

export default ProfileContent
