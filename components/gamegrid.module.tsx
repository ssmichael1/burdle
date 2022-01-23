import React from 'react'
import dict from './words5.json'

const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BS']
]

interface Row {
    vals: Array<string | null>
    ref: React.RefObject<HTMLDivElement>;
}

interface GameState {
    showModal: boolean;
}
interface GameProps { }


export const gamerows = 6
export const wordlen = 5

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                asdfsdf
                <button onClick={handleClose}>Close</button>
            </section>
        </div>
    );
};

export default class GameGrid extends React.Component<GameProps, GameState> {

    cur_row: number;
    cur_letter: number;
    rows: Array<Row>
    theword: string;

    constructor(props: GameProps) {
        super(props)

        this.rows = Array.from(Array(gamerows)).map((v, i) => {
            return {
                vals: Array(wordlen).fill(null),
                ref: React.createRef()
            }
        })
        this.cur_row = 0
        this.cur_letter = 0
        let idx = Math.floor(Math.random() * dict.length)
        this.theword = 'steve'
        this.state = {
            showModal: false
        }
    }


    showModal = () => {
        console.log('showing modal')
        this.setState({ showModal: true });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    update() {
        this.setState(
            {
                showModal: this.state.showModal,
            }
        )
    }

    drawKeys(): any {
        return keyboard.map((keyrow, i) => {
            return (
                <div className="justify-content-center d-flex" key={"keyrow_" + i}>
                    <div className="d-flex row">
                        {keyrow.map((k, i) => {
                            let cname = "col keybox small";
                            if (k.length > 1) {
                                cname = "col keybox big";
                            }

                            return (
                                <div className={cname} key={'key_' + k}>{k}</div>
                            )
                        })}
                    </div>
                </div>
            )
        })
    }

    renderRow(row: Row, rownum: number): any {

        return (
            <div className="row" key={rownum} ref={this.rows[rownum].ref}>
                {row.vals.map((v, i) => {
                    let c = "letter column";
                    return (
                        <div key={rownum * 10 + i}
                            className={c}
                        >
                            {(v === null) ? '' : v}
                        </div>
                    )
                })}
            </div>
        )
    }

    onEnter() {

        if ((this.cur_letter == wordlen) && this.cur_row < (gamerows)) {
            let row = this.rows[this.cur_row]
            let ref = this.rows[this.cur_row].ref
            let testword = row.vals.join('').toLowerCase()
            if (ref.current === null)
                return;

            // Won Game!
            if (testword == this.theword) {
                Array.from(Array(wordlen)).map((v, i) => {
                    ref.current?.children.item(i)?.classList.add("match")
                })
                this.showModal()
            }
            // Not a word!
            else if (!dict.includes(testword)) {
                //this.cur_row = this.cur_row + 1;
                this.cur_letter = 0;
                if (ref.current != null) {
                    this.rows[this.cur_row].vals = Array(wordlen).fill(null)
                    Array.from(Array(wordlen)).map((v, i) => {
                        ref.current?.children.item(i)?.classList.remove("filled")
                    }
                    )
                    ref.current.classList.add("shake")
                    setTimeout(() => { ref.current?.classList.remove("shake") }, 500)
                    this.update()
                }
            }
            // Got a word
            else {
                Array.from(Array(wordlen)).map((v, i) => {
                    ref.current?.children.item(i)?.classList.remove("filled")

                    if (testword.slice(i, i + 1) == this.theword.slice(i, i + 1)) {
                        ref.current?.children.item(i)?.classList.add("match")
                    }
                    else if (this.theword.includes(testword.slice(i, i + 1))) {
                        ref.current?.children.item(i)?.classList.add("close")
                    }
                })

                // Are we on to the next row
                if (this.cur_row == gamerows - 1) {
                    return
                }
                else {
                    this.cur_row = this.cur_row + 1
                    this.cur_letter = 0
                }
            }
        }
    }

    handleKey(key: string) {
        let row = this.rows[this.cur_row]
        let ref = this.rows[this.cur_row].ref

        // Check for new backspace
        if (key === 'Backspace') {
            if (this.cur_letter > 0) {
                this.rows[this.cur_row].vals[this.cur_letter - 1] = null
                ref?.current?.children?.item(this.cur_letter - 1)?.classList.remove("filled")
                this.cur_letter -= 1;
                this.update()
            }
        }
        // Check for Enter
        if (key == 'Enter') {
            this.onEnter()
            this.update()
        }

        key = key.toUpperCase()
        // Check for new letter
        if ((key.length == 1) && (/[A-Z]/.test(key))) {
            if (this.cur_letter < wordlen) {
                row.vals[this.cur_letter] = key
                ref?.current?.children?.item(this.cur_letter)?.classList.add("filled")
                this.cur_letter += 1;
                this.update()
            }
        }

    }

    onKeyDown(e: any) {
        if (!(e instanceof KeyboardEvent))
            return
        this.handleKey(e.key)
    }



    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown.bind(this))
        // Ughh... need to do this only on client or server
        let idx = Math.floor(Math.random() * dict.length)
        this.theword = dict[idx];
        this.update()
    }
    componentWillUnmout() {
        document.removeEventListener("keydown", this.onKeyDown.bind(this))
    }

    render() {

        let html = (
            <div>
                <div className="container">word: {this.theword}</div>
                <div tabIndex={0} key='3' className="justify-content-center gamegrid">
                    {this.rows.map((r, i) => this.renderRow(r, i))}
                </div >
                <div className="pt-5"></div>
                <div className="containe justify-content-center keyboard">
                    {this.drawKeys()}
                </div>

                <Modal show={this.state.showModal} handleClose={this.hideModal}>
                    <p>Modal</p>
                    <p>Data</p>
                    <p>Word is ${this.theword}</p>
                </Modal>
            </div>

        )
        return html
    }

}