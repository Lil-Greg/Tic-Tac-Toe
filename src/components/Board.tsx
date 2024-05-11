import './TicTacToe.scss'

type BoardProps = {
    board: Array<Array<string | null>>,
    handleClick: (row: number, col: number) => void
}
/* Example of how the board will take in values
   With the Array of an Array
[
    ['X', null, null],
    [null, "O", null],
    ["X", null, "O"]
]
*/


export const Board = ({ board, handleClick }: BoardProps) => {
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="board_row">
                    {row.map((cell, cellIndex) => (
                        <button
                            key={cellIndex}
                            className={`cell ${cell ? `cell_${cell.toLowerCase()}` : ""}`}
                            // Tell the browser which cell is being clicked
                            onClick={() => handleClick(rowIndex, cellIndex)}>
                            {cell}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}