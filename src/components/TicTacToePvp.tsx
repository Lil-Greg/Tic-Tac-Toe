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
    const [p1Name, setP1Name] = useState<string | null>(null);
    const [p2Name, setP2Name] = useState<string | null>(null);
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
            [board[0][2], board[1][1], board[2][2]],
        ]
        for (const line of lines) {
            if (line[0] && line[0] === line[1] && line[1] === line[2]) {
                return line[0]
            }
        }
        return null
    }
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


    const handleOnClick = (row: number, col: number) => {
        // if winner or board is not null
        if (board[row][col] || winner) {
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
        setPlayer1('X')
        setTurn(false)

        // No Winner
        // iterated through both array rows to check if the cell has null value
        const hasNullValue = updatedPlayerBoard.some((row) => row.some((cell) => cell === null))

        if (!winner && !hasNullValue) {
            setIsNoWinner(true);
            return;
        }

        // Computer's Move
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
        setPlayer1("X");
        setPlayer2("O");
        setWinner(null);
        setIsNoWinner(false);
    }

    // Attempting to Add a Second Player

    return (
        <>
            {!p1Name ? (

                <form id="setName" onSubmit={handleSubmit}>
                    <div className="form-data">
                        <div className="form-floating mb-3">
                            <input type="text" ref={user1Ref} className="form-control" id="floatingInput" placeholder="Player 1 Name" />
                            <label htmlFor="floatingInput">Player 1 Name</label>
                        </div>
                        <div className="form-floating">
                            <input type="text" ref={user2Ref} className="form-control" id="floatingInput2" placeholder="Player 2 Name" />
                            <label htmlFor="floatingInput2">Player 2 Name</label>
                        </div>
                        <button type="submit">Set Names</button>
                    </div>
                </form>
            ) : (

                <div className="game">
                    <h1>{`${p1Name} vs. ${p2Name}`}</h1>
                    <Board board={board} handleClick={handleOnClick} />
                    {winner && <p>{winner === "X" ? p1Name : p2Name}</p>}
                    {isNoWinner && <p>No One Wins</p>}
                    <button className="reset" type='button' onClick={() => restartGame()}>Reset</button>
                </div>
            )}
        </>
    )
}