import React, { useRef, useState } from 'react';
import './TicTacToe.scss';
import { Board } from './Board';
import 'bootstrap';

type BoardArray = Array<Array<string | null>>

export const TicTacToePvp = () => {
    const initialBoard = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
    // Array has 3 rows (first Array) and 3 columns (2nd Array) where
    // All of the cells are null

    const [board, setBoard] = useState<BoardArray>(initialBoard);
    const [player1, setPlayer1] = useState<string>("X");
    const [player2, setPlayer2] = useState<string>("O");
    const [turn, setTurn] = useState<boolean | null>(null)
    const [winner, setWinner] = useState<string | null>(null);
    const [isNoWinner, setIsNoWinner] = useState<boolean>(false);
    const [winningCells, setWinningCells] = useState<Array<string | number> | undefined>(undefined);
    const [p1Name, setP1Name] = useState<Array<string | null> | null>(null);
    const [p2Name, setP2Name] = useState<string | number | null>(null);
    const user1Ref = useRef(null);
    const user2Ref = useRef(null);

    const checkWinner = (board: BoardArray): string | null => {
        const lines = [
            // board[row][cell], board[0][0] = 1st row, 1st column
            // Rows
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            // Columns
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            // Diagonal
            [board[0][0], board[1][1], board[2][2]],
            [board[2][0], board[1][1], board[0][2]],
        ]
        for (const [index, line] of lines.entries()) {
            // Check if all cells in the line are the same and not null
            if (line[0] && line[0] === line[1] && line[1] === line[2]) {
                // Determine winning cells
                const winningCells: Array<string | number> = [];
                for (let i = 0; i < line.length; i++) {
                    let cellIndex: string = '';

                    // Determine row and column indices for each winning cell
                    if (index <= 2) {
                        // Row win
                        cellIndex = `${index}${i}`;
                    } else if (index <= 5) {
                        // Column win
                        cellIndex = `${i}${index - 3}`;
                    } else if (index === 6) {
                        // Diagonal (top-left to bottom-right)
                        cellIndex = `${i}${i}`;
                    } else if (index === 7) {
                        // Diagonal (bottom-left to top-right)
                        cellIndex = `${i}${2 - i}`;
                    }

                    winningCells.push(cellIndex);
                }

                // Store winning cells as comma-separated string
                setWinningCells([winningCells.join(',')]);
                // Return the winner ('X' or 'O')
                return line[0];
            }
        }
        return null
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const user1 = user1Ref.current?.value;
        const user2 = user2Ref.current?.value;

        // Check if user1 and user2 have valid values
        if (user1 && user2) {
            setP1Name(user1);
            setP2Name(user2);
            localStorage.setItem("Player 1", user1);
            localStorage.setItem("Player 2", user2);
        }
    }

    // Setting Winning Cells
    const handleWinningCells = (): Array<string> => {
        const highlightedCells: Array<string> = [];

        if (winningCells) {
            for (const cell of winningCells) {
                if (typeof cell === 'string') {
                    const [row, col] = cell.split('').map(Number);
                    const cellValue = board[row][col];
                    if (cellValue !== null) {
                        highlightedCells.push(cellValue);
                    }
                }
            }
        }

        console.log('Highlighted cells:', highlightedCells);
        return highlightedCells;
        // Now you can use highlightedCells to apply styles or perform other actions
    };

    const handleOnClick = (row: number, col: number) => {
        // if winner or board is not null
        if (board[row][col] || winner) {
            for (const forStorage in winningCells) {
                localStorage.setItem('Winning Cells', forStorage)
            }
            handleWinningCells();
            return;
        }
        // Handle the player 1 clicks,
        // Check the row and col they click
        // Then set the cell to X
        const updatedPlayerBoard = board.map((newRow, rowIndex) =>
            newRow.map((cell, cellIndex) =>
                rowIndex === row && cellIndex === col ? player1 : cell));
        setBoard(updatedPlayerBoard);
        // Check Winner
        let newWinner = (checkWinner(updatedPlayerBoard));
        setWinner(newWinner);
        setPlayer1('X');
        setTurn(true);

        // No Winner
        // iterated through both array rows to check if the cell has null value
        const hasNullValue = updatedPlayerBoard.some((row) => row.some((cell) => cell === null))

        if (!winner && !hasNullValue) {
            setIsNoWinner(true);
            return;
        }

        // Player 2's Move
        if (!winner && turn === true) {
            // Destructuring the array of two values
            const updatedPlayer2Board = updatedPlayerBoard.map((newRow, rowIndex) =>
                newRow.map((cell, cellIndex) =>
                    rowIndex === row && cellIndex === col ? player2 : cell)
            );
            setBoard(updatedPlayer2Board);
            newWinner = (checkWinner(updatedPlayer2Board));
            setWinner(newWinner);
            setPlayer2("O");
            setTurn(false);
        } else {
            return;
        }
    }

    const restartGame = () => {
        setBoard(initialBoard);
        setWinningCells(undefined);
        setPlayer1("X");
        setPlayer2("O");
        setWinner(null);
        setTurn(null);
        setIsNoWinner(false);
    }

    // Attempting to Add a Second Player

    return (
        <>
            {!p1Name ? (

                <form id="setName" onSubmit={handleSubmit}>
                    <div className="form-data">
                        <div className="form-floating mb-3">
                            <input type="text" style={{ textTransform: "capitalize" }} ref={user1Ref} className="form-control" id="floatingInput" placeholder="Player 1 Name" />
                            <label htmlFor="floatingInput">Player 1 Name</label>
                        </div>
                        <div className="form-floating">
                            <input type="text" style={{ textTransform: "capitalize" }} ref={user2Ref} className="form-control" id="floatingInput2" placeholder="Player 2 Name" />
                            <label htmlFor="floatingInput2">Player 2 Name</label>
                        </div>
                        <button type="submit">Set Names</button>
                    </div>
                </form>
            ) : (

                <div className="game">
                    <h1>{turn && turn === true ? ( // if turn is true
                        <><span className="player-turn">{p1Name}</span><span> vs. {p2Name}</span></>
                    ) : ( // if turn is false or null
                        <><span>{p1Name} vs. </span><span className="player-turn">{p2Name}</span></>)}</h1>
                    <Board board={board} handleClick={handleOnClick} />
                    {winner && <p>{winner === "X" ? `${p1Name} (X) Wins!` : `${p2Name} (O) Wins!`} with cells: {winningCells}</p>}
                    {isNoWinner && <p>No One Wins</p>}
                    <button className="reset" type='button' onClick={() => restartGame()}>Reset</button>
                </div>
            )}
        </>
    )
}