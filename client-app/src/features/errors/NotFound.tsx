import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'

const NotFound = () => {
    return (
        <Segment>
            <Header icon >
                <Icon name='search' />
                Ooops- we ve looked everywhere and could not find this.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' >
                    Return to activities page
                </Button>

            </Segment.Inline>
        </Segment>
    )
}

export default NotFound
