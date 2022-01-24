import React, { NewLifecycle } from 'react'
import { Modal, Button } from 'react-bootstrap'

interface InfoModalProps {
    show: boolean,
    hideFunc: { (): void }
}
interface InfoModalState { }

export default class InfoModal
    extends React.Component<InfoModalProps, InfoModalState> {

    constructor(props: InfoModalProps) {
        super(props)
    }
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.hideFunc} backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This is the bddody
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.props.hideFunc}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}