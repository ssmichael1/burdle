import React, { NewLifecycle } from 'react'
import dict from './words5.json'
import { Modal, Button } from 'react-bootstrap'
import { takeCoverage } from 'v8';
import BurdleCookie, { CookieFormat } from './burdlecookie'

const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BS']
]

type GameStatus = 'playing' | 'win' | 'loss';
type LetterStatus = 'notplayed' | 'played' | 'match' | 'inword' | 'nomatch'

interface Letter {
    val: string;
    status: LetterStatus;
}

interface Row {
    letters: Array<Letter>;
    shake: boolean;
}


interface GameState {
    showModal: boolean;
    rows: Array<Row>;
    status: GameStatus;
    theword: string;
}

interface GameProps { }

interface RowState { };
interface RowProps {
    val: Row;
    idx: number;
};

interface LetterProps {
    val: Letter;
    idx: number;
}
interface LetterState { };

export const gamerows = 6
export const wordlen = 5

const onlyUnique = (value: any, index: number, self: Array<any>) => {
    return self.indexOf(value) === index;
}

class GameLetter extends React.Component<LetterProps, LetterState> {
    ref: React.RefObject<HTMLDivElement>

    constructor(props: LetterProps) {
        super(props)
        this.ref = React.createRef()
    }

    render() {
        let c = "letter column";
        if (this.props.val.status == 'played') {
            c += " filled"
        }
        if ((this.props.val.status === 'match') ||
            (this.props.val.status === 'inword') ||
            (this.props.val.status === 'nomatch')) {
            setTimeout(() => {
                if (this.ref.current === null)
                    return
                if (this.props.val.status == 'match') {
                    this.ref.current.classList.add('match')
                }
                else if (this.props.val.status == 'inword') {
                    //c += ` close${this.props.idx}`
                    this.ref.current.classList.add('close')
                }
                else if (this.props.val.status == 'nomatch') {
                    //c += ` nomatch${this.props.idx}`
                    this.ref.current.classList.add('nomatch')
                }
            }, this.props.idx * 250)
        }

        return (
            <div
                className={c}
                ref={this.ref}
            >
                {this.props.val.val == '' ? null : this.props.val.val}
            </div>
        )
    }

}

class GameRow extends React.Component<RowProps, RowState> {

    ref: React.RefObject<HTMLDivElement>;

    constructor(props: RowProps) {
        super(props)
        this.ref = React.createRef()
    }

    render() {
        let c = "row"

        // Shake, but remove class so it can shake again
        // later if needed
        if (this.props.val.shake == true) {
            c += " shake"
        }
        return (
            <div className={c}
                key={`row${this.props.idx}`}
                ref={this.ref}
            >
                {
                    // Render letters
                    this.props.val.letters.map((v, i) => {
                        return (
                            <GameLetter
                                val={v}
                                idx={i}
                                key={`row${this.props.idx}_letter${i}`}
                            />
                        )
                    })
                }
            </div >
        )
    }
}

export default class GameGrid extends React.Component<GameProps, GameState> {

    cur_row: number;
    cur_letter: number;
    modal: any;

    match: Array<string>
    close: Array<string>
    nomatch: Array<string>

    modal_title() {
        return (
            this.state.status == 'win' ?
                'You Win' : 'You Lose'
        )
    }

    modal_body() {
        return (
            this.state.status == 'win' ?
                <div>Word is {this.state.theword}</div> :
                <div>Word is {this.state.theword}</div>
        )
    }

    static emptyrow(shake: boolean = false): Row {

        return {
            letters: Array.from(Array(wordlen)).map((w, i2) => {
                return {
                    val: '',
                    status: 'notplayed'

                }
            }),
            shake: shake
        }
    }

    constructor(props: GameProps) {
        super(props)

        this.cur_row = 0
        this.cur_letter = 0
        this.state = {
            showModal: false,
            rows: Array.from(Array(gamerows)).map((v, i) => {
                return GameGrid.emptyrow()
            }),
            theword: 'steve',
            status: 'playing'
        }
        this.match = []
        this.close = []
        this.nomatch = []
    }



    showModal = () => {
        this.setState({ showModal: true });
    };

