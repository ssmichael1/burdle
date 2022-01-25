import React, { NewLifecycle } from 'react'
import { Modal, Button } from 'react-bootstrap'
import gitinfo from './githash.json'

interface InfoModalProps {
    show: boolean,
    hideFunc: { (): void }
}
interface InfoModalState { }


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

const bftext = (t: string) => {
    return (
        <span className="burdletext">{t}</span>
    )
}


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
                    <Modal.Title>
                        {burdle()}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container infotext">
                        {burdle()} is similar to {wordle()}, <i>except</i> it is possible to play as many times as you would like rather than once a day.
                    </div>
                    <div className="container infotext">
                        {bftext('Rules:')} Try to guess 5-letter word.  Press enter to submit guess.  After each guess, the color of the tiles indicate the status of your guess.  For example if the word to guess is {bftext('STOCK')} and you enter the word {bftext('PORCH')}, you will see:
                        <div className="pt-1">
                            <div className="d-inline p-2 keybox nomatch">P</div>                            <div className="d-inline p-2 keybox close">O</div>
                            <div className="d-inline p-2 keybox nomatch">R</div>                            <div className="d-inline p-2 keybox match">C</div>
                            <div className="d-inline p-2 keybox nomatch">H</div>
                        </div>
                        <div className="pt-1">
                            The letter {bftext('O')} is in the word, but not in the right place, the letter {bftext('C')} is in the word and in the correct (4th) place, and the letters {bftext('P')}, {bftext('R')}, and {bftext('H')} are not in the word.  You have 6 guesses to get the correct word.
                        </div>
                    </div>
                    <div className="container infotext">
                        {burdle()} is statically hosted by github pages.  Source code is at: <a href="https://github.com/stevensamirmichael/burdle">https://github.com/stevensamirmichael/burdle</a>
                        <p></p>
                        <p>Current git hash: {gitinfo.githash}</p>
                    </div>
                    <div className="container infotext">
                        Contact Info: Steven Michael <a href="mailto:ssmichael@gmail.com">ssmichael@gmail.com</a>
                    </div>

                </Modal.Body>

            </Modal >
        )
    }

}