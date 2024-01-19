import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../../stores/store'
import { Modal } from 'semantic-ui-react';

const ModalContainer = observer(() => {

    const { modalStore } = useStore();
    return (
        <Modal open={modalStore.modal.open} onClose={modalStore.closeModal} >
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>


    )
})

export default ModalContainer