    hideModal = () => {
        this.setState({ showModal: false });
        //document.getElementById("exampleModal")?.close()
    };


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
                            if (this.match.includes(k)) {
                                cname = cname + " match"
                            }
                            else if (this.close.includes(k)) {
                                cname = cname + " close"
                            }
                            else if (this.nomatch.includes(k)) {
                                cname = cname + " nomatch"
                            }
                            return (
                                <button className={cname}
                                    key={'key_' + k}
                                    onClick={() => {
                                        this.handleKey(k == 'BS' ? 'Backspace' :
                                            (k == 'ENTER' ? 'Enter' : k))
                                    }}
                                >
                                    {
                                        k == 'BS' ?
                                            <img src='backspace.svg' className='backspace' /> : k
                                    }
                                </button>
                            )
                        })}
                    </div>
                </div>
            )
        })
    }


    onEnter() {
        // Enter only valid at end of line
        if (this.cur_letter != wordlen)
            return

        let newstate = this.state

        // Get current row
        let row = newstate.rows[this.cur_row];

        // Get the testword    
        let testword = row.letters.reduce((s, letter, i) => {
            return s + letter.val
        }, '').toLowerCase()

        // Not a word!
        if (!dict.includes(testword)) {
            //this.cur_row = this.cur_row + 1;
            this.cur_letter = 0;
            this.state.rows[this.cur_row] =
                GameGrid.emptyrow(true)
            this.setState(this.state)
            // Turn off shake after 250 ms
            setTimeout(() => {
                this.state.rows[this.cur_row] =
                    GameGrid.emptyrow(false)
                this.setState(this.state)
            }, 250)
            return
        }

        // Got a word
        let localmatches: Array<string> = []

        // Look for exact matches
        Array.from(Array(wordlen)).map((v, i) => {
            let letter = testword.slice(i, i + 1)
            let theword = this.state.theword;
            if (letter === theword.slice(i, i + 1)) {
                row.letters[i].status = 'match'
                this.match.push(testword.slice(i, i + 1).toUpperCase())
                localmatches.push(letter)
            }
        })

        Array.from(Array(wordlen)).map((v, i) => {
            let letter = testword.slice(i, i + 1)
            let theword = this.state.theword

            // CLose match but not previous exact
            if ((theword.includes(letter)) && (!localmatches.includes(letter))) {
                row.letters[i].status = 'inword'
                this.close.push(letter.toUpperCase())
            }
            // no matches
            else if (letter != theword.slice(i, i + 1)) {
                row.letters[i].status = 'nomatch'
                this.nomatch.push(letter.toUpperCase())
            }

        })
        this.match = this.match.filter(onlyUnique)
        this.close = this.close.filter(onlyUnique)
        this.nomatch = this.nomatch.filter(onlyUnique)

        // Won Game!
        if (testword == newstate.theword) {
            setTimeout(this.showModal.bind(this), 1100)
            this.setState({
                ...this.state,
                status: 'win'
            })
            let c = BurdleCookie.get()
            BurdleCookie.set({
                ...c,
                nwins: c.nwins + 1,
                nplayed: c.nplayed + 1
            })
            return
        }
        // Lost Game!
        else if (this.cur_row == gamerows - 1) {
            this.setState({
                ...this.state,
                status: 'loss'
            })
            let c = BurdleCookie.get()
            BurdleCookie.set({
                ...c,
                nlosses: c.nlosses + 1,
                nplayed: c.nplayed + 1
            })
            setTimeout(this.showModal.bind(this), 1100)
        }
        // on to the next row
        else {
            this.cur_row = this.cur_row + 1
            this.cur_letter = 0
            this.setState(newstate)
        }

    }

    handleKey(key: string) {
        if (this.state.status !== 'playing')
            return

        let row = this.state.rows[this.cur_row]

        // Check for new backspace
        if (key === 'Backspace') {
            if (this.cur_letter > 0) {
                row.letters[this.cur_letter - 1].val = ''
                row.letters[this.cur_letter - 1].status = 'notplayed'
                this.cur_letter -= 1;
                this.setState(this.state)
            }
            return
        }
        // Check for Enter
        else if (key == 'Enter') {
            this.onEnter()
            return
        }

        key = key.toUpperCase()
        // Check for new letter
        if ((key.length == 1) && (/[A-Z]/.test(key))) {
            if (this.cur_letter < wordlen) {
                row.letters[this.cur_letter].val = key
                row.letters[this.cur_letter].status = 'played'
                this.cur_letter += 1;
                this.setState(this.state)
                return
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
        // Ughh... need to do this only on client
        // or different random values flag an error 
        let idx = Math.floor(Math.random() * dict.length)
        this.setState(
            {
                ...this.state,
                theword: dict[idx]
            }
        )
    }


    componentWillUnmout() {
        document.removeEventListener("keydown", this.onKeyDown.bind(this))
    }

    render() {

        let html = (
            <div className="justify-content-center">
                <div className="justify-content-center d-flex pb-5">
                    <div key='gamegrid' className="column justify-content-center gamegrid">
                        {
                            // Render rows
                            Array.from(Array(gamerows)).map((v, i) => {
                                return (
                                    <GameRow
                                        key={'row' + i}
                                        val={this.state.rows[i]}
                                        idx={i} />
                                )
                            })
                        }
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="column justify-content-center keyboard">
                        {this.drawKeys()}
                    </div>
                </div>
                <Modal show={this.state.showModal} onHide={this.hideModal} backdrop="static"
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.modal_title()}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.modal_body()}
                    </Modal.Body>
                </Modal>
            </div >

        )
        return html
    }

}