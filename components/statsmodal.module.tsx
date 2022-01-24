import React, { NewLifecycle } from 'react'
import { Modal } from 'react-bootstrap'
import BurdleCookie, { CookieFormat } from './burdlecookie'

interface StatsModalProps {
    show: boolean,
    hideFunc: { (): void }
}
interface StatsModalState { }

const burdle = () => {
    return (
        <span className="burdletext"> BURDLE </span>
    )
}
const wordle = () => {
    return (
        <span className="burdletext">WORDLE</span>
    )
}

export default class StatsModal
    extends React.Component<StatsModalProps, StatsModalState> {

    constructor(props: StatsModalProps) {
        super(props)
    }

    render() {
        let c = BurdleCookie.get()
        return (
            <Modal show={this.props.show} onHide={this.props.hideFunc} backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Your Statistics
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row pd-0">
                            <div className="col-4 text-end">
                                Games Played:
                            </div>
                            <div className="col-4 text-start">
                                {c.nplayed}
                            </div>
                        </div>
                        <div className="row pd-0">
                            <div className="col-4 text-end">
                                Wins:
                            </div>
                            <div className="col-4 text-start">
                                {c.nwins}
                            </div>
                        </div>
                        <div className="row pd-0">
                            <div className="col-4 pd-0 text-end">
                                Losses:
                            </div>
                            <div className="col-4 pd-0 text-start">
                                {c.nlosses}
                            </div>
                        </div>
                        <div className="row pd-0">
                            <div className="col-4 pd-0 text-end">
                                % Won:
                            </div>
                            <div className="col-4 pd-0 text-start">
                                {
                                    (c.nwins + c.nlosses > 0) ?
                                        (100 * c.nwins / (c.nwins + c.nlosses)).toFixed(1) : 0
                                }
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal >
        )
    }

}