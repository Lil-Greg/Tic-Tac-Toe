import React, { useState } from 'react';
import './TicTacToe.sass';
import CoolModal from './Modal';
import { Board } from './Board';

type BoardArray = Array<Array<string | null>>

// Returning an array of 2 values
const makeComputerMove = (board: BoardArray): [/*Row and Col*/number, number] => {
    const emptyCells: [number, number][] = [];
    board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (!cell) {
                emptyCells.push([rowIndex, cellIndex])
            }
        })
    })

    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[randomIndex]
}

export const TicTacToe = () => {
    const initialBoard = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
    // Array has 3 rows (first Array) and 3 columns (2nd Array) where
    // All of the cells are null

    const [board, setBoard] = useState<BoardArray>(initialBoard);
    const [player, setPlayer] = useState<string>("X");
    const [winner, setWinner] = useState<string | null>(null);
    const [isNoWinner, setIsNoWinner] = useState<boolean>(false);

    const checkWinner = (board: BoardArray): string | null => {
        const lines = [
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

    const handleOnClick = (row: number, col: number) => {
        // if winner or board is not null
        if (board[row][col] || winner) {
            return;
        }
        const updatedPlayerBoard = board.map((newRow, rowIndex) =>
            newRow.map((cell, cellIndex) =>
                rowIndex === row && cellIndex === col ? player : cell));
        setBoard(updatedPlayerBoard);
        // Check Winner
        const newWinner = (checkWinner(updatedPlayerBoard));
        setWinner(newWinner);
        setPlayer('X')

        // No Winner
        // iterated through both array rows to check if the cell has null value
        const hasNullValue = updatedPlayerBoard.some((row) => row.some((cell) => cell === null))

        if (!winner && !hasNullValue) {
            setIsNoWinner(true);
            return;
        }

        // Computer's Move
        if (!winner) {
            // Destructuring the array of two values
            const [computerRow, computerCol] = makeComputerMove(updatedPlayerBoard);
            const updatedComputerBoard = updatedPlayerBoard.map((newRow, rowIndex) =>
                newRow.map((cell, cellIndex) =>
                    rowIndex === computerRow && cellIndex === computerCol ? "O" : cell)
            );
            setTimeout(() => {
                setBoard(updatedComputerBoard);
                setWinner(checkWinner(updatedComputerBoard));
            }, 200)
        }
    }

    const restartGame = () => {
        setBoard(initialBoard);
        setPlayer("X");
        setWinner(null);
        setIsNoWinner(false);
    }

    // Attempting to Add a Second Player

    return (
        <div className="game">
            <h1>Tic-Tac-Toe</h1>
            <Board board={board} handleClick={handleOnClick} />
            {winner && <p>{winner === "X" ? "You Win" : "Computer Wins"}</p>}
            {isNoWinner && <p>No One Wins</p>}
            <button className="reset" type='button' onClick={() => restartGame()}>Reset</button>
            <CoolModal />
        </div>
    )
}